# My repository for Bitburner scripts
2022-07-25

## Disclaimer
This repository is just here to help me play the Bitburner game (https://github.com/danielyxie/bitburner). I especially use it to get scripts I developed in one game into a "fresh" instance of the game. It is a public repository, because at the time of writing it is not possible to use 'wget' inside bitburner with private github repositories.

**I am just a hobbyist programmer and do not claim any professionalism.**

Accordingly, I will not react to any Pull-/Merge-Requests.

My scripts are usually functional to an extend I can live with. However, they are probably not in line with best-practices in programming.

If you can live with this, feel free to use them (for your game or inspiration or whatever). If not, please look somewhere else.

## Getting started
1) Run `wget "https://raw.githubusercontent.com/MaWo2/Bitburner_pub/master/wgetall.js" "wgetall.js"` to download the script to pull the rest
2) Run that script to download the rest of this repository.

## Content
### monitor.js
This is from the official repository.

### data mining
Scripts and functions to profile the servers. I use this to generate a list of all servers (func_world-scanner.js) and to get the properties of all servers (world-profiler.js). Both is written to a txt-file. The profiles are in CSV-format.

### batchhack
My implementation of a HWGW hacking algorithm.
On my testing/benchmarking system, this algorithm outperforms this one (https://www.reddit.com/r/Bitburner/comments/rm48o1/the_best_hacking_approach_ive_seen_so_far/) money-earning-wise by far (7-10x), while reaching at least 85% of that experience gain.

### loophack
My implementation of a loop hacking algorithm.
The hacking loop has a safety-net included, to prevent hacking the servers too far down.

### simplehack
Should be obvious...
The self-hacking-script is somewhat elaborated. Initially, I had an error in the script that generated much money at the beginning of a run. I thought that this might be useful and made sure it was kept around, after the error was corrected. However, this made some more checkpoints necessary, if the script was started later in the game.
