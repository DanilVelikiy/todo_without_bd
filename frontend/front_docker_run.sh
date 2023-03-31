#!/bin/bash
docker build -t ispeak_nginx .

docker run --rm \
--name todo_frontend \
--net=todo_net -p 80:80 \
-v /Users/ispeak/Yandex.Disk.localized/—DEV—/fullstack_todo_list/frontend/:/nginx/static/ \
-v /Users/ispeak/Yandex.Disk.localized/—DEV—/fullstack_todo_list/frontend/nginx_localhost.conf:/etc/nginx/nginx.conf \
ispeak_nginx