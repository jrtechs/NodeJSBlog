One of the beautiful things about Node is that it is really easy to do just about anything in a few lines of code.
To put this in perspective, it took me longer to make this *terrible* blog post header than it did for me to implement an RSS feed in node. 
An RSS (rich site summary) feed enables people to subscribe to blogs and get notified when there is a new post.
People also use RSS feeds to aggregate all the blogs they read in one place.
Although RSS is on the decline, it is still widely used in the tech community.

Before looked for a package I added a route listening on "/rss" which sends a static object that will eventually store the RSS feed object.

```javascript
routes.get('/rss', (request, result) =>
{
    result.set('Content-Type', 'text/xml');
    result.send(xmlFeed);
});
```

The next step was to find a nifty node package that handles the generation of RSS XML.
I'm using the [package](https://www.npmjs.com/package/rss) adequately named "RSS".

```bash
npm install -s rss
```


Based on the documentation for the package, I initialized the RSS generator object. 

```
// defines basic details about your blog
var feed = new RSS({
    title: 'jrtechs',
    description: 'Jeffery\'s blog which has everything from data-science to cooking',
    feed_url: 'https://jrtechs.net/rss',
    site_url: 'https://jrtechs.net',
    image_url: 'https://jrtechs.net/includes/img/favicon/android-chrome-512x512.png',
    docs: 'https://github.com/jrtechs/NodeJSBlog',
    language: 'en',
    categories: ['other', 'hardware', 'open-source', 'programming', 'projects', 'web-development', 'data-science'],
});

var xmlFeed = feed.xml();
```

The final step was to add all the recent posts to the RSS feed. 

```javascript
const sql = require('../utils/sql');
sql.getRecentPosts().then((posts)=>
{
    posts.forEach(post =>
    {
        feed.item({
            title: post.name,
            url: "https://jrtechs.net/" + post.category + "/" + post.url,
            date: post.published
        });
    });
    xmlFeed = feed.xml();
}).catch((err)=>
{
    console.log(err);
});
```

Although my implementation is probably very rudimentary, it is flexible and implementing it myself gave me a deeper appreciation for RSS.
Looking through the package documentation, I discovered a multitude of details that RSS feeds could contain that I didn't know about.
