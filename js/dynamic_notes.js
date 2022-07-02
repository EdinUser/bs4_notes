import {Builder} from "./builder.js";

(function ($) {

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
        recordedNotesContainer: "#notesContainer",
        // Bootstrap version
        bootstrapVersion: '4'
    };

    let settings = {};
    // this can be replaced by an URL parser
    let existingNotes = {}
    let builder;

    $.notesBS4 = function (options) {
        settings = $.extend({}, defaults, options);
        builder = new Builder(settings);

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
    }

    $.notesBS4.doNotesInit = function doNotesInit() {
        const notesInputs = $("." + settings.convertClass);
        $.each(notesInputs, function (ind, ele) {
            if ($(ele).parent('.input-group').length > 0) {
                $(ele).parents(".input-group").append(builder.buildAddANote());
                $(ele).on("blur", function () {
                    const currentInputValue = $(this).val()
                    $.notesBS4.checkIfIdExist({id: currentInputValue, ele: $(this)});
                })
            } else {
                const currentInputElement = $(ele).clone();

                $(ele).replaceWith(builder.buildInputGroup(currentInputElement));
            }
        })
    }

    $.notesBS4.buildNotes = function buildNotes(key) {
        existingNotes = $.notesBS4.readNotes(key);
        const notesContainer = $(settings.recordedNotesContainer);

        if (Object.keys(existingNotes).length > 0) {
            notesContainer.removeClass("d-none");
            builder.buildNotesListing(existingNotes)
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
            data.ele.parent(".input-group").after(builder.buildExistingNote(findValue))
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