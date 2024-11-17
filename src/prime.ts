import "./server.jsx"
import * as Bus from "./events.js"

setTimeout(function() {
    Bus.emit("survey.opened", Bus.getState(), [
        "What's a sign that a tech company is trying to be \"cool\"?"
    ]);
}, 2 * 1000);

setTimeout(function() {
    Bus.emit("survey.closed", Bus.getState());
}, 45 * 1000);
