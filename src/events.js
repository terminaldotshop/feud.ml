import { State } from "./generated/src/agg.js"
import {Client} from "tmi.js";
let state = State.empty()

export function getState() {
    return state
}

const listeners = { }
export function emit(type, ...args) {
    const cbs = listeners[type]
    if (!cbs || cbs.length === 0) {
        return
    }

    for (const cb of cbs) {
        cb(...args)
    }
}

export function listen(type, cb) {
    let cbs = listeners[type]
    if (!cbs) {
        listeners[type] = cbs = []
    }

    cbs.push(cb)
}

export function emitBySocket(ws) {
    ws.addEventListener("message", msg => {
        try {
            const parsed = JSON.parse(msg)
            const t = parsed.type
            if (t !== "round.start") {
                return
            }

            if (!Array.isArray(parsed.questions)) {
                throw new Error("malformed round.start")
            }

            emit("round.start", state, parsed.questions)
        } catch (e) {
        }
    })
}

export function startTwitchClient() {
    // Create a client for read-only access (anonymous connection)
    const client = new Client({
        connection: {
            secure: true,
            reconnect: true,
        },
        channels: ["theprimeagen"]
    });

    // Connect to Twitch
    client.connect()
        .then(() => console.log("Connected anonymously!"))
        .catch(console.error);

    // Listen for chat messages
    client.on("message", (channel, tags, message, self) => {
        if (self) {
            return;
        }

        emit("twitch", state, tags, message)
    });
}
