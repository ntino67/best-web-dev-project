function checkForm() {
    function validateInput(inputClass, regex, errorMessage) {
        $(inputClass).each(function () {
            if (!regex.test($(this).val() || "0")) { // Fixed regex stupid bug
                if (!$(this).next().hasClass("error-text")) {
                    $(this).after(`<p class='error-text'><span class='far'></span><span> ${errorMessage}</span></p>`);
                    $(this).addClass('input-error');
                }
            } else if ($(this).next().hasClass("error-text")) {
                $(this).next().remove();
                $(this).removeClass('input-error');
            }
        });
    }

    validateInput(".input-email", /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, "Please enter a valid email.");
    validateInput(".input-name", /^[a-z ,.'-]+$/i, "Please enter a valid name.");
    validateInput(".input-password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Please enter a valid password.");
    validateInput(".input-select", /^(?!0$).*/, "Please make a selection.");
}

