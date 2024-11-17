let ( let* ) = Result.bind

module Answer = struct
  type t =
    { idx : int
    ; answer : string
    }

  let valid_chars s =
    [ '<'; '>'; '&'; '?'; '/'; '\\'; '"' ]
    |> List.find_opt (String.contains s)
    |> Option.is_none
  ;;

  let of_string s =
    let splits = String.split_on_char '.' s in
    let* question, answer =
      match splits with
      | question :: tail -> Ok (question, String.concat "." tail)
      | _ -> Error "Doesn't contain a period"
    in
    let* idx =
      match int_of_string question with
      | q when q >= 1 && q <= 10 -> Ok (q - 1)
      | _ -> Error "number out of range"
      | exception _ -> Error "not an integer before period"
    in
    let answer = String.trim answer in
    match String.length answer, valid_chars answer with
    | len, true when len >= 1 && len < 20 -> Ok { idx; answer }
    | _, true -> Error "Input is invalid length"
    | _, false -> Error "Input contains invalid characters"
  ;;
end

module State = struct
  type t =
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

  let process_msg state tags msg =
    let name = tags##username in
    let arr =
      match Hashtbl.find_opt state.users name with
      | Some x -> x
      | None ->
        let answers = Array.make (Array.length state.questions) "" in
        Hashtbl.add state.users name answers;
        answers
    in
    let* { idx; answer } = Answer.of_string msg in
    if idx < Array.length state.questions
    then (
      Array.set arr idx answer;
      Js.Console.log (name, arr));
    Ok ()
  ;;
end

module Transform = struct
  type t =
    { questions : string array
    ; answers : string Belt.Array.t array
    }

  let transform (s : State.t) =
    let data =
      { questions = s.questions
      ; answers = Array.make (Array.length s.questions) (Belt.Array.make 0 "")
      }
    in
    Hashtbl.iter
      (fun _ value ->
        Array.iteri
          (fun i answer ->
            match answer with
            | "" -> ()
            | a -> Belt.Array.push data.answers.(i) a)
          value)
      s.users;
    data
  ;;
end
