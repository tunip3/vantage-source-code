# Vantage source code
This repo is a complete (at the time of this repositories creation) collection of source codes for every version of the vantage modding tool.

## How the source was extracted
Vantage is an electron app that stores its code in an asar inside its resources folder.
The asar can be extracted by running the command ( asar extract app.asar sourcecode ) which extracts it to a folder called sourcecode .

## How to run the extracted vantage source code
You must install node js then run the commands ( npm install electron ) and ( electron index.js) .
