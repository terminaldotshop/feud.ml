// Generated by Melange

import * as Caml_array from "melange.js/caml_array.js";
import * as Caml_format from "melange.js/caml_format.js";
import * as Stdlib__Hashtbl from "melange/hashtbl.js";
import * as Stdlib__List from "melange/list.js";
import * as Stdlib__Option from "melange/option.js";
import * as Stdlib__Result from "melange/result.js";
import * as Stdlib__String from "melange/string.js";

function empty(param) {
  return {
          running: false,
          currentIdx: 0,
          questions: Caml_array.make(10, ""),
          users: Stdlib__Hashtbl.create(undefined, 1)
        };
}

function valid_chars(s) {
  return Stdlib__Option.is_none(Stdlib__List.find_opt((function (param) {
                    return Stdlib__String.contains(s, param);
                  }), {
                  hd: /* '<' */60,
                  tl: {
                    hd: /* '>' */62,
                    tl: /* [] */0
                  }
                }));
}

function msg_of_string(s) {
  const splits = Stdlib__String.split_on_char(/* '.' */46, s);
  return Stdlib__Result.bind(splits ? ({
                  TAG: /* Ok */0,
                  _0: [
                    splits.hd,
                    Stdlib__String.concat(".", splits.tl)
                  ]
                }) : ({
                  TAG: /* Error */1,
                  _0: "??? -- NICE TRY GUY --"
                }), (function (param) {
                const answer = param[1];
                let tmp;
                let exit = 0;
                let q;
                try {
                  q = Caml_format.caml_int_of_string(param[0]);
                  exit = 1;
                }
                catch (exn){
                  tmp = {
                    TAG: /* Error */1,
                    _0: "bad input"
                  };
                }
                if (exit === 1) {
                  tmp = q >= 1 && q <= 10 ? ({
                        TAG: /* Ok */0,
                        _0: q - 1 | 0
                      }) : ({
                        TAG: /* Error */1,
                        _0: "bad input"
                      });
                }
                return Stdlib__Result.bind(tmp, (function (question) {
                              const answer$1 = Stdlib__String.trim(answer);
                              const match = answer$1.length;
                              const match$1 = valid_chars(answer$1);
                              if (match$1 && match >= 1 && match < 20) {
                                return {
                                        TAG: /* Ok */0,
                                        _0: [
                                          question,
                                          answer$1
                                        ]
                                      };
                              } else {
                                return {
                                        TAG: /* Error */1,
                                        _0: "bad input"
                                      };
                              }
                            }));
              }));
}

function process_msg(state, tags, msg) {
  const name = tags.username;
  const out = Stdlib__Hashtbl.find_opt(state.users, name);
  let arr;
  if (out !== undefined) {
    arr = out;
  } else {
    const answers = Caml_array.make(10, "");
    Stdlib__Hashtbl.add(state.users, name, answers);
    arr = answers;
  }
  return Stdlib__Result.bind(msg_of_string(msg), (function (param) {
                return {
                        TAG: /* Ok */0,
                        _0: Caml_array.set(arr, param[0], param[1])
                      };
              }));
}

const let$star = Stdlib__Result.bind;

export {
  let$star ,
  empty ,
  valid_chars ,
  msg_of_string ,
  process_msg ,
}
/* Stdlib__Hashtbl Not a pure module */
