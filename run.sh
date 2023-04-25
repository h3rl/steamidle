#!/bin/bash

# check node installation
if ! which node > /dev/null || ! which npm > /dev/null; then
	echo "Node.js is not installed"
	echo "please install node first, exiting..."
	exit 1
fi

# check node_modules exists
if [ -d "./node_modules" ]
then
    echo "found 'node_modules' directory, assuming packages are installed!"
else
    echo "Running 'npm install'..."
    npm install
fi

# check if config.json is ok
CONFIG_OK=1;

if grep "someuser" config.json > /dev/null; then
    echo "username not set"
    CONFIG_OK=0;
fi

if grep "somepass" config.json > /dev/null; then
    echo "password not set"
    CONFIG_OK=0;
fi

if [ $CONFIG_OK -eq 0 ]; then
    echo "You need to edit fields in config.json"
    exit 1
fi


# start Steamidler
echo ""
echo "Steamidler is starting..."
node index.js