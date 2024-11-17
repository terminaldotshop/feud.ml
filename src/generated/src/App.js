// Generated by Melange

import * as Caml_array from "melange.js/caml_array.js";
import * as Curry from "melange.js/curry.js";
import * as Stdlib__Format from "melange/format.js";
import * as React from "react";
import * as JsxRuntime from "react/jsx-runtime";

function App$Container(Props) {
  let children = Props.children;
  return JsxRuntime.jsxs("div", {
              children: [
                JsxRuntime.jsx("img", {
                      src: "/public/feud-logo.png"
                    }),
                children
              ],
              className: "gap-4 flex flex-col h-full max-w-[500px] mx-auto"
            });
}

const Container = {
  make: App$Container
};

function make(question) {
  return function (index) {
    return function (count) {
      return function (increment) {
        return JsxRuntime.jsxs(App$Container, {
                    children: [
                      JsxRuntime.jsxs("div", {
                            children: [
                              JsxRuntime.jsx("div", {
                                    children: JsxRuntime.jsx("span", {
                                          children: Curry._2(Stdlib__Format.sprintf(/* Format */{
                                                    _0: {
                                                      TAG: /* String_literal */11,
                                                      _0: "Question ",
                                                      _1: {
                                                        TAG: /* Int */4,
                                                        _0: /* Int_d */0,
                                                        _1: /* No_padding */0,
                                                        _2: /* No_precision */0,
                                                        _3: {
                                                          TAG: /* String_literal */11,
                                                          _0: " / ",
                                                          _1: {
                                                            TAG: /* Int */4,
                                                            _0: /* Int_d */0,
                                                            _1: /* No_padding */0,
                                                            _2: /* No_precision */0,
                                                            _3: /* End_of_format */0
                                                          }
                                                        }
                                                      }
                                                    },
                                                    _1: "Question %d / %d"
                                                  }), index, count),
                                          className: "text-white"
                                        }),
                                    className: "tracking-tight"
                                  }),
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
                    ]
                  });
      };
    };
  };
}

function App$Questionaire(Props) {
  return Curry._2(make(Props.question)(Props.index), Props.count, Props.increment);
}

const Questionaire = {
  make: App$Questionaire
};

function App$NotRunning(Props) {
  return JsxRuntime.jsx(App$Container, {
              children: JsxRuntime.jsxs("div", {
                    children: [
                      JsxRuntime.jsx("div", {
                            children: "We are not currently collecting questions"
                          }),
                      JsxRuntime.jsx("div", {
                            children: "This page will update when we are ready!"
                          })
                    ],
                    className: "flex flex-col text-white mx-auto"
                  })
            });
}

const NotRunning = {
  make: App$NotRunning
};

function App$Done(Props) {
  return JsxRuntime.jsx(App$Container, {
              children: JsxRuntime.jsx("div", {
                    children: "Thanks for playing! Your answers are being tabulated and calculated",
                    className: "text-white"
                  })
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
  const currentIdx = state$1.currentIdx;
  if (currentIdx >= state$1.questions.length) {
    return JsxRuntime.jsx(App$Done, {});
  }
  const question = Caml_array.get(state$1.questions, state$1.currentIdx);
  const count = state$1.questions.length;
  return JsxRuntime.jsx(App$Questionaire, {
              question: question,
              index: currentIdx,
              count: count,
              increment: increment
            });
}

const App = {
  reducer: reducer,
  make: App$App
};

const $$default = App$App;

export {
  Container ,
  Questionaire ,
  NotRunning ,
  Done ,
  listenWebSocket ,
  rawDogFetch ,
  App ,
  $$default as default,
}
/* Stdlib__Format Not a pure module */
