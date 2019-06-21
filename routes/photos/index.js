const routes = require('express').Router();

const pageBuilder = require('../../utils/pageBuilder');

const utils = require('../../utils/utils');

const whiskers = require('whiskers');

const url = require('url');

const fs = require('fs');

routes.get('/', (request, result) =>
{
    //do something later
});



const photosBaseDir = "blogContent/photos";
photoPageBuilder = function(filename, request, templateContext)
{
    if(fs.existsSync(photosBaseDir + filename))
    {
        templateContext.images = [];
        var imagePath =  "/" +  photosBaseDir + filename + "/";
        fs.readdirSync(photosBaseDir + filename).forEach(file=>
        {
            if(file.includes('.jpg')) //doesn't pick up mark down files
            {
                templateContext.images.push({full:imagePath+ file,
                    preview:imagePath + "preview/" + file});
            }
        });
    }
    else
    {
        templateContext.error = true;
    }
};

routes.get('*', (request, result) =>
{
    pageBuilder.buildPageWithTemplate(request, result,
        photoPageBuilder, "photos/photosEntry.html");
});

module.exports = routes;