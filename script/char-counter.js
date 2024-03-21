$(document).ready(function () {
    var textarea = $('#create-offer-description');
    var maxlength = textarea.attr('maxlength');
    var counter = $('#counter');

    textarea.on('input', function () {
        var remaining = maxlength - textarea.val().length;
        counter.html(remaining + ' characters remaining');

        // If counter is hidden (i.e., textarea was empty), show it
        if (counter.css('display') === 'none') {
            counter.css('display', 'block');
        }

        // If textarea is empty again, hide counter
        if (textarea.val().length === 0) {
            counter.css('display', 'none');
        }
    });
});