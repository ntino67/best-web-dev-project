$(document).ready(function () {
    $(".sorting-container").load("/components/sorting.html", function () {
        let sorting_categories = $(".sorting-category");

        function switch_sorting(event) {
            if ($("span.far", event.currentTarget).html() === "") {
                $("span.far", event.currentTarget).html("");
            } else {
                $("span.far", event.currentTarget).html("");
            }

            for (let i = 0; i < sorting_categories.length; i++) {
                if (sorting_categories[i] !== event.currentTarget) {
                    $("span.far", sorting_categories[i]).html("");
                }
            }
        }

        for (let i = 0; i < sorting_categories.length; i++) {
            $(sorting_categories[i]).click(switch_sorting);
        }
    });
});