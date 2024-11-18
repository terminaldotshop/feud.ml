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

const answers = [
  "react",
  "angular",
  "htmx",
  "vue.js",
  "I love",
  "penis",
  "pen15",
  "8==D",
  "8=D",
  "8===D",
  "z\"ig",
  "zig",
  "c++",
  "complete nonsense poop pants",
  "sex",
  "handjob",
  "cum",
  "come on me",
  "do not come",
  "Donald Trump",
  "Sadness",
  "I made mistakes in my life",
  "Unit tests",
  "API",
  "Function",
  "Variable",
  "Class",
  "Object",
  "Loop",
  "Array",
  "Debug",
  "Compile",
  "Refactor",
  "Async",
  "Await",
  "Callback",
  "Parameter",
  "Argument",
  "Interface",
  "Module",
  "Dependency",
  "Library",
  "Framework",
  "Commit",
  "Push",
  "Pull",
  "Merge",
  "Branch",
  "Conflict",
  "Build",
  "Test",
  "Deploy",
  "Production",
  "Staging",
  "DevOps",
  "CI/CD",
  "Pipeline",
  "Environment",
  "Server",
  "Client",
  "Endpoint",
  "Query",
  "Mutation",
  "Schema",
  "Middleware",
  "Token",
  "Authentication",
  "Authorization",
  "Encryption",
  "SSL",
  "Certificate",
  "HTTP",
  "Protocol",
  "Socket",
  "Port",
  "Proxy",
  "Cache",
  "Latency",
  "Bandwidth",
  "Request",
  "Response",
  "Status",
  "Debugger",
  "Error",
  "Exception",
  "Logging",
  "Trace",
  "Console",
  "Script",
  "Command",
  "Execute",
  "Run",
  "Thread",
  "Process",
  "Lock",
  "Mutex",
  "Semaphore",
  "Timeout",
  "Interval",
  "Namespace",
  "Package",
  "Import",
  "Export",
  "Install",
  "Update",
  "Upgrade",
  "Rollback",
  "Dependency",
  "Version",
  "Tokenize",
  "Parse",
  "Serialize",
  "Destructure",
  "Hash",
  "Salt",
  "Index",
  "Query",
  "Normalize",
  "Optimize",
  "Minify",
  "Lint",
  "Format",
  "Render",
]

const answerMax = 3

function produceAnswer() {
  let out = ""
  for (let i = 0; i < 2; ++i) {
    out += " " + answers[Math.floor(Math.random() * answers.length)]
  }
  return out
}

function name() {
  return `${adjs[Math.floor(Math.random() * adjs.length)]}.${nouns[Math.floor(Math.random() * nouns.length)]}`
}

let sendMessages = false
async function sendAudienceMessage() {
    await fetch('http://localhost:3000/answer', {
      method: "POST",
      body: JSON.stringify({
        idx: Math.floor(Math.random() * answerMax) + 1,
        answer: produceAnswer(),
      })
    });
}

async function sendTwitchMessage() {
    await fetch('http://localhost:3000/fake-twitch-msg', {
      method: "POST",
      body: JSON.stringify({
        idx: Math.floor(Math.random() * answerMax) + 1,
        answer: produceAnswer(),
        name: name(),
      })
    });
}

async function sendMsgs() {
  while (sendMessages) {
    const which = Math.floor(Math.random() * 2)
    if (which === 1) {
      sendTwitchMessage();
    } else {
      sendAudienceMessage();
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
            "What is your favorite frontend framework?",
            "What is the first thing you say when you see a bug?",
            "How many unit tests should you write?",
          ]
        }));

      sendMsgs();
    }
  } else if (line === "close") {
    sendMessages = false
    for (const s of sockets) {
      s.send(JSON.stringify({
        type: "survey.closed",
      }));
    }
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
