#!/bin/bash

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker-compose up -d backend db
docker-compose run --rm tests
EXIT_CODE=$?
exit $EXIT_CODE