// Generated by Melange

import * as Caml_array from "melange.js/caml_array.js";
import * as Curry from "melange.js/curry.js";
import * as Stdlib__Array from "melange/array.js";
import * as Stdlib__Format from "melange/format.js";
import * as Stdlib__List from "melange/list.js";
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
              className: "min-h-screen max-w-[500px] mx-auto tracking-tight flex flex-col"
            });
}

const Container = {
  make: App$Container
};

function make(question) {
  return function (index) {
    return function (count) {
      return function (increment) {
        return JsxRuntime.jsx(App$Container, {
                    children: JsxRuntime.jsxs("form", {
                          children: [
                            JsxRuntime.jsxs("div", {
                                  children: [
                                    JsxRuntime.jsx("div", {
                                          children: Curry._2(Stdlib__Format.sprintf(/* Format */{
                                                    _0: {
                                                      TAG: /* String_literal */11,
                                                      _0: "question ",
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
                                                    _1: "question %d / %d"
                                                  }), index, count),
                                          className: "text-muted px-4"
                                        }),
                                    JsxRuntime.jsx("label", {
                                          children: question,
                                          className: "text-white px-4 font-medium",
                                          htmlFor: "game-answer"
                                        }),
                                    JsxRuntime.jsx("input", {
                                          className: "bg-white bg-opacity-[12%] py-2 px-4 text-[#B7B7B7] focus:bg-[#220B00] focus:ring-1 focus:ring-inset focus:ring-[#FF5C00] outline-none focus:outline-none",
                                          id: "game-answer",
                                          autoFocus: true,
                                          name: "answer",
                                          placeholder: "answer",
                                          type: "text"
                                        })
                                  ],
                                  className: "flex flex-col gap-6"
                                }),
                            JsxRuntime.jsx("button", {
                                  children: "next",
                                  className: "bg-brand py-2 px-4 text-white font-semibold text-lg",
                                  type: "submit"
                                })
                          ],
                          className: "px-6 pb-6 grow h-full flex flex-col justify-between",
                          onSubmit: (function (e) {
                              e.preventDefault();
                              e.stopPropagation();
                              Curry._1(increment, undefined);
                            })
                        })
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
                            children: "// ready to play?"
                          }),
                      JsxRuntime.jsx("div", {
                            children: "// give quick short answers..."
                          }),
                      JsxRuntime.jsx("div", {
                            children: "// this page will update automatically",
                            className: "mt-4"
                          }),
                      JsxRuntime.jsx("div", {
                            children: "// when the survey beings, hang tight"
                          })
                    ],
                    className: "flex flex-col mx-auto text-muted"
                  })
            });
}

const NotRunning = {
  make: App$NotRunning
};

function App$Done(Props) {
  const allLines_0 = JsxRuntime.jsx("div", {
        children: "$ ./run_data_analysis.sh"
      });
  const allLines_1 = {
    hd: JsxRuntime.jsx("div", {
          children: "Starting data analysis job..."
        }),
    tl: {
      hd: JsxRuntime.jsx("div", {
            children: "Initializing parameters... Loading data from source... Data successfully loaded (20 answers)"
          }),
      tl: {
        hd: JsxRuntime.jsx("div", {
              children: "Running pre-processing tasks..."
            }),
        tl: {
          hd: JsxRuntime.jsx("div", {
                children: "Pre-processing complete. Executing main analysis... Progress: [====================] 100%"
              }),
          tl: {
            hd: JsxRuntime.jsx("div", {
                  children: "$ ./run_data_analysis.sh  Starting data analysis job... Initializing parameters... Setting up AI modules and configurations... Allocating memory and preparing runtime environment... System check complete. No issues detected."
                }),
            tl: {
              hd: JsxRuntime.jsx("div", {
                    children: ""
                  }),
              tl: {
                hd: JsxRuntime.jsx("div", {
                      children: ""
                    }),
                tl: {
                  hd: JsxRuntime.jsx("div", {
                        children: "INFO  | Sponsored message from Ahrefs: \"Boost your SEO strategy with Ahrefs. Find out more at ssh terminal.shop.\"",
                        className: "text-blue"
                      }),
                  tl: {
                    hd: JsxRuntime.jsx("div", {
                          children: ""
                        }),
                    tl: {
                      hd: JsxRuntime.jsx("div", {
                            children: ""
                          }),
                      tl: {
                        hd: JsxRuntime.jsx("div", {
                              children: ""
                            }),
                        tl: {
                          hd: JsxRuntime.jsx("div", {
                                children: ""
                              }),
                          tl: {
                            hd: JsxRuntime.jsx("div", {
                                  children: "Loading data from source... Data connection established to database: feud_answers_2024-11-16.csv"
                                }),
                            tl: {
                              hd: JsxRuntime.jsx("div", {
                                    children: "Fetching records... Data successfully loaded. Total records: 12,398 Performing data integrity checks... Data integrity verified."
                                  }),
                              tl: {
                                hd: JsxRuntime.jsx("div", {
                                      children: "No discrepancies found."
                                    }),
                                tl: {
                                  hd: JsxRuntime.jsx("div", {
                                        children: "Running pre-processing tasks... Tokenizing text entries... Removing duplicates and invalid records... Converting data to a structured format... Normalizing and cleaning data fields... Pre-processing complete. Ready for main analysis."
                                      }),
                                  tl: {
                                    hd: JsxRuntime.jsx("div", {
                                          children: ""
                                        }),
                                    tl: {
                                      hd: JsxRuntime.jsx("div", {
                                            children: ""
                                          }),
                                      tl: {
                                        hd: JsxRuntime.jsx("div", {
                                              children: "INFO  | Sponsored message from Tarides: \"Building the future of scalable OCaml applications. Learn more at ssh terminal.shop.\"",
                                              className: "text-blue"
                                            }),
                                        tl: {
                                          hd: JsxRuntime.jsx("div", {
                                                children: ""
                                              }),
                                          tl: {
                                            hd: JsxRuntime.jsx("div", {
                                                  children: ""
                                                }),
                                            tl: {
                                              hd: JsxRuntime.jsx("div", {
                                                    children: ""
                                                  }),
                                              tl: {
                                                hd: JsxRuntime.jsx("div", {
                                                      children: ""
                                                    }),
                                                tl: {
                                                  hd: JsxRuntime.jsx("div", {
                                                        children: ""
                                                      }),
                                                  tl: {
                                                    hd: JsxRuntime.jsx("div", {
                                                          children: ""
                                                        }),
                                                    tl: {
                                                      hd: JsxRuntime.jsx("div", {
                                                            children: "Executing main analysis... Loading model: Advanced Feud Answer Analyzer Allocating resources to GPU... Model successfully loaded."
                                                          }),
                                                      tl: {
                                                        hd: JsxRuntime.jsx("div", {
                                                              children: "Starting analysis... Analyzing answer patterns... Identifying top-scoring answers... Calculating sentiment scores... Detecting anomalies in response distribution... Progress: [========          ] 45% (Ongoing)"
                                                            }),
                                                        tl: {
                                                          hd: JsxRuntime.jsx("div", {
                                                                children: "INFO  | Memory optimization in progress to handle large data efficiently... Progress: [===============   ] 85% (Almost Done)"
                                                              }),
                                                          tl: {
                                                            hd: JsxRuntime.jsx("div", {
                                                                  children: ""
                                                                }),
                                                            tl: {
                                                              hd: JsxRuntime.jsx("div", {
                                                                    children: ""
                                                                  }),
                                                              tl: {
                                                                hd: JsxRuntime.jsx("div", {
                                                                      children: "INFO  | Sponsored message from OCaml: \"Speed, Safety, Flexibility - All with OCaml. Discover the possibilities at ssh terminal.shop.\"",
                                                                      className: "text-blue"
                                                                    }),
                                                                tl: {
                                                                  hd: JsxRuntime.jsx("div", {
                                                                        children: ""
                                                                      }),
                                                                  tl: {
                                                                    hd: JsxRuntime.jsx("div", {
                                                                          children: ""
                                                                        }),
                                                                    tl: {
                                                                      hd: JsxRuntime.jsx("div", {
                                                                            children: ""
                                                                          }),
                                                                      tl: {
                                                                        hd: JsxRuntime.jsx("div", {
                                                                              children: ""
                                                                            }),
                                                                        tl: {
                                                                          hd: JsxRuntime.jsx("div", {
                                                                                children: "Cleaning up temporary files... Releasing allocated memory... Closing database connection... System resources successfully released."
                                                                              }),
                                                                          tl: {
                                                                            hd: JsxRuntime.jsx("div", {
                                                                                  children: "Progress: [====================] 100% (Completed) Analysis successful",
                                                                                  className: "text-[#25D0AB]"
                                                                                }),
                                                                            tl: {
                                                                              hd: JsxRuntime.jsx("div", {
                                                                                    children: "Output: - Results saved to: ~/feud/output/answers_summary.txt - Logs saved to: /home/feud/answers/logs/2024-11-16_feud.log"
                                                                                  }),
                                                                              tl: {
                                                                                hd: JsxRuntime.jsx("div", {
                                                                                      children: ""
                                                                                    }),
                                                                                tl: {
                                                                                  hd: JsxRuntime.jsx("div", {
                                                                                        children: ""
                                                                                      }),
                                                                                  tl: {
                                                                                    hd: JsxRuntime.jsx("div", {
                                                                                          children: ""
                                                                                        }),
                                                                                    tl: {
                                                                                      hd: JsxRuntime.jsx("div", {
                                                                                            children: ""
                                                                                          }),
                                                                                      tl: {
                                                                                        hd: JsxRuntime.jsx("div", {
                                                                                              children: "INFO  | Sponsored message from Sentry: \"Track errors in real-time. Increase your app's reliability. Visit ssh terminal.shop for details.\"",
                                                                                              className: "text-blue"
                                                                                            }),
                                                                                        tl: {
                                                                                          hd: JsxRuntime.jsx("div", {
                                                                                                children: ""
                                                                                              }),
                                                                                          tl: {
                                                                                            hd: JsxRuntime.jsx("div", {
                                                                                                  children: ""
                                                                                                }),
                                                                                            tl: {
                                                                                              hd: JsxRuntime.jsx("div", {
                                                                                                    children: ""
                                                                                                  }),
                                                                                              tl: {
                                                                                                hd: JsxRuntime.jsx("div", {
                                                                                                      children: ""
                                                                                                    }),
                                                                                                tl: {
                                                                                                  hd: JsxRuntime.jsx("div", {
                                                                                                        children: "Job completed at 16:45:12"
                                                                                                      }),
                                                                                                  tl: {
                                                                                                    hd: JsxRuntime.jsx("div", {
                                                                                                          children: "Total execution time: 2m 34s"
                                                                                                        }),
                                                                                                    tl: {
                                                                                                      hd: JsxRuntime.jsx("div", {
                                                                                                            children: ""
                                                                                                          }),
                                                                                                      tl: {
                                                                                                        hd: JsxRuntime.jsx("div", {
                                                                                                              children: ""
                                                                                                            }),
                                                                                                        tl: {
                                                                                                          hd: JsxRuntime.jsx("div", {
                                                                                                                children: "This page will refresh when the next survey is ready...",
                                                                                                                className: "text-brand"
                                                                                                              }),
                                                                                                          tl: /* [] */0
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  const allLines = {
    hd: allLines_0,
    tl: allLines_1
  };
  const match = React.useState(function () {
        return 0;
      });
  const setidx = match[1];
  const idx = match[0];
  const timeout_function = function (param) {
    if (idx < Stdlib__List.length(allLines)) {
      return Curry._1(setidx, (function (i) {
                    return i + 1 | 0;
                  }));
    }
    
  };
  setTimeout(timeout_function, 200);
  const displayLines = Caml_array.make(idx, null);
  Stdlib__Array.iteri((function (idx, param) {
          Caml_array.set(displayLines, idx, Stdlib__List.nth(allLines, idx));
        }), displayLines);
  return JsxRuntime.jsx(App$Container, {
              children: JsxRuntime.jsx("div", {
                    children: displayLines,
                    className: "text-white flex flex-col justify-end p-6 w-full h-lvh -z-10 absolute inset-0 whitespace-pre-wrap overflow-x-hidden"
                  })
            });
}

const Done = {
  make: App$Done
};

const listenWebSocket = (function(url, callback) {
        console.log("listening to websocket", url)
        // "ws://localhost:3000/ws"
        const ws = new WebSocket(`ws://jean-types-icq-calls.trycloudflare.com/ws`)
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
        return (function (param) {
                  return listenWebSocket((function (state) {
                                console.log(state);
                                Curry._1(dispatch, /* Replace */{
                                      _0: state
                                    });
                              }), param);
                });
      });
  if (!state$1.running) {
    return JsxRuntime.jsx(App$NotRunning, {});
  }
  const currentIdx = state$1.currentIdx;
  if (currentIdx >= state$1.questions.length) {
    return JsxRuntime.jsx(App$Done, {});
  }
  const question = Caml_array.get(state$1.questions, state$1.currentIdx);
  const index = currentIdx + 1 | 0;
  const count = state$1.questions.length;
  return JsxRuntime.jsx(App$Questionaire, {
              question: question,
              index: index,
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
