#!/bin/bash

git pull
cd ./client
npm run build

cd ..

docker compose restart ServiceDrawer