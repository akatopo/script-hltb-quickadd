# How Long to Beat Script for Obsidian's Quickadd plugin

## Demo

https://github.com/user-attachments/assets/0aaf8254-dbdd-49d9-bcfe-191d6f9f7c2b

## Description

This script allows you to easily insert how long to beat properties and a completion time table into an Obsidian note using the [Quickadd plugin](https://github.com/chhoumann/quickadd) by @chhoumann. **Now also works on Mobile (make sure you use latest QuickAdd) !**

Uses the [unofficial HLTB API](https://github.com/akatopo/howlongtobeat).

> [!WARNING] Disclaimer
> **Please never run a script that you don't understand. I cannot and will not be liable for any damage caused by the use of this script. Regularly make a backup of your Obsidian's vault!**

## Installation

1. Make sure you use latest QuickAdd version (at least 0.5.1) !
2. Save the script from the [latest release](https://github.com/akatopo/script-hltb-quickadd/releases/) to your vault somewhere. Make sure it is saved as a JavaScript file, meaning that it has the `.js` at the end.
3. Create a new template in your designated templates folder. Example template is provided below.
4. Open the Macro Manager by opening the QuickAdd plugin settings and clicking `Manage Macros`.
5. Create a new Macro - you decide what to name it.
6. Add the user script to the command list.
7. Go back out to your QuickAdd main menu and add a new Capture choice. Again, you decide the name. This is what activates the macro.
8. Click on the cog ⚙ icon next to the new Capture choice and set your options. Recommended options listed below:
   - Toggle "Capture to active file" on.
   - Toggle "Write to bottom of file" on to append the completion time table at the end of the note.
   - Toggle "Capture format" on and add `{{MACRO:hltb-macro}}` to the text box below. Replace `hltb-macro` with whatever you named your macro on step 5.

## Usage

The script will automatically use the `title` property from a note (if present) to search HLTB, otherwise it will ask for a search string before displaying the search results. If successful, [HLTB properties](#property-definitions) will be added to the note's frontmatter and a [table](#example-markdown-table-output) will be added at the bottom of the note.

## Property definitions

| Name                    | Description                                                          |
| ----------------------- | -------------------------------------------------------------------- |
| `gameplayMain`          | The number of hours needed for main story completion.                |
| `gameplayMainExtra`     | The number of hours needed for main story and side story completion. |
| `gameplayCompletionist` | The number of hours needed for full completion.                      |
| `hltbId`                | The HLTB id of the game as a string.                                 |
| `hltbUrl`               | The HLTB URL of the game.                                            |
| `hltbPoster`            | The HLTB game poster URL.                                            |

## Example markdown table output

```markdown
## How long to beat

| Playstyle | Average time |
| --- | --- |
| Main Story | 36 hours |
| Main + Sides | 49½ hours |
| Completionist | 80½ hours |
```
