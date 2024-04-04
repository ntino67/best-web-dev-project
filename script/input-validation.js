function checkForm() {
    let dataCorrect = true;

    function validateInput(inputClass, regex, errorMessage) {
        $(inputClass).each(function () {
            if (!regex.test($(this).val() || "0")) {
                if (!$(this).next().hasClass("error-text")) {
                    $(this).after(`<p class='error-text'><span class='far'></span><span> ${errorMessage}</span></p>`);
                    $(this).addClass('input-error');
                    dataCorrect = false;
                }
            } else if ($(this).next().hasClass("error-text")) {
                $(this).next().remove();
                $(this).removeClass('input-error');
                dataCorrect = true;
            }
        });
    }

    validateInput(".input-email", /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/, "Please enter a valid email.");
    validateInput(".input-password", /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Please enter a valid password.");

    // submit form if all input are correct
    if (dataCorrect) {
        var email = $('#login-email').val();
        var password = $('#login-password').val();

        function setCookie(name, value, days) {
            var expires = "";
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        $.ajax({
            url: 'http://webp.local/api/auth',
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                setCookie('userData', JSON.stringify(data), 7); // Setting all the data in a cookie that expires in 7 days
                console.log("The user data has been stored in a cookie");

                window.location.href = "internships.html";
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error Message: ' + jqXHR.responseText);
                console.log('HTTP Error Status: ' + jqXHR.status);
                console.log('textStatus: ' + textStatus);
                console.log('errorThrown: ' + errorThrown);
                alert("User not found. Please try again.")
            },
            data: JSON.stringify({email: email, password: password})
        });
    }
}