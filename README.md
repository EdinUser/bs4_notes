# Bootstrap 4 localstorage notes

This script allows you to add notes to any "input" field on your page

## Requirements

Bootstrap 4; JQuery

## Install

Download ```js/notes_BS4.js``` and include it in your HTML file. Start it:
```html
<script src="js/notes_BS4.js"></script>
<script>
    $(function () {
        // Options for the extension
        const notesBSOptions = {
            // the base key name under which to save the notes
            key: 'test',
            // the class for which to look to init the notes. At this point ths MUST by input
            convertClass: 'haveNote',
            // Optional - use Google Material Symbols to display icons
            useIcons: true
        }

        // init it
        $.notesBS4(notesBSOptions);
    })
</script>
```
The supported settings are:
```javascript
    const defaults = {
        // These are the defaults.

        //Default key name. This can later be put to URL
        key: "BS4_notes",
        //Name of the class of the inputs
        convertClass: "haveNote",
        // Use an icon font
        useIcons: true,
        // Default Google Icon for Add a Note
        iconAddNote: '<span class="material-symbols-outlined fs">note_add</span>',
        // Default Google Icon for Existing Note
        iconExistingNote: '<span class="material-symbols-outlined fs">note</span>',
        // Default Google Icon for Remove an icon
        iconRemoveNote: '<span class="material-symbols-outlined fs">delete</span>',
        // Container for recorded notes
        recordedNotesContainer: "#notesContainer"
    };
```
Include Bootstrap and Jquery components
```html
<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-fQybjgWLrvvRgtW6bFlB7jaZrFsaBXjsOMm/tB9LTS58ONXgqbR9W8oWht/amnpF" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
```
The extension is built with support for Google Material Icons:
```html
<!-- This is Google Material Icons, used for icons -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"/>
```
Some styling for Google Icons and the notes container:
```html
<style>
/* Some settings for Google Material Icons */
    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 17
    }

    .fs {
        font-size: 17px;
        max-width: 17px;
        max-height: 17px;
    }
/* Some settings for Google Material Icons */

/* This is the container for recorded notes. Change it accordingly */
    #notesContainer {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 150px;
    }
/* This is the container for recorded notes. Change it accordingly */
</style>
```
HTML example code. Notice, the extension works with both ```input-group``` and without it.
```html
<label for="search_test">Just a small test with existing input group</label>
<div class="input-group">
    <input type="text" class="form-control haveNote" name="ean_code" id="search_test"/>
    <div class="input-group-append">
        <div class="input-group-button">
            <button type="button" class="btn btn-success" id="addNote" data-toggle="modal" data-target="#addNoteModal">
                <span class="material-symbols-outlined fs">
                    search
                </span>
            </button>
        </div>
    </div>
</div>
<label for="other_code">Add some more dynamic shit</label>
<input type="text" class="form-control haveNote" name="other_code" id="other_code" data-note-title="Dynamic note"/>
```
When BS4 Notes starts, it adds a button, which shows a modal on click event. Inside of the modal you can fill the "id" of the note and its content. This "id" is used later to track down if you entered it in the same input, the extension displays the note in a dedicated div below it with the note.