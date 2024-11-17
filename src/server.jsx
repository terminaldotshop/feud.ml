import { State, Transform } from "./generated/src/agg.js"
import * as Bus from "./events.js"
import * as LLM from "./llm.ts"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";
import * as fs from "fs"
import { processResponse } from "./round.end.js";

const state = Bus.getState()

Bus.startDashboardClient()
Bus.startTwitchClient()

Bus.listen("twitch", (state, tags, msg) => {
  console.log("new twitch msg: runnig =", state.running)
  if (!state.running) {
    return
  }
  State.process_msg(state, tags, msg)
})

Bus.listen("survey.opened", (state, questions) => {
  console.log("=> SURVEY OPENED");
  if (state.running) {
    console.log("-> Already running?")
    return
  }

  state.running = true
  state.questions = questions
})

Bus.listen("survey.closed", async (state) => {
  console.log("SURVEY CLOSED", state.running)
  if (!state.running) {
    return
  }
  state.running = false
  const t = Transform.transform(state)

  for (let i = 0; i < t.questions.length; ++i) {
    const answers = t.answers[i]
    const proompt = LLM.createProompt(t.questions[i], answers)
    fs.writeFileSync(`./prompt-${i}`, proompt)
    console.log("proompt", proompt)
    const promptResponse = await LLM.proomptMeDaddy(proompt)
    // const promptResponse = await  LLM.structuredPrompt(proompt)
    fs.writeFileSync(`./response-${i}`, promptResponse.content[0].text)
    const msg = processResponse(promptResponse.content[0].text)

    Bus.emit("round-answers", msg)

    console.log("just a hobby fellas", msg.slice(0, 8))
  }
})

let id = 0
function getName() {
  return `audience${++id}`
}
// Import the Bun server module
const server = Bun.serve({
  port: process.env.PORT,
  websocket: {
    open(ws) {
      console.log("OPENED!")

      // TODO: REMOVE THIS WHEN WE HAVE REAL DASHBOARD
      if (!state.running) {
        setTimeout(() => {
          state.running = true
          ws.send(JSON.stringify(state))
        }, 5000);
      }
    },
    message(ws, _) { ws.send(JSON.stringify(state)) },
  },
  fetch: async (req) => {
    const url = new URL(req.url);

    // Simple routing logic
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    } else if (url.pathname === "/answer") {
      try {
        const { idx, answer } = await req.json();
        console.log("idx", idx, "answer", answer)

        for (let i = 0; i < 5; ++i) {
          const res = State.process_msg(Bus.getState(), {
            username: getName(),
          }, `${idx}.${answer}`)
          console.log("response", res)
        }

      } catch { }
      return new Response("<div>good</div>", {
        headers: { "Content-Type": "text/html", },
        status: 200
      });
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
    } else if (url.pathname.startsWith("/assets")) {
      return new Response(Bun.file(`./dist${url.pathname}`), {
        status: 200,
      });
    }

    return new Response("???", { status: 404 });
  },
});

// Log server details
console.log(`Server is running at http://localhost:${server.port}`);

setTimeout(function() {
  Bus.emit("survey.opened", Bus.getState(), [
    "What programming language has the most virgins?"
  ]);
}, 2 * 1000);

setTimeout(function() {
  Bus.emit("survey.closed", Bus.getState());
}, 45 * 1000);

