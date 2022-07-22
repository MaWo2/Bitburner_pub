# My repository for Bitburner scripts
2022-06-14

## Disclaimer
This repository is just here to help me play the Bitburner game (https://github.com/danielyxie/bitburner). I especially use it to get scripts I developed in one game into a "fresh" instance of the game. It is a public repository, because at the time of writing it is not possible to use 'wget' inside bitburner with private github repositories.

**I am just a hobbyist programmer and do not claim any professionalism.**

Accordingly, I will not react to any Pull-/Merge-Requests.

My scripts are usually functional to an extend I can live with. However, they are probably not in line with best-practices in programming.

If you can live with this, feel free to use them (for your game or inspiration or whatever). If not, please look somewhere else.

## Getting started
1) Run `wget "https://raw.githubusercontent.com/MaWo2/Bitburner_pub/master/???.js" "???.js"` to download the script to pull the rest
2) Run that script to download the rest of this repository.

## Content
### data mining
Scripts and functions to profile the servers. I use this to generate a list of all servers (func_world-scanner.js) and to get the properties of all servers (world-profiler.js). Both is written to a txt-file. The profiles are in CSV-format.
