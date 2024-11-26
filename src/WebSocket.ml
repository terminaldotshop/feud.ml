module S = React.Event.Mouse

module MessageEventSource = struct
  type t =
    | WindowProxy
    | MessagePort
    | ServiceWorker
end

module MessagePort = struct
  type t
end

module MessageEvent = struct
  type t
  (* { data : 'a *)
  (* ; origin : string *)
  (* ; lastEventId : string *)
  (* ; source : MessageEventSource.t *)
  (* ; ports : MessagePort.t array *)
  (* } *)

  external data : t -> 'a Js.t = "data" [@@mel.get]
end

type websocket
type cb = MessageEvent.t -> unit

external new_websocket : string -> websocket = "WebSocket" [@@mel.new]
external set_onclose : websocket -> cb -> unit = "onclose" [@@mel.set]
external set_onerror : websocket -> cb -> unit = "onerror" [@@mel.set]
external set_onmessage : websocket -> cb -> unit = "onmessage" [@@mel.set]
external set_onopen : websocket -> cb -> unit = "onopen" [@@mel.set]

type 'a t =
  { url : string
  ; onmessage : cb option
  }

let make ?onmessage url = { url; onmessage }

let listen t =
  let set ws field opt =
    match opt with
    | Some cb -> field ws cb
    | None -> ()
  in
  let ws = new_websocket t.url in
  set ws set_onmessage t.onmessage;
  ws
;;

let _ =
  let ws =
    make "hello" ~onmessage:(fun evt ->
      let data = MessageEvent.data evt in
      print_endline data##name)
  in
  (* let _ =  in *)
  ws
;;
