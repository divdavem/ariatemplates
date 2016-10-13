#!/bin/bash

PIPE=/tmp/logStartBrowser

mkfifo "$PIPE"

function readPipe() {
    while read line <"$PIPE" ; do
        echo "[LOG-START-BROWSER] $line"
    done
}

readPipe &

echo "Logging pipe is started" > "$PIPE"
