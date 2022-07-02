import {bs4builder} from "./bs4.js";
import {bs5builder} from "./bs5.js";

export class Builder {
    constructor(settings) {
        this.settings = settings
        this.bs4 = new bs4builder(settings);
        this.bs5 = new bs5builder(settings);
    }

    buildAddANote() {
        switch (this.settings.bootstrapVersion) {
            case "4":
                return this.bs4.buildBS4AddButton();

            case "5":
                return this.bs5.buildBS5AddButton();
        }
    }

    buildNotesListing(notes){
        switch (this.settings.bootstrapVersion) {
            case "4":
                return this.bs4.buildBS4NotesListing(notes);

            case "5":
                return this.bs5.buildBS5NotesListing(notes);
        }

    }
    /** Common - not depending on version **/

    buildExistingNote(findValue){
        const settings = this.settings
        return $("<div/>")
            .attr({
                class: 'alert alert-warning my-2 existingNoteContainer',
                id: 'noteFor' + findValue.id
            })
            .append(
                function () {
                    if (settings.useIcons === true) {
                        return settings.iconExistingNote
                    } else {
                        return "Recorded note: "
                    }
                }
            )
            .append(
                $("<b/>")
                    .html(findValue.note)
            )
    }
    buildInputGroup(currentInputElement) {
        const divInputGroup = $("<div/>")
            .attr({
                class: 'input-group'
            }).append(currentInputElement)

        $(currentInputElement).on("blur", function () {
            const currentInputValue = $(this).val()
            $.notesBS4.checkIfIdExist({id: currentInputValue, ele: $(this)});
        })

        return divInputGroup.append(this.buildAddANote());

    }

    /** Common - not depending on version **/
}