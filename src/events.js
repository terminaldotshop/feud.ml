import { State } from "./generated/src/agg.js"
import {Client} from "tmi.js";
import * as fs from "fs"

let state = State.empty()
export function getState() {
  return state
}

const listeners = { }
export function emit(type, ...args) {
    const cbs = listeners[type]
    console.log("BUS#emit", type)
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
	  if (t !== "survey.opened") {
		return
	  }

	  emit("survey.opened", state, parsed.questions)
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

	emit("twitch", getState(), tags, message)
  });
}

export function startDashboardClient() {
  let ws = null
  function connect() {
    ws = new WebSocket(process.env.GAME_WS_ENDPOINT);
    let pingInterval;

    ws.onopen = () => {
      console.log("WebSocket connection opened.");
      // Start sending ping messages every 10 seconds
      pingInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }));
          console.log("Sent ping to server");
        }
      }, 10000); // 10 seconds
    };

    ws.onclose = (event) => {
      console.log("ws.onclose", event);
      // Stop the ping messages
      if (pingInterval) clearInterval(pingInterval);
      console.log("Attempting to reconnect in 1 second...");
      setTimeout(() => {
        connect();
      }, 100);
    };

    ws.onerror = (error) => {
      console.log("ws.onerror", error);
      ws.close(); // Close the socket to trigger onclose
    };

    ws.onmessage = (msg) => {
      try {
        console.log(msg.data);
        const data = JSON.parse(msg.data);
        const ty = data.type;
        if (ty === "survey.opened") {
          if (!Array.isArray(data.questions)) {
            throw new Error("malformed round.start");
          }
          emit("survey.opened", state, data.questions);
        }
      } catch (e) {
        console.log("[dashboard-client]", e);
      }
    };
  }

  listen("round-answers", function(objectToSend) {
    const out = JSON.stringify(objectToSend, null, 4)
    fs.writeFileSync("./to-dax-from-prime",out)
    ws.send(out);
  });

  connect();
}
