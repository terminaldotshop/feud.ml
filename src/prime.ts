//import * as _ from "./server.jsx"
import { processResponse } from "./round.end.ts"
import { promptMeDaddy } from "./llm";
import * as Bus from "./events.js"

Bus.startDashboardClient()
setTimeout(function() {
  run()
}, 2 * 1000);

async function run() {
  //const out = await promptMeDaddy("")
  //console.log("out", out)
  const msg = processResponse([out])
  Bus.emit("round-answers", msg)
}

//
//import * as _ from "./server.jsx"
//import * as Bus from "./events.js"
//
//setTimeout(function() {
//    console.log("WTF")
//    Bus.emit("survey.opened", Bus.getState(), [
//        "What's something a programmer forgets todo because they are in \"the zone\"?"
//    ]);
//}, 2 * 1000);
//
//setTimeout(function() {
//    Bus.emit("survey.closed", Bus.getState());
//}, 45 * 1000);
//
//
//


var out = {
  question: "what is something a programmer forgets to do when they are in the zone?",
  results: [
    {
      category: "Personal Hygiene",
      raw: [ "Shower", "Wash their hands", "shower", "wash" ],
    }, {
      category: "Basic Needs",
      raw: [
        "eating", "eat", "breathe", "Pee", "pee", "pee", "drinking water", "Peeing",
        "Sleep", "sleep", "sleep", "Eat"
      ],
    }, {
      category: "Work-Related Tasks",
      raw: [
        "Update Jira", "attend standup", "write tests",
        "update the ticket", "join meeting", "Join the meeting",
        "commit", "git commit", "write tests", "scrum", "commit"
      ],
    }, {
      category: "Life Responsibilities",
      raw: [ "Go home", "Call their mother", "Pleasure his wife",
        "feed the cat", "Walk the dog", "forget to feed kids"
      ],
    }, {
      category: "Erratic Responses",
      raw: [
        "jerk off", "use protection", "git rebase", "tdd", "using vscode",
        "Touch Grass", "live", "live", "Wear pants", "1.1.1.1.1.1",
        "goon", "goon", "GF𖼔", "proompt", ". Sleep", "Uninstall jdk", "Not your mom",
        "explain commits", "´´0``programming", "normal answer"
      ],
    }, {
      category: "Miscellaneous",
      raw: [
        "wake up", "45 minutes", "France", "save", "1", "save program", "NaN", "get wife",
        "null", "commit -m", "sex", "rm -rf Home", "goon!!!", "Do not respond",
        "Live life", "semicolon", "Eat^M", "🥴🥴🥴🥴🥴🥴", "Scrum", "'_x90_x90_x90_x90'",
        "genocide", "date", "eat", "Slam it in onichan", "1.1.1. _1_", "[object Object]"
      ],
    }
  ],
}

