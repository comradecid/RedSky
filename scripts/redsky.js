/*
 * RedSky core app file
 * Mostly contains core app logic; more fiddly/malleable stuff is in 
 * redsky_config.js
 */


$(function() {
  
  // Spit out header, etc.
  $('body').append(Handlebars.compile(LAYOUT_TEMPLATE)());
  $('#menu > ul').html(Handlebars.compile(MENU_TEMPLATE)(CITIES)).find('li').click(closeLoadCity);
  $('#cityname').click(toggleMenu);
  
  // TO DO : Allow this to be overriden by saved settings
  var curCity = DEFAULT_CITY_CODE;
  loadCity(curCity);
});


/* ---- */


// TO DO : Finish stripping out instance-specific values and logic, 
// so that this can remain as generic as possible

// Load city and its data in the UI
function loadCity( cityCode ) {

  // Assuming everything is good, load city
  if (cityCode && CITIES[cityCode]) {
  
    var cityID = CITIES[cityCode].id;
    
    // Clear existing contents of day spread
    $('#redsky').empty();
    
    // Load data from API call
    $.getJSON(WEATHER_URL, { id : cityID })
    .done(function( data ) {
      
      // Get a semantically-evaluated version of the data from the weather API call
      data.city = cityCode;
      data = evalData(data);
  
      // Render the 5-day spread:
      // 1) Compile the template using the evaluated data
      // 2) Jam it into the shell container
      // 3) Attach event handlers to each day to allow the user to view details
      $('#redsky').html(Handlebars.compile(DAYS_TEMPLATE)(data)).find('#days li').click(viewDetails);
      $('#redsky').find('#days li .ctrl.dismiss').click(closeDetails);
      
      // Render menu of cities
      $('#cityname').html(CITIES[cityCode].name);
    })
    .fail(function( jqxhr, textStatus, error ) {
      console.error( "Request failed: ", textStatus, error );
    });
  }
}


// Semantically evaluate weather data:
// - Isolate each day, attaching name of each
// - Use heuristics (from configuration) to derive judgments
// TO DO : Add week-wide evaluation, to avoid myopic day-by-day evaluation
function evalData( data ) {

  // Set up new data set to be handed off for display
  var newData = {
    city : data.city, 
    days : []
  };

  // Split existing forecast slices into groups by day of week, 
  // in the process also grabbing day name for each
  var days = _.groupBy(data.list, function( val ) { var d = moment(val.dt_txt); return d.format(DAY_NAME_FORMAT); });
  
  // To preserve day order, manually traverse set and evaluate each member
  // then insert the result into the revised data set to pass back
  for (var i in days) {
    
    newData.days.push(processDay(i, days[i]));
  }
  
  return newData;
}


/* ---- */


// Toggle the main menu for selecting city
function toggleMenu() {

  if ($('header').hasClass('expanded')) {
  
    $('#menu').fadeOut(function() { $('header').removeClass('expanded'); });
  
  } else {
    
    $('header').addClass('expanded');
    $('#menu').delay(650).fadeIn();
  } 
}



// Toggle the main menu for selecting city
function closeLoadCity() {
  
  event.stopPropagation();
  loadCity($(this).attr('city'));
  toggleMenu();
}


// Open presentation of details information
// TO DO : Make this a bit more graceful and concise
function viewDetails() {
  
  event.stopPropagation();
  if (!$(this).hasClass('expanded')) {
    
    $(this).parent().addClass('details');
    $(this).addClass('expanded');
    $(this).find('.label').delay(650).fadeIn();
    $(this).find('.other').delay(800).fadeIn();
    $(this).find('.ctrl.dismiss').delay(1000).fadeIn();
  }
}


// Close presentation of details information
// TO DO : Make this a bit more graceful and concise
function closeDetails() {
  
  event.stopPropagation();
  console.log('close');
  $(this).parent().find('.label').fadeOut('fast');
  $(this).parent().find('.other').fadeOut('fast');
  $(this).parent().find('.ctrl.dismiss').fadeOut('fast', function() {
    $(this).parent().parent().removeClass('details');
    $(this).parent().removeClass('expanded');
  });
}
