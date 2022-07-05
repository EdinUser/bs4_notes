export class bs4builder {
    constructor(settings) {
        this.settings = settings
    }

    /**
     * Bootstrap 4 input group
     * @returns {*|jQuery}
     */
    buildBS4AddButton() {
        const settings = this.settings;
        const divModalButton = $("<button/>")
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
                $(settings.modalId).modal('show', $(this))
            })

        return $("<div/>")
            .attr({
                class: 'input-group-append'
            })
            .append(divModalButton);
    }

}