var CompApiUrl = null;

function constructStarRating(rating) {
    const maxRating = 5; // change this variable according to your need
    let starRating = '';
    for (let i = 1; i <= maxRating; i++) {
        if (i <= rating) {
            starRating += '<span class="fas"></span>'; // filled star
        } else {
            starRating += '<span class="far"></span>'; // empty star
        }
    }
    return starRating;
}

function processRating(newElement, review) {
    $.ajax({
        type: 'GET',
        url: `http://webp.local/api/user/${review.id_user}`,
        headers: {
            "authorization-token": userData ? userData.token : ''
        },
        success: function (response) {
            let user = response.data;
            $(".company-rating-title", newElement).html(user.first_name + ' ' + user.last_name);
        }
    });
    $(".search-result-description", newElement).html(review.review_text);
    let starRating = constructStarRating(review.review_score);
    $(".company-rating-stars", newElement).html(starRating);
}

function loadReviews(url, containerId, specificHandler, templateFilePath) {
    // Add a _nonce to prevent caching problems
    var fullURL = url + '?_nonce=' + new Date().getTime();
    $.ajax({
        url: fullURL,
        type: 'GET',
        headers: {
            "authorization-token": userData ? userData.token : ''
        },
        async: true,  // make sure the request is asynchronous
        success: function (response) {
            // Get HTML Template
            $.get(templateFilePath, function (data) {

                // Check if response is an array
                // If not, put it into an array, because $.each expects an array or object
                if (!Array.isArray(response)) {
                    response = [response];
                }

                // Iterate through each entity
                $.each(response, function (i, entity) {
                    let newElement = $(data); // parse the data as jQuery element
                    console.log('About to call specificHandler function');
                    specificHandler(newElement, entity); // Call the specific handler for additional handling

                    // Insert new element into page
                    $(containerId).append(newElement);
                });
                console.log(response);
            });
        },
        error: function (error) {
            console.error('Error in AJAX request:', error);
            // handle error: show message to user or something
        },
        complete: function (xhr, textStatus) {
            console.log('AJAX request completed with status: ' + textStatus);
        }
    });
}

$(document).ready(function () {
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    const compId = urlParts.pop() || urlParts.pop();

    CompApiUrl = `http://webp.local/api/rating/${compId}`;
    loadReviews(CompApiUrl, "#rating-container", processRating, "/components/rating.html");
});