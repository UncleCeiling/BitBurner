# NS1

## Intro

Netscript is a programming language implemented for this game. The language has your basic programming constructs and several built-in commands that are used to hack.

[Official Wiki and Documentation](https://bitburner-beta.readthedocs.io/en/latest/netscript/netscriptfunctions.html)

Check out Bitburner's wiki for the official Netscript documentation. The wiki documentation will contain more details and code examples than this documentation page. Also, it can be opened up in another tab/window for convenience!

## Variables and data types

The following data types are supported by Netscript:
numeric - Integers and floats (eg. 6, 10.4999)
string - Encapsulated by single or double quotes (eg. 'this is a string')
boolean - true or false

Strings are fully functional Javascript strings, which means that all of the member functions of Javascript strings such as toLowerCase() and includes() are also available in Netscript!

To create a variable, use the assign (=) operator. The language is not strongly typed. Examples:
i = 5;
s = 'this game is awesome!';

In the first example above, we are creating the variable i and assigning it a value of 5. In the second, we are creating the variable s and assigning it the value of a string. Note that all expressions must be ended with a semicolon.

## Operators

The following operators are supported by Netscript:

```txt
 +
 -
 *
 /
 %
 &&
 ||
 <
 >
 <=
 >=
 ==
 !=
 ++ (Note: This ONLY pre-increments. Post-increment does not work)
 -- (Note: This ONLY pre-decrements. Post-decrement does not work)
 - (Negation operator)
 !
```

## Arrays

Netscript arrays have the same properties and functions as javascript arrays. For information see javascripts array documentation.

## Script Arguments

Arguments passed into a script can be accessed using a special array called 'args'. The arguments can be accessed like a normal array using the [] operator. (args[0], args[1], args[2]...)

For example, let's say we want to make a generic script 'generic-run.script' and we plan to pass two arguments into that script. The first argument will be the name of another script, and the second argument will be a number. This generic script will run the script specified in the first argument with the amount of threads specified in the second element. The code would look like:

run(args[0], args[1]);

It is also possible to get the number of arguments that was passed into a script using:

args.length

Note that none of the other functions that typically work with arrays, such as remove(), insert(), clear(), etc., will work on the args array.

## Javascript Modules

Netscript supports the following Javascript Modules:

Math
Date (static functions only)

## Functions

You can NOT define you own functions in Netscript (yet), but there are several built in functions that you may use:

hack(hostname/ip)
Core function that is used to try and hack servers to steal money and gain hacking experience. The argument passed in must be a string with either the IP or hostname of the server you want to hack. The runtime for this command depends on your hacking level and the target server's security level. A script can hack a server from anywhere. It does not need to be running on the same server to hack that server. For example, you can create a script that hacks the 'foodnstuff' server and run that script on any server in the game. A successful hack() on a server will raise that server's security level by 0.002. Returns true if the hack is successful and false otherwise.
Examples: hack('foodnstuff'); or hack('148.192.0.12');

sleep(n, log=true)
Suspends the script for n milliseconds. The second argument is an optional boolean that indicates whether or not the function should log the sleep action. If this argument is true, then calling this function will write 'Sleeping for N milliseconds' to the script's logs. If it's false, then this function will not log anything. If this argument is not specified then it will be true by default.
Example: sleep(5000);

grow(hostname/ip)
Use your hacking skills to increase the amount of money available on a server. The argument passed in must be a string with either the IP or hostname of the target server. The runtime for this command depends on your hacking level and the target server's security level. When grow() completes, the money available on a target server will be increased by a certain, fixed percentage. This percentage is determined by the server's growth rate and varies between servers. Generally, higher-level servers have higher growth rates.

Like hack(), grow() can be called on any server, regardless of where the script is running. The grow() command requires root access to the target server, but there is no required hacking level to run the command. It also raises the security level of the target server by 0.004. Returns the number by which the money on the server was multiplied for the growth. Works offline at a slower rate.
Example: grow('foodnstuff');

weaken(hostname/ip)
Use your hacking skills to attack a server's security, lowering the server's security level. The argument passed in must be a string with either the IP or hostname of the target server. The runtime for this command depends on your hacking level and the target server's security level. This function lowers the security level of the target server by 0.05.

Like hack() and grow(), weaken() can be called on any server, regardless of where the script is running. This command requires root access to the target server, but there is no required hacking level to run the command. Returns 0.1. Works offline at a slower rate
Example: weaken('foodnstuff');

print(x)
Prints a value or a variable to the scripts logs (which can be viewed with the 'tail [script]' terminal command ).

tprint(x)
Prints a value or a variable to the Terminal

clearLog()
Clears the script's logs.

scan(hostname/ip, [hostnames=true])
Returns an array containing the hostnames or IPs of all servers that are one node away from the specified server. The argument must be a string containing the IP or hostname of the target server. The second argument is a boolean that specifies whether the hostnames or IPs of the scanned servers should be output. If it is true then hostnames will be returned, and if false then IP addresses will. This second argument is optional and, if ommitted, the function will output the hostnames of the scanned servers. The hostnames/IPs in the returned array are strings.

nuke(hostname/ip)
Run NUKE.exe on the target server. NUKE.exe must exist on your home computer.
Example: nuke('foodnstuff');

brutessh(hostname/ip)
Run BruteSSH.exe on the target server. BruteSSH.exe must exist on your home computer.
Example: brutessh('foodnstuff');

ftpcrack(hostname/ip)
Run FTPCrack.exe on the target server. FTPCrack.exe must exist on your home computer.
Example: ftpcrack('foodnstuff');

relaysmtp(hostname/ip)
Run relaySMTP.exe on the target server. relaySMTP.exe must exist on your home computer.
Example: relaysmtp('foodnstuff');

httpworm(hostname/ip)
Run HTTPWorm.exe on the target server. HTTPWorm.exe must exist on your home computer.
Example: httpworm('foodnstuff');

sqlinject(hostname/ip)
Run SQLInject.exe on the target server. SQLInject.exe must exist on your home computer.
Example: sqlinject('foodnstuff');

run(script, [numThreads], [args...])
Run a script as a separate process. The first argument that is passed in is the name of the script as a string. This function can only be used to run scripts located on the current server (the server running the script that calls this function). The second argument is optional, and it specifies how many threads to run the script with. This argument must be a number greater than 0. If it is omitted, then the script will be run single-threaded. Any additional arguments will specify arguments to pass into the new script that is being run. If arguments are specified for the new script, then the second argument numThreads argument must be filled in with a value.

Returns true if the script is successfully started, and false otherwise. Requires a significant amount of RAM to run this command.

The simplest way to use the run command is to call it with just the script name. The following example will run 'foo.script' single-threaded with no arguments:

run('foo.script');

The following example will run 'foo.script' but with 5 threads instead of single-threaded:

run('foo.script', 5);

The following example will run 'foo.script' single-threaded, and will pass the string 'foodnstuff' into the script as an argument:

run('foo.script', 1, 'foodnstuff');

exec(script, hostname/ip, [numThreads], [args...])
Run a script as a separate process on another server. The first argument is the name of the script as a string. The second argument is a string with the hostname or IP of the 'target server' on which to run the script. The specified script must exist on the target server. The third argument is optional, and it specifies how many threads to run the script with. If it is omitted, then the script will be run single-threaded. This argument must be a number that is greater than 0. Any additional arguments will specify arguments to pass into the new script that is being run. If arguments are specified for the new script, then the third argument numThreads must be filled in with a value.

Returns true if the script is successfully started, and false otherwise.

The simplest way to use the exec command is to call it with just the script name and the target server. The following example will try to run 'generic-hack.script' on the 'foodnstuff' server:

exec('generic-hack.script', 'foodnstuff');

The following example will try to run the script 'generic-hack.script' on the 'joesguns' server with 10 threads:

exec('generic-hack.script', 'joesguns', 10);

The following example will try to run the script 'foo.script' on the 'foodnstuff' server with 5 threads. It will also pass the number 1 and the string 'test' in as arguments to the script.

exec('foo.script', 'foodnstuff', 5, 1, 'test');

kill(script, hostname/ip, [args...])
Kills the script on the target server specified by the script's name and arguments. Remember that scripts are uniquely identified by both their name and arguments. For example, if 'foo.script' is run with the argument 1, then this is not the same as 'foo.script' run with the argument 2, even though they have the same code.

The first argument must be a string with the name of the script. The name is case-sensitive. The second argument must be a string with the hostname or IP of the target server. Any additional arguments to the function will specify the arguments passed into the script that should be killed.

The function will try to kill the specified script on the target server. If the script is found on the specified server and is running, then it will be killed and this function will return true. Otherwise, this function will return false.

Examples:
If you are trying to kill a script named 'foo.script' on the 'foodnstuff' server that was ran with no arguments, use this:

kill('foo.script', 'foodnstuff');

If you are trying to kill a script named 'foo.script' on the current server that was ran with no arguments, use this:

kill('foo.script', getHostname());

If you are trying to kill a script named 'foo.script' on the current server that was ran with the arguments 1 and 'foodnstuff', use this:

kill('foo.script', getHostname(), 1, 'foodnstuff');

killall(hostname/ip)
Kills all running scripts on the specified server. This function takes a single argument which must be a string containing the hostname or IP of the target server. This function will always return true.

scp(script, [source], destination)
Copies a script or literature (.lit) file to another server. The first argument is a string with the filename of the script or literature file to be copied, or an array of filenames to be copied. The next two arguments are strings containing the hostname/IPs of the source and target server. The source refers to the server from which the script/literature file will be copied, while the destination refers to the server to which it will be copied. The source server argument is optional, and if ommitted the source will be the current server (the server on which the script is running). Returns true if the script/literature file is successfully copied over and false otherwise. If the first argument passed in is an array, then the function will return if at least one of the files in the array is successfully copied over.

Example: scp('hack-template.script', 'foodnstuff'); //Copies hack-template.script from the current server to foodnstuff
Example: scp('foo.lit', 'helios', 'home'); //Copies foo.lit from the helios server to the home computer

ls(hostname/ip)
Returns an array containing the names of all files on the specified server. The argument must be a string with the hostname or IP of the target server.

hasRootAccess(hostname/ip)
Returns a boolean (true or false) indicating whether or not the Player has root access to a server. The argument passed in must be a string with either the hostname or IP of the target server.
Example:
if (hasRootAccess('foodnstuff') == false) {
    nuke('foodnstuff');
}

getIp()
Returns a string with the IP Address of the server that the script is running on

getHostname()
Returns a string with the hostname of the server that the script is running on

getHackingLevel()
Returns the Player's current hacking level.

getIntelligence()
Returns the Player's current intelligence level. Requires Source-File 5 to run

getHackingMultipliers()
Returns an object containing the Player's hacking related multipliers. These multipliers are returned in integer forms, not percentages (e.g. 1.5 instead of 150%). The object has the following structure:

{
chance: Player's hacking chance multiplier
speed: Player's hacking speed multiplier
money: Player's hacking money stolen multiplier
growth: Player's hacking growth multiplier
}

Example:

mults = getHackingMultipliers();
print(mults.chance);
print(mults.growth);

getBitNodeMultipliers()
Returns an object containing the current BitNode multipliers. This function requires Source-File 5 in order to run. The multipliers are returned in integer forms, not percentages (e.g. 1.5 instead of 150%). The multipliers represent the difference between the current BitNode and the original BitNode (BitNode-1). For example, if the 'CrimeMoney' multiplier has a value of 0.1 then that means that committing crimes in the current BitNode will only give 10% of the money you would have received in BitNode-1. The object has the following structure (subject to change in the future):

{
ServerMaxMoney: 1,
ServerStartingMoney: 1,
ServerGrowthRate: 1,
ServerWeakenRate: 1,
ServerStartingSecurity: 1,
ManualHackMoney: 1,
ScriptHackMoney: 1,
CompanyWorkMoney: 1,
CrimeMoney: 1,
HacknetNodeMoney: 1,
CompanyWorkExpGain: 1,
ClassGymExpGain: 1,
FactionWorkExpGain: 1,
HackExpGain: 1,
CrimeExpGain: 1,
FactionWorkRepGain: 1,
FactionPassiveRepGain: 1,
AugmentationRepCost: 1,
AugmentationMoneyCost: 1,
}

Example:

mults = getBitNodeMultipliers();
print(mults.ServerMaxMoney);
print(mults.HackExpGain);

getServerMoneyAvailable(hostname/ip)
Returns the amount of money available on a server. The argument passed in must be a string with either the hostname or IP of the target server.
Example: getServerMoneyAvailable('foodnstuff');

getServerMaxMoney(hostname/ip)
Returns the maximum amount of money that can be available on a server. The argument passed in must be a string with the hostname or IP of the target server.
Example: getServerMaxMoney('foodnstuff');

getServerGrowth(hostname/ip)
Returns the server's intrinsic 'growth parameter'. This growth parameter is a number between 1 and 100 that represents how quickly the server's money grows. This parameter affects the percentage by which this server's money is increased when using the grow() function. A higher growth parameter will result in a higher percentage from grow().

The argument passed in must be a string with the hostname or IP of the target server.

getServerSecurityLevel(hostname/ip)
Returns the security level of a server. The argument passed in must be a string with either the hostname or IP of the target server. A server's security is denoted by a number, typically between 1 and 100.

getServerBaseSecurityLevel(hostname/ip)
Returns the base security level of a server. This is the security level that the server starts out with. This is different than getServerSecurityLevel() because getServerSecurityLevel() returns the current security level of a server, which can constantly change due to hack(), grow(), and weaken() calls on that server. The base security level will stay the same until you reset by installing an Augmentation.

The argument passed in must be a string with either the hostname or IP of the target server. A server's base security is denoted by a number, typically between 1 and 100.

getServerMinSecurityLevel(hostname/ip)Returns the minimum security level of a server. The argument passed in must be a string with either the hostname or IP of the target server.

getServerRequiredHackingLevel(hostname/ip)
Returns the required hacking level of a server. The argument passed in must be a string with either the hostname or IP or the target server.

getServerNumPortsRequired(hostname/ip)
Returns the number of open ports required to successfully run NUKE.exe on a server. The argument passed in must be a string with either the hostname or IP of the target server.

getServerRam(hostname/ip)
Returns an array with two elements that gives information about the target server's RAM. The first element in the array is the amount of RAM that the server has (in GB). The second element in the array is the amount of RAM that is currently being used on the server.

serverExists(hostname/ip)
Returns a boolean denoting whether or not the specified server exists. The argument must be a string with the hostname or IP of the target server.

fileExists(filename, [hostname/ip])
Returns a boolean (true or false) indicating whether the specified file exists on a server. The first argument must be a string with the name of the file. A file can either be a script, program, or literature file. A script name is case-sensitive, but a program/literature file is not. For example, fileExists('brutessh.exe') will work fine, even though the actual program is named BruteSSH.exe.

The second argument is a string with the hostname or IP of the server on which to search for the program. This second argument is optional. If it is omitted, then the function will search through the current server (the server running the script that calls this function) for the file.
Example: fileExists('foo.script', 'foodnstuff');
Example: fileExists('ftpcrack.exe');

The first example above will return true if the script named 'foo.script' exists on the 'foodnstuff' server, and false otherwise. The second example above will return true if the current server (the server on which this function runs) contains the FTPCrack.exe program, and false otherwise.

isRunning(filename, hostname/ip, [args...])
Returns a boolean (true or false) indicating whether the specified script is running on a server. Remember that a script is uniquely identified by both its name and its arguments.

The first argument must be a string with the name of the script. The script name is case sensitive. The second argument is a string with the hostname or IP of the target server. Any additional arguments passed to the function will specify the arguments passed into the target script. The function will check whether the script is running on that target server.
Example: isRunning('foo.script', 'foodnstuff');
Example: isRunning('foo.script', getHostname());
Example: isRunning('foo.script', 'joesguns', 1, 5, 'test');

The first example above will return true if there is a script named 'foo.script' with no arguments running on the 'foodnstuff' server, and false otherwise. The second example above will return true if there is a script named 'foo.script' with no arguments running on the current server, and false otherwise. The third example above will return true if there is a script named 'foo.script' with the arguments 1, 5, and 'test' running on the 'joesguns' server, and false otherwise.

getNextHacknetNodeCost()
Returns the cost of purchasing a new Hacknet Node

purchaseHacknetNode()
Purchases a new Hacknet Node. Returns a number with the index of the Hacknet Node. This index is equivalent to the number at the end of the Hacknet Node's name (e.g The Hacknet Node named 'hacknet-node-4' will have an index of 4). If the player cannot afford to purchase a new Hacknet Node then the function will return false. Does NOT work offline

purchaseServer(hostname, ram)
Purchases a server with the specified hostname and amount of RAM. The first argument can be any data type, but it will be converted to a string using Javascript's String function. Anything that resolves to an empty string will cause the function to fail. The second argument specified the amount of RAM (in GB) for the server. This argument must resolve to a numeric and it must be a power of 2 (2, 4, 8, etc...).

This function returns the hostname of the newly purchased server as a string. If the function fails to purchase a server, then it will return an empty string. The function will fail if the arguments passed in are invalid or if the player does not have enough money to purchase the specified server.

deleteServer(hostname)
Deletes one of the servers you've purchased with the specified hostname. The function will fail if there are any scripts running on the specified server. Returns true if successful and false otherwise

getPurchasedServers([hostname=true])
Returns an array with either the hostname or IPs of all of the servers you have purchased. It takes an optional parameter specifying whether the hostname or IP addresses will be returned. If this parameter is not specified, it is true by default and hostnames will be returned

round(n)
Rounds the number n to the nearest integer. If the argument passed in is not a number, then the function will return 0.

write(port, data)
Writes data to a port. The first argument must be a number between 1 and 10 that specifies the port. The second argument defines the data to write to the port. If the second argument is not specified then it will write an empty string to the port.

read(port)
Reads data from a port. The first argument must be a number between 1 and 10 that specifies the port. A port is a serialized queue. This function will remove the first element from the queue and return it. If the queue is empty, then the string 'NULL PORT DATA' will be returned.

scriptRunning(scriptname, hostname/ip)
Returns a boolean indicating whether any instance of the specified script is running on a server, regardless of its arguments. This is different than the isRunning() function because it does not try to identify a specific instance of a running script by its arguments.

The first argument must be a string with the name of the script. The script name is case sensitive. The second argument is a string with the hostname or IP of the target server. Both arguments are required.

scriptKill(scriptname, hostname/ip)
Kills all scripts with the specified filename that are running on the server specified by the hostname/ip, regardless of arguments. Returns true if one or more scripts were successfully killed, and false if there were none.

The first argument must be a string with the name of the script. The script name is case sensitive. The second argument is a string with the hostname or IP of the target server. Both arguments are required.

getScriptRam(scriptname, hostname/ip)
Returns the amount of RAM required to run the specified script on the target server. The first argument must be a string with the name of the script. The script name is case sensitive. The second argument is a string with the hostname or IP of the server where that script is. Both arguments are required.

getHackTime(hostname/ip)
Returns the amount of time in seconds it takes to execute the hack() Netscript function on the server specified by the hostname/ip. The argument must be a string with the hostname/ip of the target server.

getGrowTime(hostname/ip)
Returns the amount of time in seconds it takes to execute the grow() Netscript function on the server specified by the hostname/ip. The argument must be a string with the hostname/ip of the target server.

getWeakenTime(hostname/ip)
Returns the amount of time in seconds it takes to execute the weaken() Netscript function on the server specified by the hostname/ip. The argument must be a string with the hostname/ip of the target server.

getScriptIncome([scriptname], [hostname/ip], [args...])
Returns the amount of income the specified script generates while online (when the game is open, does not apply for offline income). This function can also be called with no arguments. If called with no arguments, then this function will return an array of two values. The first value is the total income ($/sec) of all of your active scripts (currently running). The second value is the total income ($/sec) from scripts since you last installed Augmentations (or destroyed a BitNode).

Remember that a script is uniquely identified by both its name and its arguments. So for example if you ran a script with the arguments 'foodnstuff' and '5' then in order to use this function to get that script's income you must specify those arguments in this function call.

The first argument, if specified, must be a string with the name of the script (including the .script extension). The second argument must be a string with the hostname/IP of the target server. If the first argument is specified then the second argument must be specified as well. Any additional arguments passed to the function will specify the arguments passed into the target script.

getScriptExpGain([scriptname], [hostname/ip], [args...])
Returns the amount of hacking experience the specified script generates while online (when the game is open, does not apply for offline experience gains). This function can also return the total experience gain rate of all of your active scripts by running the function with no arguments.

Remember that a script is uniquely identified by both its name and its arguments. So for example if you ran a script with the arguments 'foodnstuff' and '5' then in order to use this function to get that script's income you must specify those arguments in this function call.

The first argument, if specified, must be a string with the name of the script (including the .script extension). The second argument must be a string with the hostname/IP of the target server. If the first argument is specified then the second argument must be specified as well. Any additional arguments passed to the function will specify the arguments passed into the target script.

getTimeSinceLastAug()
Returns the amount of time in milliseconds that have passed since you last installed Augmentations (or destroyed a BitNode).

## Hacknet Nodes API

Netscript provides the following API for accessing and upgrading your Hacknet Nodes through scripts. This API does NOT work offline.

hacknetnodes
A special variable. This is an array that maps to the Player's Hacknet Nodes. The Hacknet Nodes are accessed through indexes. These indexes correspond to the number at the end of the name of the Hacknet Node. For example, the first Hacknet Node you purchase will have the same 'hacknet-node-0' and can be accessed with hacknetnodes[0]. The fourth Hacknet Node you purchase will have the name 'hacknet-node-3' and can be accessed with hacknetnodes[3].

hacknetnodes.length
Returns the number of Hacknet Nodes that the player owns

hacknetnodes[i].level
Returns the level of the corresponding Hacknet Node

hacknetnodes[i].ram
Returns the amount of RAM on the corresponding Hacknet Node

hacknetnodes[i].cores
Returns the number of cores on the corresponding Hacknet Node

hacknetnodes[i].totalMoneyGenerated
Returns the total amount of money that the corresponding Hacknet Node has earned

hacknetnodes[i].onlineTimeSeconds
Returns the total amount of time that the corresponding Hacknet Node has existed

hacknetnodes[i].moneyGainRatePerSecond
Returns the income ($ / sec) that the corresponding Hacknet Node earns

hacknetnodes[i].upgradeLevel(n)
Tries to upgrade the level of the corresponding Hacknet Node n times. The argument n must be a positive integer. Returns true if the Hacknet Node's level is successfully upgraded n times or up to the max level (200), and false otherwise.

hacknetnodes[i].upgradeRam()
Tries to upgrade the amount of RAM on the corresponding Hacknet Node. Returns true if the RAM is successfully upgraded, and false otherwise.

hacknetnodes[i].upgradeCore()
Attempts to purchase an additional core for the corresponding Hacknet Node. Returns true if the additional core is successfully purchase, and false otherwise.

Example: The following is an example of one way a script can be used to automate the purchasing and upgrading of Hacknet Nodes. This script purchases new Hacknet Nodes until the player has four. Then, it iteratively upgrades each of those four Hacknet Nodes to a level of at least 75, RAM to at least 8GB, and number of cores to at least 2.

while(hacknetnodes.length < 4) {
    purchaseHacknetNode();
}
for (i = 0; i < 4; i = i++) {
    while (hacknetnodes[i].level <= 75) {
        hacknetnodes[i].upgradeLevel(5);
        sleep(10000);
    }
}
for (i = 0; i < 4; i = i++) {
    while (hacknetnodes[i].ram < 8) {
        hacknetnodes[i].upgradeRam();
        sleep(10000);
    }
}
for (i = 0; i < 4; i = i++) {
    while (hacknetnodes[i].cores < 2) {
        hacknetnodes[i].upgradeCore();
        sleep(10000);
    }
}

## Trade Information eXchange (TIX) API

getStockPrice(sym)
Returns the price of a stock. The argument passed in must be the stock's symbol (NOT THE COMPANY NAME!). The symbol is a sequence of two to four capital letters. The symbol argument must be a string.

Example: getStockPrice('FSIG');

getStockPosition(sym)
Returns an array of two elements that represents the player's position in a stock. The first element in the array is the number of shares the player owns of the specified stock. The second element in the array is the average price of the player's shares. Both elements are numbers. The argument passed in must be the stock's symbol, which is a sequence of two to four capital letters.

Example:

pos = getStockPosition('ECP');
shares = pos[0];
avgPx = pos[1];

buyStock(sym, shares)
Attempts to purchase shares of a stock. The first argument must be a string with the stock's symbol. The second argument must be the number of shares to purchase.

If the player does not have enough money to purchase specified number of shares, then no shares will be purchased (it will not purchase the most you can afford). Remember that every transaction on the stock exchange costs a certain commission fee.

The function will return true if it successfully purchases the specified number of shares of stock, and false otherwise.

sellStock(sym, shares)
Attempts to sell shares of a stock. The first argument must be a string with the stock's symbol. The second argument must be the number of shares to sell.

If the specified number of shares in the function exceeds the amount that the player actually owns, then this function will sell all owned shares. Remember that every transaction on the stock exchange costs a certain commission fee.

The net profit made from selling stocks with this function is reflected in the script's statistics. This net profit is calculated as:

shares * (sell price - average price of purchased shares)

This function will return true if the shares of stock are successfully sold and false otherwise.

## While loops

A while loop is a control flow statement that repeatedly executes code as long as a condition is met.

while ([cond]) {
    [code]
}

As long as [cond] remains true, the code block [code] will continuously execute. Example:

i = 0;
while (i < 10) {
    hack('foodnstuff');
    i = i + 1;
}

This code above repeats the 'hack('foodnstuff')' command 10 times before it stops and exits.

while(true) {
     hack('foodnstuff');
}

This while loop above is an infinite loop (continuously runs until the script is manually stopped) that repeatedly runs the 'hack('foodnstuff')' command. Note that a semicolon is needed at closing bracket of the while loop, UNLESS it is at the end of the code

## For loops

A for loop is another control flow statement that allows code to be repeated by iterations. The structure is:

for ([init]; [cond]; [post]) {
    code
}

The [init] expression evaluates before the for loop begins. The for loop will continue to execute as long as [cond] is met. The [post] expression will evaluate at the end of every iteration of the for loop. The following example shows code that will run the 'hack('foodnstuff');' command 10 times using a for loop:

for (i = 0; i < 10; i = i++) {
    hack('foodnstuff');
}

## If statements

If/Else if/Else statements are conditional statements used to perform different actions based on different conditions:

if (condition1) {
    code1
} else if (condition2) {
    code2
} else {
    code3
}

In the code above, first condition1 will be checked. If this condition is true, then code1 will execute and the rest of the if/else if/else statement will be skipped. If condition1 is NOT true, then the code will then go on to check condition2. If condition2 is true, then code2 will be executed, and the rest of the if/else if/else statement will be skipped. If none of the conditions are true, then the code within the else block (code3) will be executed. Note that a conditional statement can have any number of 'else if' statements.

Example:

if(getServerMoneyAvailable('foodnstuff') > 200000) {
    hack('foodnstuff');
} else {
    grow('foodnstuff');
}

The code above will use the getServerMoneyAvailable() function to check how much money there is on the 'foodnstuff' server. If there is more than $200,000, then it will try to hack that server. If there is $200,000 or less on the server, then the code will call grow('foodnstuff') instead and add more money to the server.
