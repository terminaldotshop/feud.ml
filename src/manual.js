import { processResponse } from "./round.end.js";
import * as fs from "fs"
import * as Bus from "./events.js"

Bus.startDashboardClient()

setTimeout(async function() {
    const response = fs.readFileSync("./response-0").toString()
    const msg = await processResponse(response)
    Bus.emit("round-answers", msg)
}, 1000);
