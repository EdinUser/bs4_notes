(function ($) {

    const defaults = {
        // These are the defaults.

        //Default key name. This can later be put to URL
        key: "BS4_notes",
        //Name of the class of the inputs
        convertClass: "haveNote",
        // Use an icon font
        useIcons: true
    };

    let settings = {};
    // this can be replaced by an URL parser
    let existingNotes = {}

    $.notesBS4 = function (options) {
        settings = $.extend({}, defaults, options);

        $.notesBS4.buildNotes(settings.key)
        $.notesBS4.doNotesInit()

        $("#addNoteModal").on("shown.bs.modal", function (e) {
            const noteForm = $(this).find("form");
            noteForm.trigger('reset');

            const triggered = e.relatedTarget;
            const noteTitle = $(triggered).parents(".input-group").find("." + settings.convertClass);
            $("#noteTitle").val(noteTitle.val());
            $("#noteName").val(noteTitle.data("note-title") ?? noteTitle.attr("name"));
            $("#noteContent").focus();
        });

        $("#addNoteForm").on("submit", function (e) {
            e.preventDefault();
            const dataForSave = {};
            dataForSave.id = $("#noteTitle").val()
            dataForSave.note = $("#noteContent").val()
            dataForSave.name = $("#noteName").val()
            dataForSave.key = settings.key
            $.notesBS4.saveNotes(dataForSave)
            $("#addNoteModal").modal('hide');
            $.notesBS4.buildNotes(settings.key)
        });

        $("#cleanUpAllNotes").on("click", function (e) {
            e.preventDefault();
            $.notesBS4.clearNotes(settings.key)
        })
    }

    $.notesBS4.doNotesInit = function doNotesInit() {
        const notesInputs = $("." + settings.convertClass);
        $.each(notesInputs, function (ind, ele) {
            if ($(ele).parent('.input-group').length > 0) {
                $.notesBS4.insertIntoInputGroup($(ele))
                $(ele).on("blur", function () {
                    const currentInputValue = $(this).val()
                    $.notesBS4.checkIfIdExist({id: currentInputValue, ele: $(this)});
                })
            } else {
                $.notesBS4.buildInputGroup($(ele))
            }
        })
    }

    $.notesBS4.insertIntoInputGroup = function insertIntoInputGroup(inputElement) {
        inputElement.parents(".input-group").append($.notesBS4.buildElementAddon());
    }

    $.notesBS4.buildElementAddon = function buildElementAddon() {
        const divModalButton = $("<button/>")
            .attr({
                class: 'btn btn-warning'
            })
            .html(
                $("<span/>")
                    .attr({
                        class: 'material-symbols-outlined fs'
                    })
                    .html('note_add')
            )
            .trigger('modal')
            .on("click", function (e) {
                e.preventDefault();
                $("#addNoteModal").modal('show', $(this))
            })

        return $("<div/>")
            .attr({
                class: 'input-group-append'
            })
            .append(divModalButton);
    }

    $.notesBS4.buildInputGroup = function buildInputGroup(inputElement) {
        const currentInputElement = inputElement.clone();

        const divInputGroup = $("<div/>")
            .attr({
                class: 'input-group'
            }).append(currentInputElement)

        $(currentInputElement).on("blur", function () {
            const currentInputValue = $(this).val()
            $.notesBS4.checkIfIdExist({id: currentInputValue, ele: $(this)});
        })

        divInputGroup.append($.notesBS4.buildElementAddon());
        inputElement.replaceWith(divInputGroup);
    }

    $.notesBS4.buildNotes = function buildNotes(key) {
        existingNotes = $.notesBS4.readNotes(key);
        const notesContainer = $("#notesContainer");
        const notesListing = $("#notesListing");

        notesListing.empty();

        if (Object.keys(existingNotes).length > 0) {
            notesContainer.removeClass("d-none");
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
                    notesNameListing.append(noteLine);
                }

                notesListing.append(notesNameListing)
            }
        } else {
            notesContainer.addClass("d-none");
        }
    }

    $.notesBS4.checkIfIdExist = function checkIfIdExist(data) {
        const elementParentContainer = data.ele.parent(".input-group");

        const placeName = data.ele.data("note-title") ?? data.ele.attr('name');
        const existingNoteContainer = elementParentContainer.next('.existingNoteContainer');
        if (existingNoteContainer.length > 0) {
            existingNoteContainer.remove();
        }

        const findValue = existingNotes[placeName].find((o) => {
            return o['id'] === data.id
        });

        if (typeof findValue !== 'undefined') {
            const noteDisplayContainer = $("<div/>")
                .attr({
                    class: 'alert alert-warning my-2 existingNoteContainer',
                    id: 'noteFor' + findValue.id
                })
                .append(
                    $("<span/>")
                        .addClass("material-symbols-outlined fs mr-2")
                        .html("note")
                )
                .append(
                    $("<b/>")
                        .html(findValue.note)
                )
            data.ele.parent(".input-group").after(noteDisplayContainer)
        }
    }

    $.notesBS4.readNotes = function readNotes(key) {
        return JSON.parse(localStorage.getItem(key)) ?? {};
    }

    $.notesBS4.saveNotes = function saveNotes(data) {
        let storageData = {}
        if (localStorage.getItem(data.key)) {
            storageData = JSON.parse(localStorage.getItem(data.key));
            if (typeof storageData[data.name] === 'undefined') {
                storageData[data.name] = [];
            }
        } else {
            storageData[data.name] = [];
        }
        storageData[data.name].push({id: data.id, note: data.note});

        localStorage.removeItem(data.key);
        localStorage.setItem(data.key, JSON.stringify(storageData))
    }

    $.notesBS4.clearNotes = function clearNotes(key) {
        localStorage.removeItem(key);
        $(".existingNoteContainer").remove();
        $.notesBS4.buildNotes(key)
    }
}(jQuery));