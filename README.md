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

2. When you run it, you'll see the weather for a default city, which you can change via the menu. Tap on a day to see more detailed info. It's all pretty self-explanatory. Pay attention to fancy details like the city skylines changing for each city — I spent a lot of time on all that.

![Example week in desktop view](http://comradecid.com/media/redsky_desktop.png)
Example week in desktop view


## How it works

I built this using an idiotically small amount of code using a very basic stack, and for good reason: I wanted to focus on the few bits that made this project different (clever judgements and recommendations), and not waste time monkeying-around with a framework that wasn't really built to do what I wanted it to.

The core code is mostly autonomous: it doesn't know or care what information it's dishing out. It doesn't use much logic to spit out the presentation layer either, because it really doesn't need it. Instead, most of the action happens in interpreting the weather data (provided by an API call to [OpenWeatherMap](http://openweathermap.org/forecast5)), which is then handed off in a streamlined, edited form to [Handlebars](http://handlebarsjs.com) templates, whose sorry job is to do the legwork and spit out UI updates.

The interpretation routine runs through the data set, applying arbitrary rules (provided in an isolated configuration) to derive boiled-down judgements on what it sees. This process is tailored to the particular way that OpenWeatherMap structures its data, formats its weather codes, and allows interaction with its API. It also uses logic that I wouldn't have had to build if I could afford the [$180/month plan](http://openweathermap.org/price), such as day-level rollups of temperature and significant weather conditions. Alas.

The routine uses the following steps:


## Features it doesn't yet have, but should

Given that I've spit this out in a super-short timeframe, there's a bunch of stuff I didn't manage to get in. Here are notable items:
