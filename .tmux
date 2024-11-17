#!/usr/bin/env bash

open() {
    tmux neww -dn dune_build
    tmux neww -dn bun_build
    tmux neww -dn bun_server

    tmux send-keys -t dune_build "dune build -w --profile=debug" C-m
    tmux send-keys -t bun_build "bun run build --watch" C-m
    tmux send-keys -t bun_server "bun run --env-file .env --watch ./src/prime.js |& tee out.yourmom" C-m
}

close() {
    tmux kill-window -t dune_build
    tmux kill-window -t bun_build
    tmux kill-window -t bun_server
}

if [[ -z "$FEUD" ]] || [[ "$FEUD" == "1" ]]; then
    close
    export FEUD=0
else
    open
    export FEUD=1
fi
