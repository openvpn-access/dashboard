#!/bin/bash

if [[ -d /config ]]; then
    if [[ -f /config/app.json ]]; then
        cp /config/app.json /opt/app/config/production.json
    else
        cp /opt/app/config/default.json /config/app.json
    fi
fi

cd /opt/app
npm run build

if [[ -d /app ]]; then
    cp -r /opt/app/dist/* /static/app/
fi
