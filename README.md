# Bitburner repo

## Structure

### Running order

```md
queue.js                | Calls the contents of "queue/" in sequence.
template.js             | An empty script as a syntax reminder.
mines.txt               | List of mine-able servers.

queue/                  | Scripts which run on a loop.
    ┣ cartographer.js   | Builds "mines.txt" and runs "root.js".
    ┣ darkweb.js        | Buys any available Darkweb Programs.
    ┗ hacknet.js        | Buys upgrades for some amount of time.

scripts/                | Scripts which are called ad-hoc.
    ┣ _grow.js          | Grows the host passed to it.
    ┣ _hack.js          | Hacks the host passed to it.
    ┣ _weaken.js        | Weakens the host passed to it.
    ┣ backdoor.js       | Backdoors hosts via adjacent hosts.
    ┣ miner.js          | Runs on "home", deploying scripts to mines.
    ┗ root.js           | Roots hosts then runs "backdoor.js".

tools/                  | Scripts called manually for a purpose.
    ┣ lit_scraper.js    | TODO - Scrapes all the ".lit" files on the network.
    ┗                   |
```

### To Build

Servers
Gang
Augments

## Other Directories

### .archive

Old versions of scripts

### .servers

A record of the things I've found in certain servers.

### .vscode

Configs for my VSCode workspace extensions:

- Bitburner extension
- Spellcheck
