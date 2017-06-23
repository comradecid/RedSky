_Red sky at night, sailors' delight._
_Red sky at morning, sailors take warning_
— [Old sailor's rhyme](http://en.wikipedia.org/wiki/Red_sky_at_morning)

----

There are innumerable weather apps, sites, and features in the world dishing out a view the coming week's weather. While they all cover the critical basics (temperature, notable weather on each day, etc.), most of what they dish out isn't terribly helpful. Knowing the barometric pressure, UV index, or radar profile isn't as valuable as answers to common, pithy questions such as these:

```
- Will I need an umbrella today?
- What clothes or gear should I pack for my trip?
- Will it be too muggy to go jogging tomorrow?
- How much sunlight will I have for my photoshoot?
```

In response, this project offers a stab at something a little more clever. It looks at weather data and makes judgements and recommendations based on what it sees. It doesn't bother giving details that don't matter, and instead just hands off the few things you really want to know.


## Using it, dependencies, and all that jazz

1. Just [download it](http://github.com/comradecid/RedSky), and unzip it in a webserver directory with an active internet connection. Everything you need is included; just open index.html.

2. When you run it, you'll see the weather for a default city, which you can change via the menu. Tap on a day to see more detailed info. It's all pretty self-explanatory. Pay attention to all the fancy details like the city skylines changing for each city, and the pretty pics of weather conditions.

![Example week in desktop view](http://comradecid.com/media/redsky_desktop.png)
Example week in desktop view


## How it works

I built this using an idiotically small amount of code using a very basic stack, and for good reason: I wanted to focus on the few bits that made this project different (clever judgements and recommendations), and not waste time monkeying-around with a framework that wasn't really built to do what I wanted it to.

The core code is mostly 'autonomic': it effectively doesn't know or care what information it's dishing out. It also doesn't use much logic to do this, because it really doesn't need to. Instead, most of the action happens in the configurable logic that extends it, especially around interpreting weather data (provided by an API call to [OpenWeatherMap](http://openweathermap.org/forecast5)). Once interpreted and 'boiled down' to a more simplified version, this data is handed off to [Handlebars](http://handlebarsjs.com) templates, whose sorry job is to do the legwork and spit out UI updates.

The interpretation routine itself runs through the data set, applying arbitrary rules to arrive at targeted judgments and summaries. This process is tailored to the particular conventions and usage limitations presented by the OpenWeatherMap API, including emulating logic that I couldn't pay for (i.e., the [$180/month plan](http://openweathermap.org/price), and its fancy day-level rollups of temperature and significant weather conditions). Alas.

The aforementioned 'targeted judgments and summaries' for each day include:

 * Representative temperature
 * Highest temperature
 * Lowest temperature
 * Representative weather condition	
 * Will there be rain?
 * Will there be snow?
 * Will there be high wind?
 * Will it be 'muggy'?
 * Will it be 'hot'?
 * Will it be 'cold'?
 * Will it be 'bitingly cold'?

These are then presented iconographically in each day summary in the default view, and more descriptively in the details view for each day. This allows quick perusal of key takeaways, making the summary immediately actionable without significant further perusal. It doesn't display specific values for many metrics (e.g., barometric pressure, wind direction, etc.) assuming them to be outside of its purview. This approach also feeds into the visual presentation of weather conditions, which are designed to give users at-a-glance slices of the week, complete with varying light levels and obvious precipitation.


## Features it doesn't yet have, but should

Given that I've spit this out in a super-short timeframe, there's a bunch of stuff I didn't manage to get in. Here are notable items:

* Migrating key portions of the codebase to use more advanced (yet heavyweight) solutions, such as LESS/SASS for CSS, React.js to leverage JSX, etc. This would make long-term management and editing far easier.
* Additional helpful weather heuristics, such as 'smogginess' (air quality index), 'iciness', 'feels like', 'put on sunscreen' (UV index), 'when is golden hour' (for photographers), etc.
* Using the more expensive API call to do the heavy-lifting on getting day-by-day data, as opposed to doing a quick-and-dirty version myself.
* Finding some way to use geolocation to grab user's current location, which is tricky given that I'd have to a side-call to Google Maps or something to figure out what the current 'city' is (if any).
* Full city list, and the ability to search for and select the cities you want to track.
* Ability to view day as it is in the timezone of the target city (currently, it shows what that day is in the user's _local_ timezone).
* Swipe-to-navigate, and the ability to move farther ahead in time.
* Better handling errors due to broken connections (current just fails quietly, displaying a blank skybox).

In the meantime, have fun tinkering with it :smile:
