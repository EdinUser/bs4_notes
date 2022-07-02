export class bs5builder {
    constructor(settings) {
        this.settings = settings
    }

    /**
     * Bootstrap 5 input group
     * @returns {*|jQuery}
     */
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
                $(settings.modalId).modal('show', $(this))
            })
    }
}