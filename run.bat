@echo off
set NULL_VAL=null
set NODE_VER=%NULL_VAL%
set NODE_EXEC=node-v16.15.0-x86.msi

node -v >.tmp_nodever
set /p NODE_VER=<.tmp_nodever
del .tmp_nodever

IF "%NODE_VER%"=="%NULL_VAL%" (
	cls
	echo.
	echo Node.js is not installed! Please press a key to download and install it from the website that will open.
	PAUSE
	start "" http://nodejs.org/dist/v16.15.0/%NODE_EXEC%
	echo.
	echo.
	echo After you have installed Node.js, press a key to shut down this process. Please restart it again afterwards.
	pause
	exit
)

echo Node.js ^(%NODE_VER%^) is installed. Proceeding...
IF NOT EXIST "node_modules\" (
	call npm install
)

rem check if config.json is ok
>nul findstr /c:"someuser" config.json && (
   goto editfields
)
>nul findstr /c:"somepass" config.json && (
   goto editfields
)

title Steamidler by h3rl
echo.
echo Steamidler is starting...
call node index.js
pause
exit

:editfields
echo You need to edit fields in config.json
pause
exit