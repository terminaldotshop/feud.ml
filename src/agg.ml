let ( let* ) = Result.bind

type state =
  { running : bool
  ; currentIdx : int
  ; questions : string array
  ; users : (string, string array) Hashtbl.t
  }

let empty () =
  { running = false
  ; questions = Array.make 10 ""
  ; users = Hashtbl.create 1
  ; currentIdx = 0
  }
;;

let valid_chars s =
  [ '<'; '>'; '&'; '?'; '/' ]
  |> List.find_opt (String.contains s)
  |> Option.is_none
;;

let msg_of_string s =
  let splits = String.split_on_char '.' s in
  let* question, answer =
    match splits with
    | question :: tail -> Ok (question, String.concat "." tail)
    | _ -> Error "Doesn't contain a period"
  in
  let* question =
    match int_of_string question with
    | q when q >= 1 && q <= 10 -> Ok (q - 1)
    | _ -> Error "number out of range"
    | exception _ -> Error "not an integer before period"
  in
  let answer = String.trim answer in
  match String.length answer, valid_chars answer with
  | a, true when a >= 1 && a < 20 -> Ok (question, answer)
  | _, true -> Error "Input is invalid length"
  | _, false -> Error "Input contains invalid characters"
;;

let process_msg state tags msg =
  let name = tags##username in
  let arr =
    match Hashtbl.find_opt state.users name with
    | Some x -> x
    | None ->
      let answers = Array.make 10 "" in
      Hashtbl.add state.users name answers;
      answers
  in
  let* question, answer = msg_of_string msg in
  Ok (Array.set arr question answer)
;;
