# Bitburner repo

## Structure

### Running order (OUT OF DATE)

```md
queue.js    | Calls the contents of "queue/" in sequence.
template.js | An empty script as a syntax reminder.
mines.txt   | List of mine-able servers.

queue/                | Scripts which run on a loop.
    ┣ cartographer.js | Builds "mines.txt" and runs "root.js".
    ┣ darkweb.js      | Buys any available Darkweb Programs.
    ┗ hacknet.js      | Buys upgrades for some amount of time.

scripts/          | Scripts which are called ad-hoc.
    ┣ _grow.js    | Grows the host passed to it.
    ┣ _hack.js    | Hacks the host passed to it.
    ┣ _weaken.js  | Weakens the host passed to it.
    ┣ backdoor.js | Backdoors hosts via adjacent hosts.
    ┣ miner.js    | Runs on "home", deploying scripts to mines.
    ┗ root.js     | Roots hosts then runs "backdoor.js".

tools/                                | Scripts called manually for a purpose.
    ┣ SF-1/                           | Scripts for SF-1.
    ┃   ┣ bypass.js                   |
    ┃   ┣ prototypeTampering.js       |
    ┃   ┣ rainbow.js                  |
    ┃   ┣ timeCompression.js          |
    ┃   ┣ trueRecursion.js            |
    ┃   ┣ unclickable.js              |
    ┃   ┗ undocumentedFunctionCall.js |
    ┗ lit_scraper.js           | TODO - Scrapes all the ".lit" files on the network.

### To Build

Servers
Gang
Augments

## Other Directories

### .archive

Old versions of scripts

## Planning

### New Foreman

1. Read mines.txt
2. Build queue of mining actions
3. Build list of resources (most to least powerful)
4. Take actions from queues and allocate to resources
5. Run actions on 

### Augment management

1. Create list of all available, un-purchased augments:
    - Name
    - Requires
    - Factions
2. Remove all entries that I don't have the requirements for.
3. Check which augment costs the least reputation
4. IF Check to see if we can buy it:
    - Buy it and remove it from the list
5. ELSE IF We don't have a gang:
    - Work out what faction we're closest to
    - Work out how to join faction
    - Join faction
    - Work for the faction until rep amount is met
6. IF price multiplier > ?10?:
    - Install owned augments

### Contracts

1. Build scripts for each contract
2. Check all backdoored servers for contracts
3. Deploy appropriate script

### Gangs

> The aim is to keep Wanted level at 0
> Weakest 10% of gang, train
> Next weakest, go gang things to raise money
> Best members do Vigilant Justice

Loop 1
1. IF Karma > -54000:
    - Farm kills
2. Create Gang (Slum Snakes?)

Loop 2
1. Recruit Gang members
2. Buy augments
3. Ascend if necessary
4. Buy equipment
5. Assign jobs
