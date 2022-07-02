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

    /** Common - not depending on version **/
    /**
     * Build Notes Container
     * @param existingNotes
     */
    buildNotesListing(existingNotes) {
        const settings = this.settings;
        const notesContainer = $(this.settings.recordedNotesContainer);
        notesContainer.empty();

        const notesListing = $("<div/>").attr("id", "notesListing");
        for (const note in existingNotes) {
            const currentNote = existingNotes[note];

            const parsedId = note.replace(/\W/, "");
            $("<a/>")
                .attr({
                    href: "#"
                })
                .addClass("btn btn-block btn-light")
                .html(note)
                .on("click", function (e) {
                    e.preventDefault();
                    $("#" + parsedId).collapse("toggle")
                })
                .appendTo(notesListing);

            const notesNameListing = $("<div/>")
                .attr({
                    id: parsedId
                })
                .addClass("collapse fade p-2")

            for (let i in currentNote) {
                const noteLine = $("<div/>")
                    .addClass("border-bottom mb-1 p-2")
                    .append(
                        $("<b/>")
                            .html(currentNote[i].id)
                    )
                    .append(
                        ($("<br />"))
                    )
                    .append(
                        currentNote[i].note
                    )
                    .append(
                        $("<a/>")
                            .attr({
                                href: "#"
                            })
                            .append(
                                function () {
                                    if (settings.useIcons === true) {
                                        return settings.iconRemoveNote
                                    } else {
                                        return "Delete the note"
                                    }
                                }
                            )
                            .on("click", function (e) {
                                e.preventDefault();
                                const dataForDelete = {};
                                dataForDelete.name = note;
                                dataForDelete.id = currentNote[i].id;
                                $.notesBS.removeNotes(dataForDelete);
                            })
                    )
                notesNameListing.append(noteLine);
            }

            notesListing.append(notesNameListing)
        }
        notesContainer.append(notesListing);

        const removeButton = $("<a/>")
            .attr({
                id: "cleanUpAllNotes",
                href: "#"
            })
            .addClass("btn btn-danger btn-sm btn-block")
            .append(
                function () {
                    if (settings.useIcons === true) {
                        return settings.iconRemoveNote
                    } else {
                        return "Delete all notes"
                    }
                }
            )
            .on("click", function (e) {
                e.preventDefault();
                $.notesBS.clearNotes(settings.key)
            })

        switch (this.settings.bootstrapVersion) {
            case "4":
                removeButton.appendTo(notesContainer)
                break;
            case "5":
                $("<div/>")
                    .addClass("d-grid gap-2")
                    .append(
                        removeButton
                    )
                    .appendTo(notesContainer)
                break;
        }

    }

    buildExistingNote(findValue) {
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
            $.notesBS.checkIfIdExist({id: currentInputValue, ele: $(this)});
        })

        return divInputGroup.append(this.buildAddANote());

    }

    /** Common - not depending on version **/
}