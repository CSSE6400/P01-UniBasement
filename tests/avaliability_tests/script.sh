#!/bin/bash

k6 run ./test.js | grep -Poz '(?s)(?<=---).*?(?=---)' >> log.txt