// Generated by Melange

import * as Caml_array from "melange.js/caml_array.js";
import * as Curry from "melange.js/curry.js";
import * as React from "react";
import * as JsxRuntime from "react/jsx-runtime";

function make(question) {
  return function (increment) {
    return JsxRuntime.jsxs("div", {
                children: [
                  JsxRuntime.jsx("img", {
                        src: "/public/feud-logo.png"
                      }),
                  JsxRuntime.jsxs("div", {
                        children: [
                          JsxRuntime.jsx("div", {
                                children: JsxRuntime.jsx("span", {
                                      children: question,
                                      className: "text-white"
                                    }),
                                className: "tracking-tight"
                              }),
                          JsxRuntime.jsx("input", {
                                className: "bg-[#242424] p-2 rounded",
                                id: "game-answer",
                                name: "answer",
                                placeholder: "answer",
                                type: "text"
                              })
                        ],
                        className: "p-6 gap-4 flex flex-col"
                      }),
                  JsxRuntime.jsx("button", {
                        children: "Next",
                        className: "bg-[#FF5C00] p-2 rounded text-white",
                        onClick: increment
                      })
                ],
                className: "gap-4 flex flex-col h-full max-w-[500px] mx-auto"
              });
  };
}

function App$Questionaire(Props) {
  return make(Props.question)(Props.increment);
}

const Questionaire = {
  make: App$Questionaire
};

function App$NotRunning(Props) {
  return JsxRuntime.jsx("div", {
              children: "No active questions",
              className: "text-white"
            });
}

const NotRunning = {
  make: App$NotRunning
};

function App$Done(Props) {
  return JsxRuntime.jsx("div", {
              children: "You are so good at answering",
              className: "text-white"
            });
}

const Done = {
  make: App$Done
};

const listenWebSocket = (function(url, callback) {
        console.log("listening to websocket", url)
        const ws = new WebSocket(url)
        ws.onmessage = function(evt) {
            console.log("got message", evt.data)
            try {
                const data = JSON.parse(evt.data)
                callback(data)
            } catch (e) {
            }
        }
        return function() {
            ws.close()
        }
    }
);

const rawDogFetch = (function(idx) {
      const el = document.querySelector("#game-answer")
      const answer = el.value
        console.log("answering question", idx + 1, answer)
fetch('/answer', {
   method: 'POST',
  headers: {
      'Content-Type': 'application/json',
    },
  body: JSON.stringify({ idx: idx + 1, answer }),
  })
    }
);

function reducer(state, action) {
  if (action) {
    return action._0;
  } else {
    rawDogFetch(state.currentIdx);
    return {
            running: state.running,
            currentIdx: state.currentIdx + 1 | 0,
            questions: state.questions,
            users: state.users
          };
  }
}

function App$App(Props) {
  let state = Props.state;
  const match = React.useReducer(reducer, state);
  const dispatch = match[1];
  const state$1 = match[0];
  const increment = function (param) {
    Curry._1(dispatch, /* Increment */0);
  };
  React.useEffect(function () {
        return listenWebSocket("ws://localhost:3000/ws", (function (state) {
                      console.log(state);
                      Curry._1(dispatch, /* Replace */{
                            _0: state
                          });
                    }));
      });
  if (!state$1.running) {
    return JsxRuntime.jsx(App$NotRunning, {});
  }
  if (state$1.currentIdx >= state$1.questions.length) {
    return JsxRuntime.jsx(App$Done, {});
  }
  const question = Caml_array.get(state$1.questions, state$1.currentIdx);
  return JsxRuntime.jsx(App$Questionaire, {
              question: question,
              increment: increment
            });
}

const App = {
  reducer: reducer,
  make: App$App
};

const $$default = App$App;

export {
  Questionaire ,
  NotRunning ,
  Done ,
  listenWebSocket ,
  rawDogFetch ,
  App ,
  $$default as default,
}
/* react Not a pure module */
