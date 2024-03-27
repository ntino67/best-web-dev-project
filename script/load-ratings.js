let placeholder1 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a mauris porta ante interdum laoreet. Maecenas a erat eget leo luctus suscipit iaculis eget justo. Fusce non sapien fermentum, sagittis risus non, tempor magna. Fusce massa arcu, sagittis aliquet varius vitae, vestibulum sit amet eros. Proin id metus id massa sodales pretium. Nam ac lorem nibh. Donec cursus volutpat dolor. Phasellus placerat imperdiet orci, nec tincidunt purus feugiat eget. ";

$(document).ready(function () {
    $.get("components/rating.html", function (data) {
            for (let i = 1; i <= 5; i++) {
                let newElement = document.createElement("div");

                newElement.innerHTML = data;

                // Insert title
                $(".company-rating-title", newElement).html("Matteo Heidelberger " + i);

                // Insert description
                $(".search-result-description", newElement).html(placeholder1 + i);

                // Insert new element into page
                $("div.flex-6").append(newElement.children);
            }
        }
    )
});