# Steam Idle

This script is designed to idle hours in up to 32 Steam games. It is safe to use, as Steam does not ban users for idling.

## Features

* Autorestart - idling will stop automatically if you start playing a game yourself. When you exit your game, idling will continue.

## Setup Guide

1. Download the repository and unzip it.
2. Edit `config.json` and fill in your username and password. To idle more games, add the game ID to the list in `config.json`. You can find game IDs [here](https://steamdb.info/).
3. Run `run.bat`. You will be guided through the installation process of required software, unless already installed.

If you are on Linux, use `run.sh` instead.

## Note
* Setup installs Node.js and runs `npm install` to get the necessary dependencies.
* If you bought this, you got scammed.

This project is MIT licensed.
