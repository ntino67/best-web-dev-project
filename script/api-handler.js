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

function loadEntities(url, containerId, specificHandler, templateFilePath) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: {
            "authorization-token": userData ? userData.token : ''
        },
        success: function (response) {
            // Get HTML Template
            $.get(templateFilePath, function (data) {
                // Iterate through each entity
                $.each(response.data, function (i, entity) {
                    let newElement = $(data); // parse the data as jQuery element
                    specificHandler(newElement, entity); // Call the specific handler for additional handling

                    // Insert new element into page
                    $(containerId).append(newElement);
                });

                console.log("Create")

                // Create paging links dynamically based on total pages
                for (let i = 1; i <= response.paging.total_pages; i++) {
                    // Create anchor tag
                    let anchorTag = $('<a>').attr('href', '#').text(i);

                    // Add 'paging-current-page' class if it's the current page
                    if (i == response.paging.page) {
                        anchorTag.addClass('paging-current-page');
                    }

                    // Add click event listener
                    anchorTag.on("click", function (event) {
                        event.preventDefault();
                        let baseUrl = url.includes('?') ? url.split('?')[0] : url;

                        // Clear the entities' container
                        $(containerId).empty();

                        // Scroll to the top of the page
                        window.scrollTo(0, 0);

                        loadEntities(`${baseUrl}?page=${i}`, containerId, specificHandler, templateFilePath);
                    });

                    // Append to the paging container
                    $(".paging-container").append(anchorTag);
                }
                console.log("Finished.")
                // Truncate again on window resize
                $(window).on('resize', function () {
                    let vh_in_px = $(window).height() * 0.11;
                    truncateToFit(".search-result-description", vh_in_px);
                });
            });
        },
        error: function (jqXHR, exception) { // Handling any errors from request
            console.log('Error occurred:', jqXHR, exception);
            window.location.href = "/login.html";
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