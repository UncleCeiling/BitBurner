# Commands

## File-System

### `cat [file]`

Display a .msg, .lit, or .txt file

### `cd [dir]`

Change to a new directory

### `grep [opts]... pattern [file]... [-O] [target file]`

Search for PATTERN (string/regular expression) in each FILE and print results to terminal

### `ls [dir] [--grep pattern]`

Displays all files on the machine

### `mv [src] [dest]`

Move/rename a text or script file

### `nano [files...]`

Text editor - Open up and edit one or more scripts or text files

### `rm [OPTIONS]... [FILE]...`

Delete a file from the server

## Command-line management

### `alias [-g] [name="value"]`

Create or display Terminal aliases

### `clear` / `cls`

Clear all text on the terminal

### `expr [math expression]`

Evaluate a mathematical expression

### `free`

Check the machine's memory (RAM) usage

### `history [-c]`

Display the terminal history

### `kill [script/pid] [args...]`

Stops the specified script on the current server

### `killall`

Stops all running scripts on the current machine

### `lscpu`

Displays the number of CPU cores on the machine

### `mem [script] [-t n]`

Displays the amount of RAM required to run the script

### `ps`

Display all scripts that are currently running

### `run [script] [-t n] [--tail] [--ram-override n] [args...]`

Execute a program or script

### `sudov`

Shows whether you have root access on this computer

### `tail [script/pid] [args...]`

Displays dynamic logs for the specified script

### `top`

Displays all running scripts and their RAM usage

### `unalias [alias name]`

Deletes the specified alias

### `vim [files...]`

Text editor - Open up and edit one or more scripts or text files in vim mode

## Hacking

### `analyze`

Get information about the current machine

### `backdoor`

Install a backdoor on the current machine

### `buy [-l/-a/program]`

Purchase a program through the Dark Web

### `grow`

Spoof money in a servers bank account, increasing the amount available

### `hack`

Hack the current machine

### `weaken`

Reduce the security of the current machine

## Network

### `connect [hostname]`

Connects to a remote server`cp [src] [dest]`Copy a file

### `download [script/text file]`

Downloads scripts or text files to your computer

### `home`

Connect to home computer

### `hostname`

Displays the hostname of the machine

### `scan`

Prints all immediately-available network connections

### `scan-analyze [d] [-a]`

Prints info for all servers up to d nodes away

### `scp [files...] [server]`

Copies a file to a destination server

### `wget [url] [target file]`

Retrieves code/text from a web server

## Meta

### `changelog`

Display changelog

### `check [script] [args...]`

Print a script's logs to Terminal

### `help [command]`

Display this help text, or the help text for a command
