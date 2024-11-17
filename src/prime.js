import * as _ from "./server.jsx"
import * as Bus from "./events.js"

setTimeout(function() {
    console.log("WTF")
    Bus.emit("survey.opened", Bus.getState(), [
        "What tool/tech/library do you use every day that is embarrassing?"
    ]);
}, 2 * 1000);

setTimeout(function() {
    Bus.emit("survey.closed", Bus.getState());
}, 15 * 1000);


