(* Define the type for storage *)
type storage

(* External binding to localStorage *)
external localStorage : storage = "localStorage" [@@mel.global "localStorage"]

(* External functions for localStorage methods *)
external getItem : storage -> string -> string option = "getItem" [@@mel.call]
external setItem : storage -> string -> string -> unit = "setItem" [@@mel.call]
external removeItem : storage -> string -> unit = "removeItem" [@@mel.call]

(* Usage *)
let save_data key value = setItem localStorage key value
let load_data key = getItem localStorage key
let delete_data key = removeItem localStorage key

let () =
  save_data "username" "Alice";
  match load_data "username" with
  | Some name -> Js.log ("Hello, " ^ name)
  | None ->
    Js.log "No username found";
    delete_data "username"
;;