function truncateToFit(selector, maxHeight) {
    $(selector).each(function () {
        let textElement = $(this);

        // Restore original text
        let originalText = textElement.data("original-text");
        if (!originalText) {    // store original text if it doesn't exist
            originalText = textElement.text();
            textElement.data("original-text", originalText);
        } else {
            // restore the original text before truncating
            textElement.text(originalText);
        }

        if (textElement.outerHeight() > maxHeight) {
            let text = originalText;
            while (textElement.outerHeight() > maxHeight) {
                text = text.substring(0, text.length - 4);
                textElement.text(text + "...");
            }
        }
    });
}

$(document).ready(function () {
    let placeholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a mauris porta ante interdum laoreet. Maecenas a erat eget leo luctus suscipit iaculis eget justo. Fusce non sapien fermentum, sagittis risus non, tempor magna. Fusce massa arcu, sagittis aliquet varius vitae, vestibulum sit amet eros. Proin id metus id massa sodales pretium. Nam ac lorem nibh. Donec cursus volutpat dolor. Phasellus placerat imperdiet orci, nec tincidunt purus feugiat eget. ";

    $.get("components/internship-offer.html", function (data) {
        for (let i = 1; i <= 5; i++) {
            let newElement = $('<div></div>');

            newElement.html(data);

            // Insert title
            $(".search-result-title", newElement).html("Test " + i);

            // Insert description
            $(".search-result-description", newElement).html(placeholder + i);

            // Insert bottom info
            let applications = i ** 2;

            if (applications === 1) {
                $(".search-result-bottom-info-element", newElement).html(applications + " Application");
            } else {
                $(".search-result-bottom-info-element", newElement).html(applications + " Applications");
            }

            // Insert right info
            $(".info-text", newElement).eq(0).html(i + " Rue du Quoi, Feur, France");
            $(".info-text", newElement).eq(1).html("Feur International LLC");

            // Insert new element into page
            $("#internship-container, #wishlist-container").append(newElement.children());

            // call truncateToFit after inserting the newElement into the DOM
            let vh_in_px = $(window).height() * 0.11;
            truncateToFit(".search-result-description", vh_in_px);
        }

        // Truncate again on window resize
        $(window).on('resize', function () {
            let vh_in_px = $(window).height() * 0.11;
            truncateToFit(".search-result-description", vh_in_px);
        });
    });
});