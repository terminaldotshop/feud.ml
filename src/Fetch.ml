type t =
  { url : string
  ; opts : fetch_opts option
  }

and fetch_opts =
  { meth : methods
  ; headers : headers option
  ; body : string option
  }

and headers = { content_type : string option }
and methods = POST

let make ?opts url = { url; opts }
let make_opts ?(meth = POST) () = { meth; headers = None; body = None }

let _ =
  Js.Promise.make (fun ~resolve ~reject -> Js.Console.log (resolve, reject))
;;
