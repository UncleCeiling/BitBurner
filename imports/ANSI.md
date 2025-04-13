# ANSI Codes

## General Syntax

```sh
\u001b[Xm
```

Where `X` is the appropriate ANSI code.

## Multiple Codes

```sh
\u001b[X;Y;Zm
```

Where `X`, `Y` and `Z` are different ANSI codes, separated by semicolons `;`.

## Currently Usable ANSI Codes=====

### Font Codes

|||||
|-:|:-|-:|:-|
|reset: 0|`\u001b[0m`|||
|bold: 1|`\u001b[1m`|un-bold: 22|`\u001b[22m`|
|italic: 3|`\u001b[3m`|unitalic: 23|`\u001b[23m`|
|underline: 4|`\u001b[4m`|deunderline: 24|`\u001b[24m`|

### Basic Colours

#### Foreground

|Colour|Code||
|-:|:-:|:-|
|gray|30|`\u001b[30m`|
|red|31|`\u001b[31m`|
|green|32|`\u001b[32m`|
|yellow|33|`\u001b[33m`|
|blue|34|`\u001b[34m`|
|magenta|35|`\u001b[35m`|
|cyan|36|`\u001b[36m`|
|white|37|`\u001b[37m`|

#### Background

|Colour|Code||
|-:|:-:|:-|
|black|30|`\u001b[40m`|
|red|31|`\u001b[41m`|
|green|32|`\u001b[42m`|
|yellow|33|`\u001b[43m`|
|blue|34|`\u001b[44m`|
|magenta|35|`\u001b[45m`|
|cyan|36|`\u001b[46m`|
|white|37|`\u001b[47m`|

### 8-bit Codes

#### Set Foreground

```sh
\u001b[38;5;Xm
```

Where `X` is the desired colour code for the text

#### Set Background

```sh
\u001b[48;5;Xm
```

Where `X` is the desired colour code for the background
