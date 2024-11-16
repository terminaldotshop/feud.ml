import { process_msg } from "./generated/src/agg.js"
import * as Bus from "./events.js"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

import { join } from "path";
import * as fs from "fs";
//const index = fs.readFileSync("./dist/index.html").toString()


const state = Bus.getState()
state.questions[0] = "foo my bar 1"
state.questions[1] = "foo my bar 2"
state.questions[2] = "foo my bar 3"
state.questions[3] = "foo my bar 4"
state.questions[4] = "foo my bar 5"
state.questions[5] = "foo my bar 6"
state.questions[6] = "foo my bar 7"
state.questions[7] = "foo my bar 8"
state.questions[8] = "foo my bar 9"
state.questions[9] = "foo my bar 10"
state.running = true

Bus.twitchChat()
Bus.listen("twitch", (state, tags, msg) => {
    if (!state.running) {
        return
    }
    process_msg(state, tags, msg)
})

Bus.listen("round.start", (state, questions) => {
    if (state.running) {
        return
    }
    state.running = true
    state.questions = questions
    setTimeout(function() {
        state.running = false
    }, 5000);
})

// Import the Bun server module
const server = Bun.serve({
    websocket: {
        message(ws, message) {
            ws.send(JSON.stringify(Bus.getState()))
        },
        open(ws) {
            ws.send(JSON.stringify(Bus.getState()))
        },
    },
    port: process.env.PORT,
    fetch(req) {
        const url = new URL(req.url);

        // Simple routing logic
        if (url.pathname === "/ws") {
            if (server.upgrade(req)) {
              return; // do not return a Response
            }
            return new Response("Upgrade failed", { status: 500 });
        } else if (url.pathname === "/") {
            const app = ReactDOMServer.renderToString(<App state={Bus.getState()} />)
            const index = fs.readFileSync("./dist/index.html").toString()
            const html = index.
                replace("<!--app-html-->", app).
                replace("__STATE__", JSON.stringify(Bus.getState(), function(k, v) {
                    if (k === "users") {
                        return undefined;
                    }
                    return v;
                }))

            return new Response(html, {
                headers: {
                    "Content-Type": "text/html",
                },
                status: 200
            });
        } else if (url.pathname.startsWith("/assets")) {
            const index = Bun.file(`./dist${url.pathname}`)
            return new Response(index, {
                status: 200,
            });
        }
    },
});

// Log server details
console.log(`Server is running at http://localhost:${server.port}`);
