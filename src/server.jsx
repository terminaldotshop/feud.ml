import { process_msg } from "./generated/src/agg.js"
import * as Bus from "./events.js"

import * as ReactDOMServer from "react-dom/server";
import App from "./generated/src/App.js";

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
        switch (url.pathname) {
        case "/":
            const app = ReactDOMServer.renderToString(<App state={Bus.getState()} />)
            return new Response(app, {
                headers: {
                    "Content-Type": "text/html",
                },
                status: 200
            });
        }
    },
});

// Log server details
console.log(`Server is running at http://localhost:${server.port}`);
