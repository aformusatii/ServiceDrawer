#!/bin/bash

git pull
cd ./client

npm install
npm run build

cd ..

docker compose restart ServiceDrawer