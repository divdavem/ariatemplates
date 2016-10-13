#!/bin/bash

PIPE=/tmp/logStartBrowser

mkfifo "$PIPE"

function readPipe() {
    trap "rm -f $PIPE; echo '[LOG-START-BROWSER] Ending logging pipe.'" EXIT
    while read line <"$PIPE" ; do
        echo "[LOG-START-BROWSER] $line"
    done
}

readPipe &

echo "Starting logging pipe." > "$PIPE"
