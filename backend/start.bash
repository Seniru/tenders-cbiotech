#!/bin/bash

bash /wait-for-it.sh "mongo:27017" --timeout=60

function run() {
    npm start || run
}

run