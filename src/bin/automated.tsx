import "../server.tsx"
import * as Bus from "../events.ts"

Bus.startDashboardClient()

Bus.listen("survey.opened", function() {
  console.log("[automated] Got Survey Opened Event");
  setTimeout(function() {
    console.log("[automated] Sending survey.closed");

    let state = Bus.getState();
    // let pretend =
    state.running = true;
    state.questions = [
      "What's a sign that your startup is about to fail?",
      "Name something you might find on a developer's desk besides a computer.",
    ]

    Bus.emit("round-answers", {
      type: "survey.closed",
      answers: [
[
    {text: "Free coffee gone", values: ["Free coffee gone"]},
    {text: "CEO in tears", values: ["CEO in tears"]},
    {text: "All-hands panic", values: ["All-hands panic"]},
    {text: "Ping-pong sold", values: ["Ping-pong sold"]},
    {text: "HR ghosting", values: ["HR ghosting"]},
    {text: "Rent unpaid", values: ["Rent unpaid"]}
],
[
    {text: "Coffee mug", values: ["Coffee mug"]},
    {text: "Sticky notes", values: ["Sticky notes"]},
    {text: "Headphones", values: ["Headphones"]},
    {text: "Rubber duck", values: ["Rubber duck"]},
    {text: "Energy drink", values: ["Energy drink"]},
    {text: "Snack stash", values: ["Snack stash"]}
]
      ]
    });
  }, 1 * 1000);
})
