#!/bin/bash

# kill and remove existing
docker kill app
docker rm app

# build
docker build -t app .
# tag
docker tag funcs uitsssl/itpeople-app:sandbox
docker tag funcs registry-test.docker.iu.edu/repositories/dcd/itpeople-app:sandbox
# start
docker run -p 3000:80 -d --name app app

# open browser
open http://localhost:3000