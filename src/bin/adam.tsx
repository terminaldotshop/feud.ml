console.log("[production] Starting Adam Server...");

import { server } from "../server.tsx";

import * as Bus from "../events.ts";

let state = Bus.getState();
state.running = true;
state.questions = ["name something that you do by yourself in your free time?"];

// Log server to make sure that the file is required and loaded...
console.log("[production] ... completed setup", server);
