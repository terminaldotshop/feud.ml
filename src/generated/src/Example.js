// Generated by Melange

import * as JsxRuntime from "react/jsx-runtime";

function make(q) {
  return function (id) {
    return JsxRuntime.jsxs("div", {
                children: [
                  JsxRuntime.jsx("span", {
                        children: q,
                        className: ""
                      }),
                  JsxRuntime.jsx("input", {
                        name: id,
                        placeholder: "your answer..."
                      })
                ],
                className: ""
              });
  };
}

function Example$Question(Props) {
  return make(Props.q)(Props.id);
}

const Question = {
  make: Example$Question,
  $$default: Example$Question
};

function Example$App(Props) {
  return JsxRuntime.jsxs("form", {
              children: [
                JsxRuntime.jsx("div", {
                      children: JsxRuntime.jsx(Example$Question, {
                            q: "How many times a day do you sleep?",
                            id: "sleep"
                          }),
                      className: "question"
                    }),
                JsxRuntime.jsx("button", {
                      children: "Submit",
                      type: "submit"
                    })
              ],
              action: "/submit_questions",
              formMethod: "POST"
            });
}

const App = {
  make: Example$App,
  $$default: Example$App
};

const $$default = Example$App;

export {
  Question ,
  App ,
  $$default as default,
}
/* react/jsx-runtime Not a pure module */
