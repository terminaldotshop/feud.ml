import * as Track from "./app-state.ts"
import { State } from "./generated/src/agg.js"
import { Client } from "tmi.js";
import * as fs from "fs"

// Define a mapping of event types to their associated arguments
type EventMap = {
  "survey.closed": (state: AppState) => void
  "survey.opened": (state: AppState, questions: string[]) => void
  "survey.message": (state: AppState, type: "twitch" | "audience", tags: {username: string}, message: string) => void
  "round-answers": (toDax: ToDax) => void
};

let state: AppState = Track.reset(State.empty())

export function getState(): AppState {
  return state
}

// Generic type for listener storage
const listeners: { [K in keyof EventMap]?: Array<EventMap[K]> } = {};

export function emit<K extends keyof EventMap>(type: K, ...args: Parameters<EventMap[K]>) {
  const cbs = listeners[type]
  if (!cbs) {
    return
  }

  for (const cb of cbs) {
    // @ts-ignore, f this
    cb(...args)
  }
}

export function listen<K extends keyof EventMap>(type: K, cb: EventMap[K]) {
  let cbs = listeners[type]
  if (!cbs) {
    listeners[type] = cbs = []
  }

  cbs.push(cb)
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

  // @ts-ignore: Listen for chat messages
  client.on("message", (channel, tags, message, self) => {
    if (self) {
      return;
    }

    emit("survey.message", getState(), "twitch", tags, message)
  });
}

export function startDashboardClient() {
  let ws: null | WebSocket = null
  function connect() {
    const url = process.env.GAME_WS_ENDPOINT
    if (!url) {
      throw new Error("no websocket url")
    }
    ws = new WebSocket(url);

    ws.onopen = () => { console.log("WebSocket connection opened."); };
    ws.onclose = (event) => {
      console.log("ws.onclose", event);
      console.log("Attempting to reconnect in 1 second...");
      setTimeout(() => {
        connect();
      }, 100);
    };

    ws.onerror = (error) => {
      console.log("ws.onerror", error);
      if (ws) {
        ws.close(); // Close the socket to trigger onclose
      }
    };

    ws.onmessage = (msg) => {
      try {
        console.log(msg.data);
        const data: DaxMessage = JSON.parse(msg.data);
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
    console.log("dashboard:listen:round-answers")
    const out = JSON.stringify(objectToSend, null, 4)
    fs.writeFileSync("./logs/sent-to-dashboard.txt", out)
    if (ws !== null) {
      Track.sentDax(getState());
      ws.send(out);
    } else {
      Track.cannotSendDax(getState(), "ws === null while sending to dax");
    }
  });

  connect();
}
