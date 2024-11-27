console.log("Importing and starting server...");

import * as ReactDOMServer from "react-dom/server";
import { createServer as createViteServer } from 'vite'
import express from 'express'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import * as Bus from "./events.ts";
import * as Track from "./app-state.ts";
import App from "./generated/src/App.js";
import { State } from "./generated/src/agg.js";

const state = Bus.getState();

let id = 0;
function getName(): { username: string } {
  return {
    username: `audience${++id}`,
  };
}

Bus.listen("survey.message", (state, type, tags, msg) => {
  if (!state.running) {
    return;
  }
  Track.messageReceived(state, type, tags.username, msg);
  State.process_msg(state, tags.username, msg.replaceAll("\\", "_"));
});

Bus.listen("survey.opened", (state, questions) => {
  Track.reset(state);
  Track.surveyOpened(state);
  Track.questionsReceived(state, questions);

  console.log("=> SURVEY OPENED", questions);
  if (state.running) {
    console.log("-> Already running?");
    return;
  }

  state.running = true;
  state.questions = questions;
  sync_states();

  console.log("waiting for 2 minutes");
  setTimeout(
    function () {
      Bus.emit("survey.closed", Bus.getState());
    },
    2 * 60 * 1000,
  );
});

const LOCAL_TESTING = true;

let sockets = new Set<any>();
function sync_states() {
  for (const socket of sockets) {
    socket.send(JSON.stringify(state));
  }
}


// Import the Bun server module
// async function run() {
//   // Create Vite server in middleware mode and configure the app type as
//   // 'custom', disabling Vite's own HTML serving logic so parent server
//   // can take control
//   const vite = await createViteServer({
//     server: { middlewareMode: true },
//     appType: 'custom'
//   })
//   console.log(vite.middlewares);
//
//   const server = Bun.serve({
//     port: process.env.PORT,
//     websocket: {
//       open(ws) {
//         sockets.add(ws);
//       },
//       message(ws, _) {
//         ws.send(JSON.stringify(state));
//       },
//       close(ws, _) {
//         sockets.delete(ws);
//       },
//     },
//     fetch: async (req) => {
//       // vite.middlewares.use
//       const url = new URL(req.url);
//       console.log(req);
//
//       // Simple routing logic
//       if (url.pathname === "/ws") {
//         if (server.upgrade(req)) {
//           return; // do not return a Response
//         }
//         return new Response("Upgrade failed", { status: 500 });
//       } else if (url.pathname === "/fake-twitch-msg") {
//         try {
//           const { idx, answer, name } = await req.json();
//           Bus.emit(
//             "survey.message",
//             state,
//             "twitch",
//             { username: name },
//             `${idx}.${answer}`,
//           );
//         } catch {}
//       } else if (url.pathname === "/answer") {
//         try {
//           const { idx, answer } = await req.json();
//
//           for (let i = 0; i < 5; ++i) {
//             Bus.emit(
//               "survey.message",
//               state,
//               "audience",
//               getName(),
//               `${idx}.${answer}`,
//             );
//           }
//         } catch {}
//       } else if (url.pathname === "/") {
//         // @ts-ignore
//         const app = ReactDOMServer.renderToString(<App state={Bus.getState()} />);
//         const index = await Bun.file("./dist/index.html").text();
//         const html = index.replace("<!--app-html-->", app).replace(
//           "__STATE__",
//           JSON.stringify(Bus.getState(), function (k, v) {
//             if (k === "users") {
//               return undefined;
//             }
//             return v;
//           }),
//         );
//
//         return new Response(html, {
//           headers: { "Content-Type": "text/html" },
//           status: 200,
//         });
//       } else if (url.pathname.startsWith("/public")) {
//         return new Response(Bun.file(`./${url.pathname}`), {
//           status: 200,
//         });
//       } else if (url.pathname.startsWith("/assets")) {
//         return new Response(Bun.file(`./dist${url.pathname}`), {
//           status: 200,
//         });
//       }
//
//       if (LOCAL_TESTING) {
//         if (url.pathname === "/debug/running") {
//           state.running = true;
//           sync_states();
//         }
//       }
//
//       return new Response("???", { status: 404 });
//     },
//   });
//
//   // Log server details
//   console.log(`Server is running at http://localhost:${server.port}`);
// }
//
//

export async function run() {
  const app = express()

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      // 1. Read index.html
      //
      // const __dirname = path.dirname(fileURLToPath(import.meta.url))
      // let template = fs.readFileSync(
      //   path.resolve(__dirname, 'index.html'),
      //   'utf-8',
      // )
      let template = await fs.readFile('./index.html', 'utf-8');
      // template = await vite.transformIndexHtml(url, template)

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client,
      //    and also applies HTML transforms from Vite plugins, e.g. global
      //    preambles from @vitejs/plugin-react
      template = await vite.transformIndexHtml(url, template)

      // 3. Load the server entry. ssrLoadModule automatically transforms
      //    ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      // const { render } = await vite.ssrLoadModule('/src/entry-server.js')
      const render = (await import('../dist/server/entry-server.js')).render

      // 4. render the app HTML. This assumes entry-server.js's exported
      //     `render` function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url)

      // 5. Inject the app-rendered HTML into the template.
      // const html = template.replace(`<!--ssr-outlet-->`, () => appHtml)
      const html = template
        .replace(`<!--app-head-->`, appHtml.head ?? '')
        .replace(`<!--app-html-->`, appHtml.html ?? '')

      // 6. Send the rendered HTML back.
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  console.log("Starting listener on 3000");
  app.listen(3000)
}
