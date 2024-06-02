# UniBasement-Availability-Tests

Separate Repo to keep my pi nice and smol :)

## Overview

A cron job was setup on a raspberry pi to run `script/script.sh` every 5 minutes.

The k6 test:

* sends a `GET` request to the UniBasement frontend homepage to verify the user facing site is accessible
* sends a `GET` request to the UniBasement backend courses route and checks the response body to verify the backend and database are both running

## Results

The test was running for 2 days, with only a 15 minute downtime at midnight on the 28th May. This means the uptime was 99.5%, which exceeds the required 99% uptime in the proposal. [Results Raw](https://github.com/JTrenerry/UniBasement-Avaliability-Tests/blob/main/log.txt)
