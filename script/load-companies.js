function processCompany(newElement, company) {
    $(".search-result-title", newElement).html(company.company_name);
    $(".search-result-description", newElement).html(company.company_description);
    // Insert bottom info
    $(".search-result-bottom-info-element", newElement).eq(0).html("TODO" /*TODO: Number of internships given by the company*/);
    $(".search-result-bottom-info-element", newElement).eq(1).html("TODO" /*TODO: Number of student working in the company*/);

    // Insert right info
    $(".info-text", newElement).eq(0).html("TODO" /*TODO: Location*/);
    $(".info-text", newElement).eq(1).html("TODO" /*TODO: Rating*/);
}

$(document).ready(function () {
    var url = "http://webp.local/api/company";
    loadEntities(url, "#companies-container", processCompany, "/components/company.html"); // replace path with relevant one

    $(".search-bar-small").keypress(function (e) {
        if (e.which === 13) {  // 13 is the enter key's keycode
            let input = $(this).val();
            if (input) {
                url = `http://webp.local/api/company?orderby=id_company&filter=company_name startswith ${input}`;
            } else {
                url = 'http://webp.local/api/company';
            }

            $("#companies-container").empty();
            loadEntities(url, "#companies-container", processCompany, "/components/company.html");

            return false;  // Prevent the default action (form submission)
        }
    });

    $("#cities").change(function () {
        let city = $(this).val();
        if (city) {
            url = `http://webp.local/api/company?orderby=id_company&filter=city_name eq ${city}`;
        } else {
            url = 'http://webp.local/api/company';
        }
        $("#companies-container").empty();
        loadEntities(url, "#companies-container", processCompany, "/components/company.html");
    });

    $("#sectors").change(function () {
        let sector = $(this).val();
        if (sector) {
            url = `http://webp.local/api/company?orderby=id_company&filter=business_sector_name eq ${sector}`;
        } else {
            url = 'http://webp.local/api/company';
        }
        $("#companies-container").empty();
        loadEntities(url, "#companies-container", processCompany, "/components/company.html");
    });

});