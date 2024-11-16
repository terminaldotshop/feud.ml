import { process_msg } from "./generated/src/agg.js"
import * as Bus from "./events.js"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

import { join } from "path";
import * as fs from "fs";
//const index = fs.readFileSync("./dist/index.html").toString()

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
    port: process.env.PORT,
    fetch(req) {
        const url = new URL(req.url);

        // Simple routing logic
        if (url.pathname === "/") {
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
