const routes = require('express').Router();

const pageBuilder = require('../../utils/pageBuilder');

const renderBlogPost = require('../../blog/renderBlogPost');

const utils = require('../../utils/utils');

const whiskers = require('whiskers');

const url = require('url');

const fs = require('fs');

// routes.get('/', (request, result) =>
// {
//     //do something later
//     result.write("Not implemented yet.");
//     result.end();
// });




const photosBaseDir = "blogContent/photos";

photoPageBuilder = function(filename, request, templateContext)
{
    const imagePath =  "/" +  photosBaseDir + filename + "/";
    return new Promise((resolve, reject)=>
    {
        if(fs.existsSync(photosBaseDir + filename + "/post.md"))
        {
            var markdownContent = utils.getFileContents(
                photosBaseDir + filename + "/post.md");

            renderBlogPost.pandocWrapper(markdownContent, "-t html5")
                .then((html)=>
            {
                templateContext.mainPost = html;
                templateContext.images = [];
                fs.readdirSync(photosBaseDir + filename).forEach(file=>
                {
                    if(file.includes('.jpg')) //doesn't pick up mark down files
                    {
                        templateContext.images.push({full:imagePath+ file,
                            preview:imagePath + "preview/" + file});
                    }
                });

                resolve();
            }).catch((error)=>
            {
                reject(error);
            })

        }
        else if(fs.existsSync(photosBaseDir + filename + "/dir.md"))
        {
            templateContext.folders = [];
            templateContext.directory = true;
            fs.readdirSync(photosBaseDir + filename).forEach(file=>
            {
                if(!file.includes('.md') && !file.includes('.jpg') && !file.includes('private')) //only pick up folders
                {
                    templateContext.folders.push({url: "/photos" + filename + "/" + file,
                        img:imagePath + file + "/1.jpg"});
                }
            });

            renderBlogPost.pandocWrapper(utils.getFileContents(
                photosBaseDir + filename + "/dir.md"), "-t html5")
            .then((html)=>
            {
                templateContext.mainPost = html;
                resolve();
            }).catch((error)=>
            {
                console.log(error);
                templateContext.error = true;
                resolve();
            });
        }
        else
        {
            templateContext.error = true;
            resolve();
        }
    })
};

routes.get('*', (request, result) =>
{
    pageBuilder.buildPageWithTemplate(request, result,
        photoPageBuilder, "photos/photosEntry.html");
});

routes.get('/', (request, result) =>
{
    console.log("wham");
    pageBuilder.buildPageWithTemplate(request, result,
        photoPageBuilder, "photos/photosEntry.html");
});

module.exports = routes;