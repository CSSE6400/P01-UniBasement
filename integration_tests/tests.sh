#!/bin/bash

docker-compose up -d backend db
docker-compose run --rm tests
docker-compose down --rmi all -v --remove-orphans