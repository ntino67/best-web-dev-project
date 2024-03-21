// This is a sample data. You might be fetching this data from server in your case
var cityData = ["New York", "London", "Paris"];
var sectorData = ["Software", "Hardware", "Networking"];

$(document).ready(function () {
    // Populate City Dropdown
    $.each(cityData, function (key, value) {
        $('#cities')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });

    // Populate Sector Dropdown
    $.each(sectorData, function (key, value) {
        $('#sectors')
            .append($("<option></option>")
                .attr("value", value)
                .text(value));
    });
});