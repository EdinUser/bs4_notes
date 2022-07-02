// this can be replaced by an URL parser
const key = 'test';
let existingNotes = {}
$(function () {
    buildNotes(key)
    doNotesInit()

    $("#addNoteModal").on("shown.bs.modal", function (e) {
        const noteForm = $(this).find("form");
        noteForm.trigger('reset');

        const triggered = e.relatedTarget;
        const noteTitle = $(triggered).parents(".input-group").find(".haveNote");
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
        dataForSave.key = key
        saveNotes(dataForSave)
        $("#addNoteModal").modal('hide');
        buildNotes(key)
    });

    $("#cleanUpAllNotes").on("click", function (e) {
        e.preventDefault();
        clearNotes(key)
    })
})

function doNotesInit() {
    const notesInputs = $(".haveNote");
    $.each(notesInputs, function (ind, ele) {
        if ($(ele).parent('.input-group').length > 0) {
            insertIntoInputGroup($(ele))
            $(ele).on("blur", function () {
                const currentInputValue = $(this).val()
                checkIfIdExist({id: currentInputValue, ele: $(this)});
            })
        } else {
            buildInputGroup($(ele))
        }
    })
}

function insertIntoInputGroup(inputElement) {
    inputElement.parents(".input-group").append(buildElementAddon());
}

function buildElementAddon() {
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

function buildInputGroup(inputElement) {
    const currentInputElement = inputElement.clone();

    const divInputGroup = $("<div/>")
        .attr({
            class: 'input-group'
        }).append(currentInputElement)

    $(currentInputElement).on("blur", function () {
        const currentInputValue = $(this).val()
        checkIfIdExist({id: currentInputValue, ele: $(this)});
    })

    divInputGroup.append(buildElementAddon());
    inputElement.replaceWith(divInputGroup);
}

function buildNotes(key) {
    existingNotes = readNotes(key);
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

function checkIfIdExist(data) {
    const elementParentContainer = data.ele.parent(".input-group");

    const existingNoteContainer = elementParentContainer.next('.existingNoteContainer');
    if (existingNoteContainer.length > 0) {
        existingNoteContainer.remove();
    }

    if ($.inArray(data.id, Object.keys(existingNotes)) >= 0) {
        const noteDisplayContainer = $("<div/>")
            .attr({
                class: 'alert alert-warning my-2 existingNoteContainer',
                id: 'noteFor' + data.id
            })
            .append(
                $("<span/>")
                    .addClass("material-symbols-outlined fs mr-2")
                    .html("note")
            )
            .append(
                $("<b/>")
                    .html(existingNotes[data.id])
            )
        data.ele.parent(".input-group").after(noteDisplayContainer)
    }
}

function filterIt(searchKey, arr) {
    return arr.filter(obj => Object.keys(obj).some(key => obj[key].includes(searchKey)));
}

function readNotes(key) {
    return JSON.parse(localStorage.getItem(key)) ?? {};
}

function saveNotes(data) {
    let storageData = {}
    if (localStorage.getItem(data.key)) {
        storageData = JSON.parse(localStorage.getItem(data.key));
        console.log(typeof storageData[data.name]);
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

function clearNotes(key) {
    localStorage.removeItem(key);
    $(".existingNoteContainer").remove();
    buildNotes(key)
}