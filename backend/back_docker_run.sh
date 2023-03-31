#!/bin/bash
docker build -t todo_backend .

docker run --rm \
  --name todo_backend \
  --net=todo_net \
  -p 5000:5000 \
  todo_backend