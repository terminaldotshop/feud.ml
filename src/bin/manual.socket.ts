import * as readline from "readline";

const sockets: any[] = []

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.on("line", readLine);

const nouns = [
  "foo",
  "kev",
  "sass",
  "react",
  "solid",
  "ocaml",
  "bar",
]

const adjs = [
  "fuzzy",
  "warm",
  "wild",
  "galloping",
  "angry",
]

function name() {
  return `${adjs[Math.floor(Math.random() * adjs.length)]}.${nouns[Math.floor(Math.random() * nouns.length)]}`
}

let sendMessages = false
async function sendAudienceMessage(answer, idx) {
    await fetch('http://localhost:3000/answer', {
      method: "POST",
      body: JSON.stringify({
        idx,
        answer,
      })
    });
}

async function sendTwitchMessage(answer, idx) {
    await fetch('http://localhost:3000/fake-twitch-msg', {
      method: "POST",
      body: JSON.stringify({
        idx,
        answer,
        name: name(),
      })
    });
}

let msg = 1
async function sendMsgs() {
  while (sendMessages) {
    const which = Math.floor(Math.random() * 2)
    if (which === 1) {
      sendTwitchMessage(`twitch:${msg++}`, Math.floor(Math.random() * 10));
    } else {
      sendAudienceMessage(`audience:${msg++}`, Math.floor(Math.random() * 10));
    }
    await (new Promise(res => setTimeout(res, 500)))
  }
}

async function readLine(line) {
    if (line === "open") {
      console.log("starting survey for", sockets.length, "sockets")
      sendMessages = true;
      for (const s of sockets) {
        s.send(JSON.stringify({
          type: "survey.opened",
          questions: [
            "how many 1",
            "how many 2",
            "how many 3",
            "how many 4",
            "how many 5",
            "how many 6",
            "how many 7",
            "how many 8",
            "how many 9",
            "how many 10",
          ]
        }));

      sendMsgs();
    }
  } else if (line === "close") {
    sendMessages = false
  }
}

export const server = Bun.serve({
  port: 6969,
  websocket: {
    open(ws) {
      console.log("socket open")
      sockets.push(ws)
    },
    message(ws, msg) {
      console.log("Received: ", msg)
    },
    close(ws, _) {
      console.log("socket closed");
      sockets.splice(sockets.indexOf(ws), 1)
    }
  },
  fetch: async (req) => {
    const url = new URL(req.url);

    // Simple routing logic
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return; // do not return a Response
      }
      return new Response("Upgrade failed", { status: 500 });
    }
  }
})
