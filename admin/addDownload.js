const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

const qs = require('querystring');
const Promise = require('promise');

/**
 * @author Jeffery Russell 6-30-18
 */


/**
 * Processes post requests from the addDownload form
 * @param postData
 * @returns {*|Promise}
 */
var addDownloadPostData = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        var post = qs.parse(postData);
        if(post.add_download)
        {
            console.log(post);

            sql.addDownload(post.add_download_name, post.add_download_file).then(function()
            {
                resolve("");
            }).catch(function(error)
            {
                reject(error);
            })
        }
        else
        {
            resolve("");
        }
    });
};


/**
 * Displays the addDownload form the the user
 *
 * @param postData
 * @returns {*|Promise}
 */
const addDownload = function(postData)
{
    //res.write("<div class=\"col-md-6\">");
    return new Promise(function(resolve, reject)
    {
        Promise.all([addDownloadPostData(postData), utils.include("./admin/addDownload.html")]).then(function(html)
        {
            console.log("add download is good");
            resolve("<div class=\"col-md-6\">" + html.join('') + "</div>");
        }).catch(function(error)
        {
            console.log(error);
            reject(error);
        })
    });
};


/**
 * Handel form requests from the downloads table
 *
 * @param postData
 * @returns {*|Promise}
 */
const displayDownloadsPostData = function(postData)
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
 * @param download
 * @returns {*|Promise}
 */
const renderDownloadRow = function(download)
{
    return "<tr>" +
        "<td>" + download.name + "</td>" +
        "<td>" + download.file + "</td>" +
        "<td>" + download.download_count + "</td>" +
        "<td><form action=\"/admin/\" method =\"post\" >\n" +
            "    <input type=\"submit\" name=\"submit\" value=\"Edit\"\n" +
            "              class=\"btn btn-secondary\"/>\n" +
            "<input type='hidden' name='delete_download' value='" + download.download_id + "'/>"+
            "</form></td>" +
        "</tr>";
};


/**
 * Displays all the download information in a table
 * @param postData
 * @returns {*|Promise}
 */
const displayDownloads = function(postData)
{
    var html = "<div class=\"col-md-6\">";
    return new Promise(function(resolve, reject)
    {
        displayDownloadsPostData(postData).then(function()
        {
             html += "<div class='blogPost'>" +
                "<h1 class=\"text-center\">Downloads</h1>" +
                "<div class=\"\"><table class=\"table table-striped\">" +
                "<thead class=\"thead-dark\"><tr>" +
                "<td>Download Name</td><td>File</td><td>Download Count</td><td>Delete</td>" +
                "</tr></thead><tbody>";


            sql.getAllDownloads().then(function(downloads)
            {
                var downloadPromises = [];

                downloads.forEach(function(download)
                {
                    downloadPromises.push(renderDownloadRow(download));
                });

                Promise.all(downloadPromises).then(function(htmls)
                {
                    var htmlafter = "</tbody></table></div></div><br>" +
                        "</div>";

                    console.log("display download is good");
                    resolve(html + htmls.join('') + htmlafter);
                });
            }).catch(function(error)
            {
                console.log(error);
                reject(error);
            });
        });

    });
};


module.exports=
{
    main: function(postData)
    {
        return new Promise(function(resolve, reject)
        {
            Promise.all([addDownload(postData), displayDownloads(postData)]).then(function(html)
            {
                resolve("<div class=\"row\">" + html.join('') + "</div>");
            }).catch(function(error)
            {
                console.log("error in add downloads.js");
                reject(error);
            });
        });
    }
};