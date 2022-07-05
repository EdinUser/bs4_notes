import {Builder} from "./builder.js";

(function ($) {

    // These are the defaults.
    const defaults = {
        //Default key name. This can later be put to URL
        key: "BS4_notes",
        //Expire time in hours
        expireAfter: 168,
        //Name of the class of the inputs
        convertClass: "haveNote",
        // Use an icon font
        useIcons: true,
        //Modal ID to handle the adding of notes
        modalId: "#addNoteModal",
        // Default Google Icon for Add a Note
        iconAddNote: '<span class="material-symbols-outlined fs">note_add</span>',
        // Default Google Icon for Existing Note
        iconExistingNote: '<span class="material-symbols-outlined fs">note</span>',
        // Default Google Icon for Remove an icon
        iconRemoveNote: '<span class="material-symbols-outlined fs">delete</span>',
        // Container for recorded notes
        recordedNotesContainer: "#notesContainer",
        // Bootstrap version
        bootstrapVersion: '4',
        // just for fun. This works for a single note, if you have multiple inputs with notes, remove this
        stickyNoteId: "",
        // You have to enter here a style for the Pushpin icon
        stickyNotePushPinIcon: '<span class="material-symbols-rounded fs">push_pin</span>',
    };

    let settings = {};
    // this can be replaced by an URL parser
    let existingNotes = {}
    let builder;

    $.notesBS = (options) => {
        // settings = $.extend({}, defaults, options);
        settings = Object.assign({}, defaults, options);
        builder = new Builder(settings);

        if (settings.stickyNoteId) {
            builder.buildStickyNoteContainer(settings.stickyNoteId)
        }

        existingNotes = $.notesBS.readNotes(settings.key);

        $.notesBS.buildNotes()
        $.notesBS.doNotesInit()

        $(settings.modalId).on("shown.bs.modal", function (e) {
            const noteForm = $(this).find("form");
            const submitButton = $(this).find("button[type=submit]");

            noteForm.trigger('reset');

            const triggered = e.relatedTarget;
            const noteTitle = $(triggered).parents(".input-group").find("." + settings.convertClass);
            $("#noteTitle").val(noteTitle.val());
            $("#noteName").val(noteTitle.data("note-title") ?? noteTitle.attr("name"));
            $("#noteContent").focus();
            submitButton.on("click", function (e) {
                $.notesBS.submitNewNote(e, noteForm);
            })

        });
    }

    $.notesBS.submitNewNote = (e, submittedForm) => {
        if (submittedForm[0].checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
            submittedForm.addClass('was-validated');
        } else {
            const dataForSave = {};
            const noteTitle = $("#noteTitle");
            const noteContent = $("#noteContent");

            dataForSave.id = noteTitle.val()
            dataForSave.note = noteContent.val()
            dataForSave.name = $("#noteName").val()
            dataForSave.key = settings.key

            $.notesBS.saveNotes(dataForSave)
            $(settings.modalId).modal('hide');
            $.notesBS.buildNotes()
        }
    }

    $.notesBS.doNotesInit = () => {
        const notesInputs = $("." + settings.convertClass);
        $.each(notesInputs, function (ind, ele) {
            if ($(ele).parent('.input-group').length > 0) {
                $(ele).parents(".input-group").append(builder.buildAddANote());
                $(ele).on("blur", function () {
                    const currentInputValue = $(this).val()
                    $.notesBS.checkIfIdExist({id: currentInputValue, ele: $(this)});
                })
            } else {
                const currentInputElement = $(ele).clone();

                $(ele).replaceWith(builder.buildInputGroup(currentInputElement));
            }
        })
    }

    $.notesBS.buildNotes = () => {
        const notesContainer = $(settings.recordedNotesContainer);

        if (Object.keys(existingNotes).length > 0) {
            notesContainer.removeClass("d-none");
            builder.buildNotesListing(existingNotes)
        } else {
            notesContainer.addClass("d-none");
        }
    }

    $.notesBS.checkIfIdExist = (data) => {
        const placeName = data.ele.data("note-title") ?? data.ele.attr('name');

        $.notesBS.removeDisplayedNote(data);

        if (typeof existingNotes[placeName] !== 'undefined') {
            const findValue = existingNotes[placeName].find((o) => {
                return o['id'] === data.id
            });

            if (typeof findValue !== 'undefined') {
                if (settings.stickyNoteId !== "") {
                    const stickyNote = $("#" + settings.stickyNoteId);
                    if (stickyNote.length > 0) {
                        if (stickyNote.hasClass("d-none")) {
                            stickyNote.removeClass("d-none")
                        }
                        $("#currentNoteContent").html(builder.buildExistingNote(findValue));
                    }
                } else {
                    data.ele.parent(".input-group").after(builder.buildExistingNote(findValue))
                }
            }
        }
    }

    $.notesBS.removeDisplayedNote = (data) => {
        if (settings.stickyNoteId !== "") {
            const stickyNote = $("#" + settings.stickyNoteId);
            if (stickyNote.length > 0) {
                const existingNote = stickyNote.find(".existingNoteContainer")
                if (!stickyNote.hasClass("d-none")) {
                    stickyNote.addClass("d-none")
                }
            }
        } else {
            const elementParentContainer = data.ele.parent(".input-group");

            const existingNoteContainer = elementParentContainer.next('.existingNoteContainer');
            if (existingNoteContainer.length > 0) {
                existingNoteContainer.remove();
            }
        }
    }

    $.notesBS.readNotes = (key) => {
        existingNotes = JSON.parse(localStorage.getItem(key)) ?? {};
        const now = new Date().getTime();

        for (const existingKeys in existingNotes) {
            for (const existingNames in existingNotes[existingKeys]) {
                const currentRecord = existingNotes[existingKeys][existingNames]
                if (now > currentRecord.ttl) {
                    $.notesBS.removeNotes({name: existingKeys, id: currentRecord.id});
                }
            }
        }
        return existingNotes;
    }

    $.notesBS.saveNotes = (data) => {
        let storageData = {}
        const expireTime = new Date().getTime() + (settings.expireAfter * 60 * 60 * 1000);

        if (localStorage.getItem(data.key)) {
            storageData = JSON.parse(localStorage.getItem(data.key));
            if (typeof storageData[data.name] === 'undefined') {
                storageData[data.name] = [];
            }
        } else {
            storageData[data.name] = [];
        }

        const findValue = storageData[data.name].find((o) => {
            return o['id'] === data.id
        });
        if (typeof findValue === "undefined") {
            storageData[data.name.trim()].push({id: data.id.trim(), note: data.note.trim(), ttl: expireTime});
            localStorage.setItem(data.key, JSON.stringify(storageData))
        }
        $.notesBS.readNotes(settings.key);
    }

    $.notesBS.removeNotes = (data) => {
        let storageData = {}
        if (localStorage.getItem(settings.key)) {
            storageData = JSON.parse(localStorage.getItem(settings.key));
            if (typeof storageData[data.name] !== 'undefined') {
                const findValue = storageData[data.name].find((o) => {
                    return o['id'].trim() === data.id.trim()
                });

                for (const currentValue in storageData[data.name]) {
                    if (storageData[data.name][currentValue] === findValue) {
                        storageData[data.name].splice(parseInt(currentValue), 1);
                    }
                }
                if (storageData[data.name].length < 1) {
                    delete storageData[data.name];
                }
            }
            localStorage.setItem(settings.key, JSON.stringify(storageData));
        }
        $.notesBS.readNotes(settings.key);
        $.notesBS.buildNotes();
    }

    $.notesBS.clearNotes = () => {
        localStorage.removeItem(settings.key);
        $(".existingNoteContainer").remove();
        existingNotes = {};
        $.notesBS.buildNotes()
    }
}(jQuery));