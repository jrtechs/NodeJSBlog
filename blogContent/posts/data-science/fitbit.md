Health trackers are the current craze. After I bought a Fitbit,  I
wanted to determine what exactly could I do with Fitbit data. Can we
actually learn something from this data that we did not know before?
Most people don't need a watch to tell them that they walked a lot
today or that they got a ton of sleep. As humans we have a pretty good
gauge of our basic physical health. I am interested in figuring out
how we can use data science to look at our health data over a longer
period of time and learn something useful.   

Lets look at a few things that people typically use Fitbit data for
before we jump into the weeds.    

- Setting Goals
- Motivation
- Tracking Progress

Ever since I bought a Fitbit, I found that I went to the gym a lot
more frequently. Having something which keeps track of your progress
is a great motivator. Not only is your daily steps recorded for your
own viewing, you can share that data with your friends as a
competition. Although I only have 1 friend on Fitbit, I found that was
a good motivator to hit the ten thousand steps per day.   

Goals which are not concrete nearly never get accomplished. Simply
saying that "I will get in shape" is a terrible goal. In order for you
to actually accomplish your goals, they need to be quantifiable and
measurable. Rather than saying "I will improve my health this year",
you can say "I will loose ten pounds this year by increasing my daily
step count to fifteen thousand and going to the gym twice a week". One
goal is wishy washy where the other is concrete and measurable. Having
concrete data from Fitbit allows you to  quantify your goals and set
milestones for you to accomplish. Along the way to achieving your
goal, you can easily track your progress.    

Simply knowing your Fitbit data can help you make some better educated
decisions about your fitness. By comparing your data against what is
healthy you can tweak your lifestyle. For example: if you notice that
you are only getting 6 hours of sleep per night, you can look up the
recommended amount of sleep and tweak your sleep routine until you hit
that target.    

Alright, lets do some data science!  

![Tom and Jerry Data Science Meme](media/fitbit/dataScience.jpg)

# Getting The Data

There are two options which we can use to fetch data from Fitbit. 


## Using Fitbit's API

Fitbit has an [OAuth 2.0 web
API](https://dev.fitbit.com/build/reference/web-api/) that you can
use. You first have to register your application on Fitbit's website
to recieve a client ID and a client secret. 

I decided to fetch the Fitbit data using an Express app with node.
Fetching the  data this way will make it really easy to use on a
website. Node has tons of NPM modules which makes connecting to
Fitbit's API really easy. I'm using Passport which is a pretty common
authentication middleware for Express.  


```javascript
/** express app */
const express = require("express");

/** Manages oauth 2.0 w/ fitbit */
const passport = require('passport');

/** Used to make API calls */
const unirest = require('unirest');

/** express app */
const app = express();

app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: true
}));


var FitbitStrategy = require( 'passport-fitbit-oauth2' ).FitbitOAuth2Strategy;


var accessTokenTemp = null;
passport.use(new FitbitStrategy({
        clientID:     config.clientID,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackURL
    },
    function(accessToken, refreshToken, profile, done)
    {
        console.log(accessToken);
        accessTokenTemp = accessToken;
        done(null, {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.authenticate('fitbit', { scope: 
    ['activity','heartrate','location','profile'] 
});
```

Since our authentication middlware is all set up, we just need to add
the express routes which are required when authenticating.  

```javascript
app.get('/auth/fitbit',
    passport.authenticate('fitbit', { scope: 
    ['activity','heartrate','location','profile'] }
));

app.get( '/auth/fitbit/callback', passport.authenticate( 'fitbit', {
    successRedirect: '/',
    failureRedirect: '/error'
}));


app.get('/error', (request, result) =>
{
    result.write("Error authenticating with Fitbit API");
    result.end();
});
```

Now that we are authenticated with Fitbit, we can finally make
queries.  I created a helper function called queryAPI which attempts
to authenticate if it is not already authenticated  and then fetches
the API result from a provided URL.  

```javascript
const queryAPI = function(result, path)
{
    return new Promise((resolve, reject)=>
    {
        if(accessTokenTemp == null)
        {
            result.redirect('/auth/fitbit');
            resolve(false);
        }

        unirest.get(path)
            .headers({'Accept': 'application/json', 'Content-Type': 'application/json', Authorization: "Bearer " +  accessTokenTemp})
            .end(function (response)
            {
                if(response.hasOwnProperty("success") && response.success == false)
                {
                    result.redirect('/auth/fitbit');
                    resolve(false);
                }
                resolve(response.body);
            });
    });
};

app.get('/steps', (request, result)=>
{
    queryAPI(result, 'https://api.fitbit.com/1/user/-/activities/tracker/steps/date/today/1m.json').then((data)=>
    {
        if(data != false)
        {
            result.writeHead(200, {'Content-Type': 'text/html'});
            result.write(JSON.stringify(data));
            result.end();
        }
        else
        {
            console.log("Validating with API");
        }
    });
});
```


## Exporting Data from Website

On [Fitbit's website](https://www.fitbit.com/settings/data/export)
there is a nice page where you can export your data. 

![Fitbit Website Data Export](media/fitbit/fitbitDataExport.png)

The on demand export is pretty useless because it can only go back a
month. On top of that, you don't get to download any heart rate data.
The only data that you do get is aggregated by day. This might be fine
for some use cases; however, this will not suffice for any interesting
analysis. 

I decided to try the account archive option out of curiosity. 

![Fitbit Archive Data](media/fitbit/fitbitArchiveData.png)

The Fitbit data archive was very organized and kept meticulous records
of everything. All of the data was in JSON format and was organized
nicely in in separate files labeled by date. Fitbit keeps around 1MB
of data on you per day; most of this data is from the heart rate
sensors. Although 1MB of data may sound intimidating, it is probably a
lot less after you store it in a format other than JSON. Since Fitbit
hires a lot of people for hadoop and SQL development, they are most
likely using [Apache Hive](https://hive.apache.org/) to store user
information on the backend. Distributing the data to users as JSON is
really convenient since it makes learning the data schema very simple.

# Visualizing The Data


# Pulling Outside Data


# Analysis
