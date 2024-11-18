#!/usr/bin/env bun
import * as fs from "fs"
import * as Bus from "../events.ts"

const path = process.env.STATE_PATH
if (!path) {
  throw new Error("You need to specify a state path in env STATE_PATH");
}
const state: TrackingState = JSON.parse(fs.readFileSync(path).toString())

const arg = process.argv[2]
if (arg === "dax") {
  if (!state.toDax) {
    console.log("state doesn't have a toDax")
  } else if (state.toDax.failReason) {
    console.log("state has a failed reason", state.toDax.failReason)
  }

  Bus.startDashboardClient()
  setTimeout(function() {
    console.log(state.toDax)
    Bus.emit("round-answers", state.toDax?.data as ToDax)
    process.exit(0)
  }, 2000)
} else {
    console.log(JSON.stringify(state, null, 4))
}
