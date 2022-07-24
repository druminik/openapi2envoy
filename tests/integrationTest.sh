#!/bin/bash
echo "starting envoy setup"
cd ../envoy/
docker-compose up -d
curl -vk http://localhost:8080/pets -X POST 2>&1 | grep 200
echo "tearing down envoy setup"
docker-compose down
echo $RESULT