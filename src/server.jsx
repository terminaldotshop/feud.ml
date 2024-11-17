import { State, Transform } from "./generated/src/agg.js"
import * as Bus from "./events.js"
import * as LLM from "./llm.js"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";
import * as fs from "fs"

const state = Bus.getState()
// state.running= true;
// state.questions = ["This is the first question?"]

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

    const now = Date.now()
    for (let i = 0; i < t.questions.length; ++i) {
        const answers = t.answers[i]
        const proompt = LLM.createProompt(t.questions[i], answers)
        fs.writeFileSync(`./prompt-${i}`, proompt)
        console.log("proompt", proompt)
        const promptResponse = await LLM.promptMeDaddy(proompt)
        fs.writeFileSync(`./response-${i}`, promptResponse.content[0].text)
        const promptAnswers = JSON.parse(promptResponse.content[0].text)
        console.log("promptResponse", promptAnswers)
    }
})

// Import the Bun server module
const server = Bun.serve({
    port: process.env.PORT,
    websocket: {
		open(ws) {
			console.log("OPENED!")
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

		return new Response("???", { status: 404 });
    },
});

// Log server details
console.log(`Server is running at http://localhost:${server.port}`);
