$(document).ready(function () {
    // Initially hide the rating-container and sorting-container
    $('#rating-container').hide();

    $('.tabs h2').click(function () {
        const tabId = $(this).attr('id');

        if (tabId === 'internship-tab') {
            $('#internship-tab').removeClass('inactive-tab').addClass('active-tab');
            $('#reviews-tab').removeClass('active-tab').addClass('inactive-tab');

            // Hide the rating-container and show the internship-container and sorting-container with a fade-in effect
            $('#rating-container').hide();
            $('#internship-container, #sorting-container').hide().fadeIn().addClass('fade-in');
        } else if (tabId === 'reviews-tab') {
            $('#reviews-tab').removeClass('inactive-tab').addClass('active-tab');
            $('#internship-tab').removeClass('active-tab').addClass('inactive-tab');

            // Hide the internship-container and show the rating-container with a fade-in effect
            $('#internship-container, #sorting-container').hide();
            $('#rating-container').hide().fadeIn().addClass('fade-in');
        }
    });
});