

## Results


## Optimize Images

Since images are the largest portion of a website's size, optimizing and reducing the
size of images will greatly decrease load time. In a perfect web development world, everyone would 
use SVG images which are extremely small and don't need compression. However, since most of us
use PNG and JPEG images I wrote a script to automatically optimize images for the web. 

```
#!/bin/bash

# Simple script for optimizing all images for a website
#
# @author Jeffery Russell 7-19-18

WIDTH="690>"  # the ">" tag specifies that images will not get scaled up

folders=("./entries" "./img")

for folder in "${folders[@]}"; do

    for f in $(find $folder -name '*.jpg' -or -name '*.JPG'); do
        convert "$f" -resize $WIDTH "$f"
        jpegoptim --max=80 --strip-all --preserve --totals --all-progressive "$f"
    done


    for f in $(find $folder -name '*.png' -or -name '*.PNG'); do
        convert "$f" -resize $WIDTH "$f"
        optipng -o7 -preserve "$f"
    done
done
```

When ran, this script will go through the img, and entries folder recursively and optimize all
the images in there. If an image is more than 690px wide, it will scale it down to save size. In 
most cases, it is useless to have images with a width greater than 690 because it will just get 
scaled by the client's web browser.


If you are running a Debian based linux distro, you can download the dependencies for this script with
the following commands:
```
apt-get install jpegoptim
apt-get install optipng
```

The goal of this script is to make most of the images under 100kb for the web. It is ok to have
a few images above 100k, however, you should really avoid having images above 200kb.


## Take advantage of Async calls

One of the largest benefits of node is its async abilities where code is executed in a 
multi-threaded fashion. This can become a callback hell if not handled correctly, but, with
good code structure it can become very easy. When code is executed in parallel, you can greatly
decrease run time by doing other stuff while waiting on costly file IO or database calls.

The problem with async code is that it is hard to coordinate. Node has a lot of ways to handel
synchronization, but, I prefer to use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
. Here is a simple example where async code can become inefficient. 

Good Code Async:
```
Promise.all([includes.printHeader(),
    require(file).main(filename, request),
    includes.printFooter()]).then(function(content)
{
    res.write(content.join(''));
    res.end();
}).catch(function(err)
{
    console.log(err);
});
```

Bad Async Code:
```
includes.printHeader(res).then(function()
{
    return require(file).main(res, filename, request);
}).then(function()
{
    return includes.printFooter(res);
}).catch(function(err)
{
    console.log(err);
})
```

In the first example three blocks of async code are executed in parallel and in the second example
three blocks of async code are executed one after another. Many people may initially do the second
option because it may seem like you have to create and render the footer after you render the header
and body of the page.

A great way to handel async calls is by having most of your methods returning promises which resolve to
the HTML or DB information that they produce. When you run Promise.all, it returns an array of the
objects which enables you to preserve the order ie header, body, footer. After you do this for all of
your code, it creates a "perfect" async tree which actually runs very fast.

Another Good Async Example:
```
/**
 * Calls posts and sidebar modules to render blog contents in order
 *
 * @param requestURL
 * @returns {Promise|*}
 */
main: function(requestURL)
{
    return new Promise(function(resolve, reject)
    {
        Promise.all([renderPost(requestURL),
            require("../sidebar/sidebar.js").main()]).then(function(content)
        {
            resolve(content.join(''));
        }).catch(function(error)
        {
            reject(error);
        })
    });
}
```


## Client Side Caching


```
var eTag = crypto.createHash('md5').update(content).digest('hex');
result.writeHead(200, {'Content-Type': 'text/css', 'Cache-Control': 
                        'public, max-age=2678400', 'ETag': '"' + eTag + '"', 
                        'Vary': 'Accept-Encoding'});
result.write(content);
result.end();
cache.put(path, content);
```


## Server Side Caching


## Enable Compression (GZIP)



## Purge Unused CSS Definitions


## Minify CSS and Javascript





