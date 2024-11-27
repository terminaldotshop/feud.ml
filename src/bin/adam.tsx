console.log("[production] Starting Adam Server...");

import { run } from "../server.tsx";

import * as Bus from "../events.ts";

let state = Bus.getState();
state.running = true;
state.questions = ["name something that you do by yourself in your free time?"];

// Log server to make sure that the file is required and loaded...
run();
console.log("[production] ... completed setup");
