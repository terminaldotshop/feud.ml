let ( let* ) = Result.bind

type state = {
    running: bool;
    questions: string array;
    users : (string, string array) Hashtbl.t
}

let empty () = {
    running = false;
    questions = Array.make 10 "";
    users = Hashtbl.create 1
}

let valid_chars s =
  let invalid = [ '<'; '>' ] in
  List.find_opt (String.contains s) invalid |> Option.is_none
;;

let msg_of_string s =
  let splits = String.split_on_char '.' s in
  let* question, answer =
    match splits with
    | question :: tail -> Ok (question, String.concat "." tail)
    | _ -> Error "??? -- NICE TRY GUY --"
  in
  let* question =
    match int_of_string question with
    | q when q >= 1 && q <= 10 -> Ok (q - 1)
    | _ | (exception _) -> Error "bad input"
  in
  let answer = String.trim answer in
  match String.length answer, valid_chars answer with
  | a, true when a >= 1 && a < 20 -> Ok (question, answer)
  | _ -> Error "bad input"
;;

let process_msg state tags msg =
  let name = tags##username in
  let out = Hashtbl.find_opt state.users name in
  let arr =
    match out with
    | Some x -> x
    | None ->
      let answers = Array.make 10 "" in
      Hashtbl.add state.users name answers;
      answers
  in
  let* question, answer = msg_of_string msg in
  Ok (Array.set arr question answer)
;;
