function loadInternships(url, containerId, specificHandler) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            // Get Internship Offer HTML Template
            $.get("/components/internship-offer.html", function (data) {
                // Iterate through each offer
                $.each(response.data, function (i, offer) {
                    let newElement = $('<div></div>');
                    newElement.html(data);
                    // Insert title and description
                    $(".search-result-title", newElement).html(offer.internship_offer_title);
                    $(".search-result-description", newElement).html(offer.internship_offer_description);

                    specificHandler(newElement, offer); // Call the specific handler for additional handling

                    // Insert new element into page
                    $(containerId).append(newElement.children());

                    // call truncateToFit after inserting the newElement into the DOM
                    let vh_in_px = $(window).height() * 0.11;
                    truncateToFit(".search-result-description", vh_in_px);
                });

                // Truncate again on window resize
                $(window).on('resize', function () {
                    let vh_in_px = $(window).height() * 0.11;
                    truncateToFit(".search-result-description", vh_in_px);
                });
            });
        },
        error: function (jqXHR, exception) { // Handling any errors from request
            console.log('Error occurred:', jqXHR, exception);
        }
    });
}

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