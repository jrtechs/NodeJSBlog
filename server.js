/**
 * Main server file for the blog. This file is responsible for
 * creating the server and listening for clients. The main run
 * function parses the url and calls a sub module to make the
 * appropriate pages.
 */

const http = require('http');

const url = require('url');

const includes = require('./includes/includes.js');

var Promise = require('promise');

http.createServer(function (request, res)
{
    var q = url.parse(request.url, true);
    var filename = q.pathname;

    //handles image requests
    if(filename.includes("/img/"))
    {
        require("./img/image.js").main(res, filename);
    }
    else
    {
        var file = "";

        if(filename.includes("/category"))
        {
            //categories or view a category page
            file = "../posts/category.js";
        }
        else if(filename.includes("/admin"))
        {
            //admin page
            file = "./admin/admin.js";
        }
        else
        {
            //normal blog entry
            file = "./posts/posts.js";
        }

        var displayHeader = function()
        {
            return new Promise(function(resolve, reject)
            {
                var status = includes.printHeader(res);
                if(status == 0)
                {
                    console.log("Header done");
                    resolve();
                }
            });
        };
        var displayContent = function()
        {
            return new Promise(function(resolve, reject)
            {
                require(file).main(res, filename, request).then(function()
                {
                    resolve();
                });
            });
        };
        var displayFooter = function()
        {
            return new Promise(function(resolve, reject)
            {
                var status = includes.printFooter(res);
                if(status == 0)
                {
                    console.log("Footer done");
                    resolve();
                }
            });
        };

        displayHeader().then(function()
        {
            return displayContent();
        }).then(function(){
            return displayFooter()
        }).then(function(){
            console.log("finished!!!!!!!!!!!!!!!")
        })

    }

}).listen(8080);