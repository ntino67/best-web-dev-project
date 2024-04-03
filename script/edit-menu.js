$(document).ready(function () {
    function checkWidth() {
        var windowSize = $(window).width();

        if (windowSize < 901) {
            // When the window is less than 900 pixels wide, hide the sidebar
            $("#sidebar").css({
                'width': 'max(160px, 10vw)',
                'marginLeft': -$("#sidebar").outerWidth(),
                'display': 'none'
            });
        } else {
            // When the width is greater than or equal to 900 pixels, show the sidebar
            $("#sidebar").css({
                'width': 'max(160px, 10vw)',
                'marginLeft': 0,
                'display': 'block'
            });
        }
    }

    // Execute when document loads
    checkWidth();

    // Bind event handler to window resize event
    $(window).resize(checkWidth);

    $("#openNav").click(function () {
        if ($("#sidebar").css('display') === 'block') {
            // If it's visible, animate and move it to the left, out of sight
            $("#sidebar").animate({'marginLeft': -$("#sidebar").outerWidth()}, {
                // Once animation is finished, set display to none
                done: function () {
                    $("#sidebar").css('display', 'none');
                }
            });
        } else {
            // If it's not visible, set display to block
            $("#sidebar").css('display', 'block');
            // Need to reset margin-left due to display block
            $("#sidebar").css('marginLeft', -$("#sidebar").outerWidth());
            // Animate and move it into sight
            $("#sidebar").animate({'marginLeft': 0});
        }
    });
});