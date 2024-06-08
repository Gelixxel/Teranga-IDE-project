#!/bin/bash

cd ping-front-end/ && npm run build

cd ../

cd ping-back-end/ && mvn clean package

cd ../

cd electron/ && npm run dist
