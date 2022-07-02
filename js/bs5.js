export class bs5builder {
    constructor(settings) {
        this.settings = settings
    }

    /**
     * Build Notes Container
     * @param existingNotes
     */
    buildBS5NotesListing(existingNotes) {
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
                .addClass("btn btn-light")
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
                notesNameListing.append(noteLine);
            }

            notesListing.append(notesNameListing)
        }
        notesContainer.append(notesListing);

        $("<div/>")
            .addClass("d-grid gap-2")
            .append(
                $("<a/>")
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
                        $.notesBS4.clearNotes(settings.key)
                    })
            )
            .appendTo(notesContainer)
    }

    buildBS5AddButton() {
        const settings = this.settings;

        return $("<button/>")
            .attr({
                class: 'btn btn-warning'
            })
            .html(
                function () {
                    if (settings.useIcons === true) {
                        return settings.iconAddNote
                    } else {
                        return "Add a note"
                    }
                }
            )
            .trigger('modal')
            .on("click", function (e) {
                e.preventDefault();
                $("#addNoteModal").modal('show', $(this))
            })
    }
}