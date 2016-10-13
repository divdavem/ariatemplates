#!/bin/bash

PIPE=/tmp/logStartBrowser

mkfifo "$PIPE"

function readPipe() {
    while true; do
        if read line <"$PIPE" ; then
            echo "[LOG-START-BROWSER] $line"
        fi
    done
}

readPipe &

echo "Logging pipe is started" > "$PIPE"
