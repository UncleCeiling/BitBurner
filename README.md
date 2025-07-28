# Bitburner

This is my BitBurner repo!

## 🗺️ Map

📦BitBurner  
┣ 📂.vscode  
┣ 📂live  
┃ ┣ 📂contracts  
┃ ┣ 📂data  
┃ ┣ 📂imports  
┃ ┣ 📂modules  
┃ ┣ 📂scripts  
┃ ┣ 📂shopping  
┃ ┣ 📂stanek  
┃ ┣ 📂tools  
┃ ┣ 📜boot.js  
┃ ┣ 📜main.js  
┃ ┗ 📜reboot.js  
┣ 📂old  
┣ 📜.gitignore  
┣ 📜AchievementData.json  
┣ 📜commands.md  
┣ 📜cspell.json  
┣ 📜jsconfig.json  
┣ 📜NetscriptDefinitions.d.ts  
┣ 📜README.md  
┗ 📜template.js

## 🔍Breakdown

### 📂live

> Contains all the files that get synced to Bitburner.

---

#### 📂contracts

> Contains all of the contract scripts and some tools for interacting with contracts.  
> Also includes a template and scripts that have not been completed yet.

##### 📂.template | 📂complete | 📂todo

> Contains the contract solving scripts themselves. Only the `complete` folder is used by the [contracts module](#contractsjs).

##### 📜contract_cleaner.js

> **Main:**  
> Removes all contracts from all servers.  
> Reports how many successfully deleted and across how many servers.

##### 📜stress_tester.js

> **Main:**  
> Creates a given number of dummy contracts for each contract type.  
> Runs [`contracts.js`](#contractsjs) when all dummy contracts are made.

---

#### 📂data

> This is where all the data storage files get generated and accessed by modules. (This is usually empty because it gets filled when the scripts run.)

---

#### 📂imports

> Place for storing custom libraries to be used by modules and other scripts.

##### 📜example.js

> Examples of how to export classes, functions and variables for use in other scripts.
>
> **Main:**  
> Alerts with the examples of the following...
>
> **Variables:**  
> `CONSTANT` - simple constant.
>
> **Functions:**  
> `function_name(ns,foo)` - simple function.
>
> **Classes:**  
> `FooBar()` - simple class.

##### 📜achievements.js

> Examples of how to export classes, functions and variables for use in other scripts.
>
> **Main:**  
> Alerts with 2 lists of achievements with matching descriptions:
> `Locked` & `Unlocked`
>
> **Classes:**  
> `Achievements` - used to fetch, parse and assess the state of in-game achievements.

##### 📜ANSI.js & 📓ANSI.md

> Colours!
>
> ---
>
> `.js`  
> **Main:**  
> Opens a tail and prints an `ANSI` colour palette to it.
>
> **Variables:**  
> `ANSI` - used to access ANSI codes for colouring strings.  
> Sorted into `fg`, `bg` and `font` - with `reset` for clearing the formatting.
>
> ---
>
> `.md`  
> Contains a guide for understanding how ANSI works and how to use `ANSI.js`.

##### 📜exes.js

> **Main:**  
> Alerts showing which `.exe`s exist and what their skill requirement is.
>
> **Functions:**  
> `all_exes(ns)` - Returns a set containing all possible `Exe` objects.
>
> **Classes:**  
> `Exe` - models a given `.exe` file, providing getter for names, requirement and existence.

##### 📜modules.js

> **Main:**  
> Alerts with the list of modules, displaying their RAM cost and whether they are enabled (⭕) or disabled (❌).
>
> **Variables:**  
> `MODULES_PATH` - the location of the modules in the file-structure.
>
> **Functions:**  
> `all_modules(ns)` - Returns an array of `Module` objects representing all the scripts in the module folder.
>
> **Classes:**  
> `Module` - acts as an interface for each script, allowing the state of the module to be tracked and modified to a limited degree.

##### 📜servers.js

> **Main:**  
> Alerts with a list of all servers visible at that moment.  
> The list also shows if the servers are rooted/backdoored and their current free RAM.
>
> **Functions:**  
> `write_map(ns)` - Writes a map of the network to the data folder, overwriting any old information.  
> `server_stats(ns)` - Writes a dump of server information for purchased servers into the data folder.
>
> **Classes:**  
> `UtilServer` - Represents a given server and it's properties/connections.  
> `AllServers` - Represents the entire network as a dynamically generated set/array of `UtilServer` objects.

##### 📜utilities.js

> **Main:**  
> *Unused*
>
> **Functions:**  
> `terminal_command(ns,command)` - Runs the given command via the terminal.

---

#### 📂modules

##### 📂contracts.js

---

#### 📂scripts

---

#### 📂shopping

---

#### 📂stanek

---

#### 📂tools
---
#### 📜boot.js
> **Main:**  
> **Variables:**  
> **Functions:**  
> **Classes:**

#### 📜main.js
> **Main:**  
> **Variables:**  
> **Functions:**  
> **Classes:**

#### 📜reboot.js
> **Main:**  
> **Variables:**  
> **Functions:**  
> **Classes:**

### 📂.vscode

### 📂old

Just a folder for old stuff.

> This is also where things like the lore, demos and references are for now.

### 📜.gitignore

It's the gitignore!

> Empty for now.

### 📜commands.md

A Markdown doc I made to keep track of terminal commands.

> Essentially ripped straight from `help`

### 📜cspell.json

Config for the spellchecker including a list of words.

> Includes a list of words and capacity for a dictionary.

### 📜jsconfig.json

### 📜NetscriptDefinitions.d.ts

### 📜README.md

### 📜template.js
