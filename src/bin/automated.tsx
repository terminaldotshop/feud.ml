import "../server.jsx"
import * as Bus from "../events.js"

Bus.startDashboardClient()

Bus.listen("survey.opened", function() {
  console.log("[automated] Got Survey Opened Event");
  setTimeout(function() {
    console.log("[automated] Sending survey.closed");

    let state = Bus.getState();
    // let pretend = 
    state.running = true;
    state.questions = [
      "This is the first question!",
      "This is the second question!",
      "This is the final question!",
    ]

    Bus.emit("round-answers", {
      type: "survey.closed",
      answers: [
        [
          {text: "1. First Answer", values: ["1", "2", "3"]},
          {text: "2. Second Answer", values: ["1", "2", "3"]},
          {text: "3. Third Answer", values: ["1", "2", "3"]},
          {text: "4. Fourth Answer", values: ["1", "2", "3"]},
        ],
        [
          {text: "2.1 - Round 2", values: ["1", "2", "3"]},
          {text: "2.2 - Round 2", values: ["1", "2", "3"]},
          {text: "2.3 - Round 2", values: ["1", "2", "3"]},
          {text: "2.4 - Round 2", values: ["1", "2", "3"]},
          {text: "2.5 - Round 2", values: ["1", "2", "3"]},
        ],
        [
          {text: "3.1 - Round 3", values: ["1", "2", "3"]},
          {text: "3.2 - Round 3", values: ["1", "2", "3"]},
          {text: "3.3 - Round 3", values: ["1", "2", "3"]},
          {text: "3.4 - Round 3", values: ["1", "2", "3"]},
          {text: "3.5 - Round 3", values: ["1", "2", "3"]},
        ],
      ]
    });
  }, 1 * 1000);
})
