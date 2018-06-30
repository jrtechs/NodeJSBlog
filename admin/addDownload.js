const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
const Promise = require('promise');

/**
 * @author Jeffery Russell 6-30-18
 */


/**
 * Processes post requests from the addDownload form
 * @param res
 * @param postData
 * @returns {*|Promise}
 */
var addDownloadPostData = function(res, postData)
{
    return new Promise(function(resolve, reject)
    {
        var post = qs.parse(postData);
        if(post.add_download)
        {
            console.log("addind post to db");
            console.log(post);
        }
        resolve(postData);
    });
};


/**
 * Displays the addDownload form the the user
 *
 * @param res
 * @param postData
 * @returns {*|Promise}
 */
var addDownload = function(res, postData)
{
    res.write("<div class=\"col-md-6\">");
    return new Promise(function(resolve, reject)
    {
        addDownloadPostData(res, postData).then(function()
        {
            return utils.include(res, "./admin/addDownload.html");
        }).then(function()
        {
            res.write("</div>");
            resolve(postData);
        }).catch(function(err)
        {
            console.log(err);
            reject(err);
        });
    });
};


/**
 * Handel form requests from the downloads table
 *
 * @param res
 * @param postData
 * @returns {*|Promise}
 */
var displayDownloadsPostData = function(res, postData)
{
    return new Promise(function(resolve, reject)
    {

        var post = qs.parse(postData);
        if(post.delete_download)
        {

        }
        resolve(postData);
    });
};


/**
 * Renders a single download row in the downloads table
 *
 * @param result
 * @param download
 * @returns {*|Promise}
 */
var renderDownloadRow = function(result, download)
{
    return new Promise(function(resolve, reject)
    {
        result.write("<tr>");

        //download name
        result.write("<td>" + download.name + "</td>");

        //file name
        result.write("<td>" + download.file + "</td>");

        //download count
        result.write("<td>" + download.download_count + "</td>");

        //edit
        result.write("<td><form action=\"/admin/\" method =\"post\" >\n" +
            "    <input type=\"submit\" name=\"submit\" value=\"Edit\"\n" +
            "              class=\"btn btn-secondary\"/>\n" +
            "<input type='hidden' name='delete_download' value='" + download.download_id + "'/>"+
            "</form></td>");

        result.write("</tr>");

        resolve();
    });
};


/**
 * Displays all the download information in a table
 * @param res
 * @param postData
 * @returns {*|Promise}
 */
var displayDownloads = function(res, postData)
{
    res.write("<div class=\"col-md-6\">");
    return new Promise(function(resolve, reject)
    {
        displayDownloadsPostData(res, postData).then(function()
        {
            res.write("<div class='blogPost p-2'>");
            res.write("<h1 class=\"text-center\">Downloads</h1>");
            res.write("<div class=\"\"><table class=\"table table-striped\">");
            res.write("<thead class=\"thead-dark\"><tr>");
            res.write("<td>Download Name</td><td>File</td><td>Download Count</td><td>Delete</td>");
            res.write("</tr></thead><tbody>");



            sql.getAllDownloads().then(function(downloads)
            {
                console.log("sql thing finished");
                var downloadPromises = [];

                downloads.forEach(function(download)
                {
                    console.log("push elements");
                   downloadPromises.push(new Promise(function(resolveDownload, reject)
                   {
                       renderDownloadRow(res, download).then(function()
                       {
                           resolveDownload();
                       }).catch(function(error)
                       {
                           reject(error);
                       })
                   }));
                });

                Promise.all(downloadPromises).then(function()
                {
                    res.write("</tbody></table></div></div><br>");
                    res.write("</div>");
                    console.log("got to the end of downloads table");
                    resolve(postData);
                });
            }).catch(function(error)
            {
                reject(error);
            });
        });

    });
};


module.exports=
{
    main: function(res, postData)
    {
        res.write("<div class=\"row\">");
        return new Promise(function(resolve, reject)
        {
            addDownload(res, postData).then(function()
            {
                return displayDownloads(res, postData);
            }).then(function()
            {
                res.write("</div>");
                resolve(postData);
            }).catch(function(err)
            {
                console.log(err);
                reject(err);
            })
        });
    }
};