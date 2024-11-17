import { State } from "./generated/src/agg.js"
import * as Bus from "./events.js"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

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
