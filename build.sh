#!/bin/bash

echo "===== PING-FRONT-END ====="
cd ping-front-end/ && npm run build

cd ../

echo "===== PING-BACK-END ====="
cd ping-back-end/ && mvn clean package

cd ../

# echo "===== ELECTRON ====="
# cd electron/ && npm run dist
