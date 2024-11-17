import * as Bus from "../events.js"
import { server } from "../server.jsx"

console.log("Starting Production")

Bus.startDashboardClient()
Bus.startTwitchClient()

console.log(server);
