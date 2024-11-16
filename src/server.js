import { process_msg, empty } from "./generated/src/agg.js"
import {Client} from "tmi.js";

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

const state = empty()
// Listen for chat messages
client.on("message", (channel, tags, message, self) => {
    if (self) {
        return;
    }

    process_msg(state, tags, message)

    console.log(state.users)
});


