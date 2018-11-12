#!/bin/bash

# Export the tag name
export DOCKER_TAG=${TEAMCITY_BRANCH/refs\/heads\//}

# Configure the environment variables. 
# Adding a '.local' gives these variables precedence.
# See: https://medium.com/@tacomanator/environments-with-create-react-app-7b645312c09d
echo Copy .env.$ENVIRONMENT -> .env.$ENVIRONMENT.local
cp .env.$ENVIRONMENT .env.$ENVIRONMENT.local

# Build the docker image and tag it for docker hub
docker build -t app .

# Tag image for docker hub
echo Tagging app image as $DOCKER_HUB_REPO:$DOCKER_TAG
docker tag app $DOCKER_HUB_REPO:$DOCKER_TAG

# Login to Docker Hub
printf $DOCKER_HUB_PASSWORD | docker login --username $DOCKER_HUB_USERNAME --password-stdin

# Push the image to Docker Hub
echo Pushing $DOCKER_HUB_REPO:$DOCKER_TAG to Docker Hub
docker push $DOCKER_HUB_REPO:$DOCKER_TAG