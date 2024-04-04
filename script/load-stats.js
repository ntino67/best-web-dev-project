function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Get the user data object from the cookie
var cookieData = getCookie('userData');

if (cookieData) {
  // Parse the string back into an object
  var userData = JSON.parse(cookieData);
}

function chart_companiesPerSector(data) {
  companiesPerSector = $("#chart_companiesPerSector");

  let businessSectorNames = [];

  for (let i = 0; i < data.length; i++) {
    businessSectorNames.push(data[i].business_sector_name);
  }

  let companiesInSector = [];

  for (let i = 0; i < data.length; i++) {
    companiesInSector.push(data[i].Companies);
  }

  console.log(businessSectorNames);
  console.log(companiesInSector);


  new Chart(companiesPerSector, {
    type: 'doughnut',
    data: {
      labels: businessSectorNames,
      datasets: [{
        label: 'Companies by sector of activity',
        data: companiesInSector,
      }
      ],
      hoverOffset: 4
    },
    options: {
      aspectRatio: 1 | 1,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          //align : 'start',
        },
      }
    }
  });
}

function chart_usersPerClass(data) {

  usersPerClass = $("#chart_usersPerClass");
  let classNames = [];
  for (let i = 0; i < data.length; i++) {
    classNames.push(data[i].class_year);
  }
  let usersInClass = [];
  for (let i = 0; i < data.length; i++) {
    usersInClass.push(data[i].Users);
  }
  console.log(classNames);
  console.log(usersInClass);
  new Chart(usersPerClass, {
    type: 'doughnut',
    data: {
      labels: classNames,
      datasets: [{
        label: 'Users by class',
        data: usersInClass,
      }
      ],
      hoverOffset: 4
    },
    options: {
      aspectRatio: 1 | 1,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          //align : 'start',
        },
      }
    }
  });
}

function displayStats(stats) {
  chart_companiesPerSector(stats.companiesPerSector);
  chart_usersPerClass(stats.usersPerClass);
}

$.ajax({
  url: 'http://webp.local/api/stat',
  type: 'GET',
  headers: {
    "authorization-token": userData.token
  },
  success: function(response) {
    displayStats(response);
  },
  error: function(jqXHR, exception) {
    console.log('Stat fetch error: ', jqXHR, exception);
  }
});

