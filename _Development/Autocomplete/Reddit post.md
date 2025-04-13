I started playing Bitburner a few days ago. It seems using VSCode is a popular choice for many of us, though alternatives are [available](https://www.reddit.com/r/Bitburner/comments/swyx2h/another_bitburner_sync/). Luckily, there is already an [integration extension](https://github.com/bitburner-official/bitburner-vscode). However, it seems it is not as straightforward as one might hope (e.g., [here](https://www.reddit.com/r/Bitburner/comments/sdydgj/getting_the_custom_lines_of_code_to_appear_in/), [here](https://www.reddit.com/r/Bitburner/comments/suk6p6/can_i_manage_my_code_in_my_own_repo_and_ide/), [here](https://www.reddit.com/r/Bitburner/comments/ry6wno/is_this_the_only_way_for_netscript_autocomplete/), and [here](https://www.reddit.com/r/Bitburner/comments/rp0eoo/relative_absolute_imports/)). Also, there is still room for improvements like better syncing and [RAM usage calculations](https://www.reddit.com/r/Bitburner/comments/bh48y2/visual_studio_code_ram_calculator_extra/). If you are willing to ignore all that for the time being, this is going to work for you.

Before we get started, if you are interested in a complete template, you might want to checkout [this](https://github.com/bitburner-official/vscode-template).

Let's start with the basics first:

1. Open Bitburner and enable integration `API Server -> Enable Server + Autostart`
2. While still in Bitburner, copy the Authentication key `API Server -> Copy Auth Token`
3. Open VSCode extensions and install [bitburner.bitburner-vscode-integration](https://marketplace.visualstudio.com/items?itemName=bitburner.bitburner-vscode-integration)
4. Create an empty folder and open it with VSCode `File -> Open Folder`
5. Edit `.vscode/settings.json` via `Ctrl+Shift+P -> Preferences: Open Workspace Settings (JSON)`
6. Paste the following snippet and save the file (don't forget to use your key)

    ```json
    {
        "bitburner.authToken": "PASTE-YOUR-AUTH-TOKEN-HERE",
        "bitburner.scriptRoot": ".",
        "bitburner.fileWatcher.enable": true,
        "bitburner.showPushSuccessNotification": true,
        "bitburner.showFileWatcherEnabledNotification": true,
    }
    ```

This should be it! You can change the settings above to your liking. Beware, so far, the file watcher only sync edits and new files. You will need to handle deleting, moving, and renaming files yourself.

If you want to enable autocomplete, keep reading:

1. Download [NetscriptDefinitions.d.ts](https://github.com/bitburner-official/bitburner-src/blob/dev/src/ScriptEditor/NetscriptDefinitions.d.ts) and add the following before the first line

    ```typescript
    declare global { const NS: NS; }
    ```

2. Create a new file named `jsconfig.json` that has this configuration

    ```json
    {
        "compilerOptions": {
            "baseUrl": "."
        }
    }
    ```

3. Edit `.vscode/settings.json` again and append these options (inside the curly braces)

    ```json
    {
        "javascript.preferences.importModuleSpecifier": "non-relative",
        "files.exclude": {
            "jsconfig.json": true,
            "NetscriptDefinitions.d.ts": true,
        },
    }
    ```

4. Use [JSDoc](https://code.visualstudio.com/docs/languages/javascript#_jsdoc-support) in your `*.js` scripts as suggested in the [documentation](https://bitburner.readthedocs.io/en/latest/netscript/netscriptjs.html#what-s-with-the-weird-comment)

   ```js
    /** @param {NS} ns **/
    export async function main(ns) {
        ns.tprint("Happy Coding!");
    }
   ```

5. [Always import](https://www.reddit.com/r/Bitburner/comments/stt9h8/import_with_subfolders/) with absolute paths without the leading `/` (no need for `.js` as well)

   ```js
   import { whatever } from "utils/tools";
   ```

Now, you are done! Here is an example [screenshot](https://i2.paste.pics/G710V.png) of how it should look like.
