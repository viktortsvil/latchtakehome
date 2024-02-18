## How To Run:

`npm install --legacy-peer-deps`

`npm start`

## Feature Description 

The project meets most requirements as defined on the Notion page. 

* The input JSON is parsed recursively (see `parseInput()` in `utils.js`). All types of content are parsed as expected (e.g. different headers, text, etc).

* `mention` elements are parsed in a way that ensures that only one copy of each unique mention is rendered. Having "single source of truth" for the `mention` objects enables us to have one place from which we can change the value (or color) in the whole document.

* Bold/Italic/Underlined text formatting is supported recursively. Thus, it can be added to any element, and respective formatting will be added to every child element. Note: for some reason, I did not manage to render italic text properly, but the bold/underlined works as expected. I believe there is some typo that I am not able to catch at the moment.

* Clause elements behave like ordered list elements while also supporting nested non-list elements. The Optional Bonus Task has also been completed to an extent - clauses that are siblings continue their numbering as expected. It can be seen that this is not always the case in the `input.json` file.

* The code is fairly readable. It contains comments in parts that might be less clear. The code is split into functions and is straightforward to build on, although it could benefit from some further refactoring.

## Some other notes:

* I've not worked with material-ui much in the past, so I used a mix of pure React and material-ui to make development easier. A looser time constraint would enable me to be more consistent with the tools I use.

* I didn't adhere perfectly to the styling as shown in the example. Instead, I focused on the functionality and extendability of the code.