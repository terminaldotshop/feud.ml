#!/usr/bin/env bun
import * as fs from "fs"

const path = process.env.STATE_PATH
if (!path) {
  throw new Error("You need to specify a state path in env STATE_PATH");
}
const state: TrackingState = JSON.parse(fs.readFileSync(path).toString())
console.log(state)
