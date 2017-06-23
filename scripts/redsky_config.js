/*
 * RedSky 'configuration' file
 * Contains everything and anything outside of core app behaviour 
 * that might get expanded or adjusted, or is thematic or locale-specific
 */


// Default city code, in case we can't get it from saved settings
const DEFAULT_CITY_CODE = "krk";

// Presentation format for day names
const DAY_NAME_FORMAT = "ddd";

// URL to access the weather API
// TO DO : Un-hardwire to use F
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/forecast?appid=b0bc19dcdaac760728f58d326d4d1162&units=imperial";

// Simple threshold values for determining judgments
const HOT_THRESHOLD = 75;
const COLD_THRESHOLD = 50;
const HUMID_THRESHOLD = 70;


/* Simple short list of cities, in place of having to manage the full set
 * Each item uses:
 * - IATA code to serve as a short, human-readable proxy identifier
 * - Preferred name (sometimes differs from names in API)
 * - ID used by API, to avoid ambiguity during lookup
 */
const CITIES = {
  "lon" : { name : "London", id : 2643743 }, 
  "nyc" : { name : "New York", id : 5128638 }, 
  "sfo" : { name : "San Francisco", id : 1689973 }, 
  "lax" : { name : "Los Angeles", id : 3882428 }, 
  "par" : { name : "Paris", id : 2988507 }, 
  "krk" : { name : "Krakow", id : 3094802 }, 
  "chi" : { name : "Chicago", id : 4887398 }, 
  "sea" : { name : "Seattle", id : 5809844 }, 
  "tyo" : { name : "Tokyo", id : 1850147 }, 
  "sha" : { name : "Shanghai", id : 1796236 }, 
  "del" : { name : "New Delhi", id : 1261481 }, 
  "bla" : { name : "Barcelona", id : 6356055 }, 
  "rom" : { name : "Rome", id : 3169070 }, 
  "was" : { name : "Washington", id : 4140963 }
};


/* Arbitary logic used to 'evaluate' weather data for a single day
 * Also used to emulate functionality not found in 'Free' pricing tier
 * Assumes that anything here is subject to later refinement/replacement
 * Derives the following:
 *   - Representative temp	
 *   - Highest temp + whenish
 *   - Lowest temp + whenish
 *   - Representative weather condition
 *   - Will there be rain? + whenish
 *   - Will there be snow? + whenish
 *   - Will there be high wind? + whenish
 *   - Will it be 'muggy'?
 *   - Will it be 'hot'?
 *   - Will it be 'cold'?
 *   - Will it be 'bitingly cold'?
 * TO DO : Find a more elegant method to do this, 
 * rather than using a great big function
 */
function processDay( dayName, forecastSlices ) {
  
  var day = {
    name : dayName, 
    recommends : { 
      rainy : false, 
      sunny : false, 
      muggy : false
    }
  };

  var numSlices = _.size(forecastSlices);
  
  // CAVEAT : Most of these face a simple issue of possibly having incomplete 
  // data for each day; as such, some of these values will be inaccurate
  
  // Derive representative temp	
  // Grab temperatures from slices, get a simple average, and round to integer
  var temps = _.map(forecastSlices, function( val ) { return Math.round(val.main.temp); });
  day.temp = Math.round(_.reduce(temps, function( memo, num ) { return memo + num; }) / numSlices);
  
  // Derive highest temp
  // TO DO : Find cheap method of also returning when this occurs
  day.high = Math.max.apply(null, temps);
  
  // Derive lowest temp
  // TO DO : Find cheap method of also returning when this occurs
  day.low = Math.min.apply(null, temps);
  
  // Derive representative weather condition, along presence of snow/rain
  // This one is a serious pain; use cascading decisions to arrive at 
  // 'most serious' weather code, despite arbitrary assignment
  // TO DO : Figure out how to handle more than one weather condition for slice
  // Assume: 'Thunderstorm' > 'Snow' | 'Rain' > 'Drizzle' > 'Clouds' > 'Clear'
  // TO DO : Handle extreme weather
  // Grab conditions from slices, then figure out which one 'wins'
  var conditions = _.map(forecastSlices, function( val ) { return val.weather[0].main; });
  
  if (conditions.indexOf('Thunderstorm') >= 0) {
    
    day.condition = 'thunderstorm';
    day.recommends.rainy = true;
  
  } else if (conditions.indexOf('Snow') >= 0) {
    
    day.condition = 'snow';
    day.recommends.cold = true;
  
  } else if (conditions.indexOf('Rain') >= 0) {
    
    day.condition = 'rainy';
    day.recommends.rainy = true;
    
  } else if (conditions.indexOf('Drizzle') >= 0) {
    
    day.condition = 'cloudy';
    day.recommends.rainy = true;
  
  } else if (conditions.indexOf('Clouds') >= 0) {
    
    day.condition = 'partlycloudy';
  
  } else {
    
    day.condition = 'sunny';
    if (conditions.indexOf('Clear') >= 0) {
      
      day.recommends.sunny = true;
    }
  }

  // Derive 'hot'
  // Use simple arbitrary threshold
  // TO DO : Account for heat index + cloud cover
  day.recommends.hot = (day.temp > HOT_THRESHOLD);
  
  // Derive 'cold'
  // Use simple arbitrary threshold
  // TO DO : Account for wind chill & humidity
  day.recommends.cold = (day.temp < COLD_THRESHOLD);

  // Derive 'muggy'
  // Calculate fake heat index evaluation using max temp vs max humidity
  // TO DO : Use correct formula for this, not just a simple value comparison
  var humidities = _.map(forecastSlices, function( val ) { return Math.round(val.main.humidity); });
  day.humidity = Math.max.apply(null, humidities);
  day.recommends.muggy = (day.recommends.hot && (day.humidity > HUMID_THRESHOLD));
  
  // TO DO : Derive 'high wind' + whenish
  // TO DO : Derive 'bitingly cold'
  
  return day;
}


/* Handlebars templates used to generate UI
 * These could be pulled from outside files, but keeping them in memory rn
 * Each needs to be precompiled by Handlebars at runtime to be used quickly
 */
const LAYOUT_TEMPLATE = 
`<header>
  <div class="layout"><div><h1>RedSky /<span id="cityname"></span></h1></div><div></div></div><div id="menu"><ul></ul></div>
</header>
<div id="redsky"></div>`;

const DAYS_TEMPLATE = 
`<div>
  <div class="{{city}}"></div>
  <ul id="days">{{#days}}
    <li class="{{condition}}">
    {{#recommends}}<div class="recommends">
        {{#sunny}}<div class="sunny"><span class="label">Bring sunglasses</span><div class="icon"></div></div>{{/sunny}}
        {{#rainy}}<div class="rainy"><span class="label">Bring an umbrella</span><div class="icon"></div></div>{{/rainy}}
        {{#muggy}}<div class="muggy"><span class="label">Wear something light</span><div class="icon"></div></div>{{/muggy}}
        {{#cold}}<div class="cold"><span class="label">Dress warmly</span><div class="icon"></div></div>{{/cold}}
      </div>{{/recommends}}
      <div class="stats">
        <div class="name">{{name}}</div>
        <div class="temp">{{temp}}<span>&deg;</span></div>
      </div>
      <div class="other">
        <div>High {{high}}&deg;</div>
        <div>Low {{low}}&deg;</div>
        {{#recommends}}
          {{#hot}}<div>It's going to be <b>hot</b></div>{{/hot}}
          {{#cold}}<div>It's going to be <b>cold</b></div>{{/cold}}
        {{/recommends}}
      </div>
      <div class="ctrl dismiss"></div>
    </li>{{/days}}
  </ul>
</div>`;

const MENU_TEMPLATE = 
`{{#each this}}<li city="{{@key}}"><div>{{name}}</div></li>{{/each}}`;
