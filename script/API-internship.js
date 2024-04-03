// Define a function to extract cookie data
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Get the user data object from the cookie
var cookieData = getCookie('userData');

if (cookieData) {
    // Parse the string back into an object
    var userData = JSON.parse(cookieData);
    console.log(userData); // You can now access the data using dot notation
}
function loadInternships(url, containerId, specificHandler) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            "authorization-token": userData.token
        },
        success: function (response) {
            // Get Internship Offer HTML Template
            $.get("/components/internship-offer.html", function (data) {
                // Iterate through each offer
                $.each(response.data, function (i, offer) {
                    let newElement = $(data); // parse the data as jQuery element
                    // Insert title and description
                    $(".search-result-title", newElement).html(offer.internship_offer_title);
                    $(".search-result-description", newElement).html(offer.internship_offer_description);

                    // Add click event to the button
                    $(".bw-button", newElement).click(function () {
                        window.location.href = `internship/${offer.id_internship_offer}`;
                    });

                    specificHandler(newElement, offer); // Call the specific handler for additional handling

                    // Insert new element into page
                    $(containerId).append(newElement);

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