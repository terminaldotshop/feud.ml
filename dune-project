(lang dune 3.17)

(name feud)

;; Use Melange for Javascript Compilation
(using melange 0.1)

;; Set up mlx files
(dialect
 (name mlx)
 (implementation
  (extension mlx)
  (merlin_reader mlx)
  (preprocess
   (run mlx-pp %{input-file}))))

(package
 (name feud)
 (allow_empty)
 (depends 
   ocaml dune melange reason-react fmt base ppx_deriving mlx ocamlmerlin-mlx)
 (tags (meme fun)))
