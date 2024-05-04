#!/bin/bash

docker-compose up -d backend db
docker-compose run --rm tests
EXIT_CODE=$?
docker-compose down --rmi all -v --remove-orphans
exit $EXIT_CODE