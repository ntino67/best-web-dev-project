$(document).ready(function () {

    // Load internship offers initially using AJAX GET request
    var url = 'http://webp.local/api/internship';
    loadInternships(url, '#internship-container', function (newElement, offer) {
        // Insert bottom info
        let slots = offer.available_slots;
        $(".search-result-bottom-info-element", newElement).html(slots + (slots === 1 ? " Slot" : " Slots"));

        // Insert right info
        $(".info-text", newElement).eq(0).html("Base Salary: " + offer.base_salary + "$");
        $(".info-text", newElement).eq(1).html(offer.company_name);
    });

    $('.search-bar-small').keypress(function (e) {
        console.log('Key Pressed:', e.which);
        // When enter key is pressed
        if (e.which == 13) {  // 13 is the enter key's keycode
            let input = $(this).val();

            if (input) {
                // Load internships with filter if there's input
                console.log(input)
                url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=internship_offer_title startswith ${input}`;
            } else {
                // Load all internships if input is empty
                url = 'http://webp.local/api/internship';
            }

            $('#internship-container').empty();

            loadInternships(url, '#internship-container', function (newElement, offer) {
                // specific handler code
            });

            // prevent the default action
            return false;
        }

        $('#cities').change(function () {
            let city = $(this).val();
            console.log(city);

            if (city) {
                url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=city_name eq ${city}`;
            } else {
                url = 'http://webp.local/api/internship';
            }

            $('#internship-container').empty();

            loadInternships(url, '#internship-container', function (newElement, offer) {
                // specific handler code
            });
        });

        $('#sectors').change(function () {
            let sector = $(this).val();
            console.log(sector);

            if (sector) {
                url = `http://webp.local/api/internship?orderby=id_internship_offer&filter=business_sector_name eq ${sector}`;
            } else {
                url = 'http://webp.local/api/internship';
            }

            $('#internship-container').empty();

            loadInternships(url, '#internship-container', function (newElement, offer) {
                // specific handler code
            });
        });
    });
});