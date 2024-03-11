let placeholder ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a mauris porta ante interdum laoreet. Maecenas a erat eget leo luctus suscipit iaculis eget justo. Fusce non sapien fermentum, sagittis risus non, tempor magna. Fusce massa arcu, sagittis aliquet varius vitae, vestibulum sit amet eros. Proin id metus id massa sodales pretium. Nam ac lorem nibh. Donec cursus volutpat dolor. Phasellus placerat imperdiet orci, nec tincidunt purus feugiat eget. ";

$(document).ready(function () {
  $.get("components/internship-offer.html", function (data) {
    for (let i = 1; i <= 10; i++) {
      let newElement = document.createElement("div");

      newElement.innerHTML = data;
      
      // Insert title
      $(".search-result-title", newElement).html("Test " + i);
      
      // Insert description
      $(".search-result-description", newElement).html(placeholder + i);
      
      // Insert bottom info
      let applications = i**2;

      if (applications == 1) {
        $(".search-result-bottom-info-element", newElement).html((i**2) + " Application");
      }
      else {
        $(".search-result-bottom-info-element", newElement).html((i**2) + " Applications");
      }
      
      // Insert right info
      $(".info-text", newElement).eq(0).html(i + " Rue du Quoi, Feur, France"); 

      $(".info-text", newElement).eq(1).html("Feur Internatinal LLC"); 


      // Insert new element into page
      $("div.search-results").append(newElement.children);
    }
  }
  )
}
)
