$(document).ready(function () {

    // Get internship offers using AJAX GET request
    loadInternships('http://webp.local/api/internship', '#internship-container', function (newElement, offer) {
        // Insert bottom info
        let slots = offer.available_slots;
        $(".search-result-bottom-info-element", newElement).html(slots + (slots === 1 ? " Slot" : " Slots"));

        // Insert right info
        $(".info-text", newElement).eq(0).html("Base Salary: " + offer.base_salary + "$");
        $(".info-text", newElement).eq(1).html(offer.company_name);
    });
});
