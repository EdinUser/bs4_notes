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
        notesContainer
            .addClass("fixed-top")
            .css({
                "top": "5px",
                "right": "5px",
                "width": "200px"
            });

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
                                Builder.prototype.buildConfirmButtonsForRemove({
                                    removeAll: false,
                                    currentNoteId: currentNote[i].id.replace(/\W/, ""),
                                    currentNoteName: note,
                                    element: $(this)
                                })
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
                Builder.prototype.buildConfirmButtonsForRemove({removeAll: true, element: $(this)})
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

    buildConfirmButtonsForRemove(data) {
        const settings = this.settings;

        const confirmContainer = $("<div/>")
            .attr({
                id: "confirmContainer" + data.currentNoteId ?? ""
            })
            .addClass("p-1 btn-group btn-group-sm")

        let confirmButton;
        if (data.removeAll === false) {
            confirmButton = $("<a/>")
                .attr({
                    href: "#"
                })
                .addClass("btn btn-success")
                .html("Remove?")
                .on("click", function (e) {
                    e.preventDefault();
                    const dataForDelete = {};
                    dataForDelete.name = data.currentNoteName;
                    dataForDelete.id = data.currentNoteId;
                    $.notesBS.removeNotes(dataForDelete);
                })
        } else {
            confirmButton = $("<a/>")
                .attr({
                    href: "#"
                })
                .addClass("btn btn-success")
                .html("Remove all notes?")
                .on("click", function (e) {
                    e.preventDefault();
                    $.notesBS.clearNotes()
                })
        }

        const cancelButton = $("<a/>")
            .attr({
                href: "#"
            })
            .html("Cancel")
            .addClass("btn btn-sm btn-danger")
            .on("click", function (e) {
                e.preventDefault();
                $("#confirmContainer" + data.currentNoteId ?? "").remove()
            })

        confirmContainer.append(confirmButton, cancelButton);
        confirmContainer.insertAfter(data.element);
    }

    buildStickyNoteContainer(setId) {
        const settings = this.settings;

        const stickyNote = $("<div/>")
            .attr({
                id: setId
            })
            .css({
                "position": "fixed",
                "z-index": "999",
                "top": "50px",
                "right": "5px",
                "width": "230px",
                "rotate": "-5deg",
                "background": "#ff0000",
            })
            .addClass("d-none")
            .append(
                $("<div/>")
                    .addClass("d-flex justify-content-between")
                    .append(
                        $("<a/>")
                            .attr("href", "#")
                            .addClass("btn btn-sm btn-close")
                            .html("X")
                            .on("click", function (e) {
                                e.preventDefault();
                                $("#" + setId).addClass("d-none")
                            })
                    )
                    .append(
                        $("<div/>")
                            .attr("id", "currentNoteContent")
                            .addClass("p-2")
                    )
                    .append(
                        $("<div/>")
                            .append(
                                $(settings.stickyNotePushPinIcon).css({
                                    "font-size": "4em",
                                    rotate: "15deg",
                                    position: "fixed",
                                    top: "-35px",
                                    right: "25px"
                                })
                            )
                    )
            )

        $(document.body).append(stickyNote)
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