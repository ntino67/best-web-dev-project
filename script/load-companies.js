let placeholder = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a mauris porta ante interdum laoreet. Maecenas a erat eget leo luctus suscipit iaculis eget justo. Fusce non sapien fermentum, sagittis risus non, tempor magna. Fusce massa arcu, sagittis aliquet varius vitae, vestibulum sit amet eros. Proin id metus id massa sodales pretium. Nam ac lorem nibh. Donec cursus volutpat dolor. Phasellus placerat imperdiet orci, nec tincidunt purus feugiat eget. ";

$(document).ready(function () {
    $.get("components/company.html", function (data) {
            for (let i = 1; i <= 5; i++) {
                let newElement = document.createElement("div");

                newElement.innerHTML = data;

                // Insert title
                $(".search-result-title", newElement).html("Company " + i);

                // Insert description
                $(".search-result-description", newElement).html(placeholder + i);

                // Insert bottom info
                let internships = i * 10;

                if (internships == 1) {
                    $(".search-result-bottom-info-element", newElement).html(internships + " Internship offer");
                } else {
                    $(".search-result-bottom-info-element", newElement).html(internships + " Internship offers");
                }

                let students = i * 100;
                $(".search-result-bottom-info-far span", newElement).eq(1).html(students + " students working there");

                // Insert right info
                $(".info-text", newElement).eq(0).html(i + " Rue de la Société, Feur, France");

                $(".info-text", newElement).eq(1).html("Rating: " + i * 20 + "%");

                // Insert new element into page
                $("div.company-container").append(newElement.children);
            }
        }
    )
});