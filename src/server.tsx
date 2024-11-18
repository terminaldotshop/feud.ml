console.log("Importing and starting server...")

import { State } from "./generated/src/agg.js"
import * as Bus from "./events.ts"
import * as Track from "./app-state.ts"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

const state = Bus.getState()

let id = 0
function getName() {
  return `audience${++id}`
}

Bus.listen("twitch", (state, tags, msg) => {
  if (!state.running) {
    return
  }
  State.process_msg(state, tags.username, msg.replaceAll("\\", "_"))
})

Bus.listen("survey.opened", (state, questions) => {
  Track.surveyOpened(state)
  console.log("=> SURVEY OPENED", questions);
  if (state.running) {
    console.log("-> Already running?")
    return
  }

  state.running = true
  state.questions = questions
  sync_states()
})

const LOCAL_TESTING = true;

let sockets = new Set();
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
    }  else if (url.pathname === "/answer") {
      try {
        const { idx, answer } = await req.json();
        Bus.emit("audience", getName(), `${idx}.${answer}`)
        console.log("idx", idx, "answer", answer)

        for (let i = 0; i < 5; ++i) {
          State.process_msg(Bus.getState(), getName(), `${idx}.${answer}`)
        }

      } catch { }
    } else if (url.pathname === "/") {
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
