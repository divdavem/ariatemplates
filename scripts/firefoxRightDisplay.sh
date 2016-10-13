#!/bin/bash

function extractDisplay() {
    while (("$#")); do
        if [ "$1" == "--display" ]; then
            echo "$2"
            return;
        fi
        shift
    done
}
export DISPLAY="$(extractDisplay "$@")"
echo "Running: DISPLAY=$DISPLAY firefox $@"
exec firefox "$@"
