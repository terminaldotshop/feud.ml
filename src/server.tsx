console.log("Importing and starting server...")

import { State } from "./generated/src/agg.js"
import * as Bus from "./events.ts"
import * as Track from "./app-state.ts"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

const state = Bus.getState()

let id = 0
function getName(): {username: string} {
  return {
    username: `audience${++id}`
  }
}

Bus.listen("survey.message", (state, type, tags, msg) => {
  if (!state.running) {
    return
  }
  Track.messageReceived(state, type, tags.username, msg)
  State.process_msg(state, tags.username, msg.replaceAll("\\", "_"))
})

Bus.listen("survey.opened", (state, questions) => {
  Track.reset(state)
  Track.surveyOpened(state)
  Track.questionsReceived(state, questions)

  console.log("=> SURVEY OPENED", questions);
  if (state.running) {
    console.log("-> Already running?")
    return
  }

  state.running = true
  state.questions = questions
  sync_states()

  console.log("waiting for 2 minutes")
  setTimeout(function() {
    Bus.emit("survey.closed", Bus.getState());
  }, 10 * 1000);
})

const LOCAL_TESTING = true;

let sockets = new Set<any>();
function sync_states() {
  for (const socket of sockets) {
    socket.send(JSON.stringify(state))
  }
};

// Import the Bun server module
export const server = Bun.serve({
  port: process.env.PORT,
  websocket: {
    open(ws) { sockets.add(ws); },
    message(ws, _) { ws.send(JSON.stringify(state)) },
    close(ws, _) { sockets.delete(ws); }
  },
  fetch: async (req) => {
    const url = new URL(req.url);

    // Simple routing logic
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    }  else if (url.pathname === "/fake-twitch-msg") {
      try {
        const { idx, answer, name } = await req.json();
        Bus.emit("survey.message", state, "twitch", {username: name}, `${idx}.${answer}`)
      } catch { }
    }  else if (url.pathname === "/answer") {
      try {
        const { idx, answer } = await req.json();

        for (let i = 0; i < 5; ++i) {
          Bus.emit("survey.message", state, "audience", getName(), `${idx}.${answer}`)
        }

      } catch { }
    } else if (url.pathname === "/") {
      // @ts-ignore
      const app = ReactDOMServer.renderToString(<App state={Bus.getState()} />)
      const index = await Bun.file("./dist/index.html").text()
      const html = index.
        replace("<!--app-html-->", app).
        replace("__STATE__", JSON.stringify(Bus.getState(), function(k, v) {
          if (k === "users") {
            return undefined;
          }
          return v;
        }))

      return new Response(html, {
        headers: { "Content-Type": "text/html", },
        status: 200
      });
    } else if (url.pathname.startsWith("/public")) {
      return new Response(Bun.file(`./${url.pathname}`), {
        status: 200,
      });
    } else if (url.pathname.startsWith("/assets")) {
      return new Response(Bun.file(`./dist${url.pathname}`), {
        status: 200,
      });
    }

    if (LOCAL_TESTING) {
      if (url.pathname === "/debug/running") {
        state.running = true;
        sync_states();
      }
    }

    return new Response("???", { status: 404 });
  },
});

// Log server details
console.log(`Server is running at http://localhost:${server.port}`);
