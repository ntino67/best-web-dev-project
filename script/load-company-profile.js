$(document).ready(function () {
    $.ajax({
        url: "http://webp.local/api/company/1",
        type: "GET",
        success: function (response) {
            console.log(response);

            $('title').text(response.company_name);
            $('#company-name').text(response.company_name);
            $('#company-sector').text(response.business_sector_name);
            $('.profile-description').text(response.company_description);
        },
        error: function (jqXHR, exception) {
            console.log('Error occurred:', jqXHR, exception);
        }
    });
});
