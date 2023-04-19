#!/bin/bash

NULL_VAL=null
NODE_VER=$NULL_VAL
NODE_EXEC=node-v16.15.0-x86.msi

node -v > .tmp_nodever
read NODE_VER < .tmp_nodever
rm .tmp_nodever

if [ "$NODE_VER" = "$NULL_VAL" ]; then
	clear
	echo ""
	echo "Node.js is not installed! Please press a key to download and install it from the website that will open."
	read -n1 -s
	xdg-open "http://nodejs.org/dist/v16.15.0/$NODE_EXEC"
	echo ""
	echo ""
	echo "After you have installed Node.js, press a key to shut down this process. Please restart it again afterwards."
	read -n1 -s
	exit
fi

echo "Node.js ($NODE_VER) is installed. Proceeding..."
if [ ! -d "node_modules" ]; then
	npm install
fi

# check if config.json is ok
grep -q "someuser" config.json
if [ $? -eq 0 ]; then
	goto editfields
fi

grep -q "somepass" config.json
if [ $? -eq 0 ]; then
	goto editfields
fi

echo ""
echo "Steamidler is starting..."
node index.js
read -n1 -s
exit

editfields:
echo "You need to edit fields in config.json"
read -n1 -s
exit
