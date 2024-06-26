#!/bin/bash

docker-compose down --rmi all -v --remove-orphans
docker-compose up -d backend db frontend
docker-compose run --rm tests
EXIT_CODE=$?
exit $EXIT_CODE