let placeholder ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a mauris porta ante interdum laoreet. Maecenas a erat eget leo luctus suscipit iaculis eget justo. Fusce non sapien fermentum, sagittis risus non, tempor magna. Fusce massa arcu, sagittis aliquet varius vitae, vestibulum sit amet eros. Proin id metus id massa sodales pretium. Nam ac lorem nibh. Donec cursus volutpat dolor. Phasellus placerat imperdiet orci, nec tincidunt purus feugiat eget. ";

$(document).ready(function () {
        $.get("components/internship-offer.html", function (data) {
                for (let i = 1; i <= 50; i++) {
                    let newElement = document.createElement("div");

                    newElement.innerHTML = data;

                    $(".search-result-title", newElement).html("Test " + i);

                    $(".search-result-description", newElement).html(placeholder + i);

                    $("div.search-results").append(newElement.children);
                }
            }
        )
    }
)
