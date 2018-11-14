#!/bin/bash

# kill and remove existing
docker kill itpeople-app
docker rm itpeople-app

# build
docker build -t itpeople-app .
# tag
docker tag itpeople-app uitsssl/itpeople-app:sandbox
docker tag itpeople-app registry-test.docker.iu.edu/repositories/dcd/itpeople-app:sandbox
# start
docker run -p 3000:80 -d --name itpeople-app itpeople-app

# open browser
open http://localhost:3000