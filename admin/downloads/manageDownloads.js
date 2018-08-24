/**
 * File which deals with adding and removing downloads from
 * the admin section of the website.
 *
 * @author Jeffery Russell 6-30-18
 */


//file IO
const utils = require('../../utils/utils.js');

//updates db
const sql = require('../../utils/sql');

//parses post data
const qs = require('querystring');


/**
 * Processes post requests from the addDownload form
 *
 * @param postData
 * @returns {*|Promise}
 */
const addDownloadPostData = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        if(post.add_download)
        {
            sql.addDownload(post.add_download_name, post.add_download_file)
                .then(function()
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
    return new Promise(function(resolve, reject)
    {
        Promise.all([addDownloadPostData(postData),
            utils.include("./admin/addDownload.html")]).then(function(html)
        {
            resolve("<div class=\"col-md-6\">" + html.join('') + "</div>");
        }).catch(function(error)
        {
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
        const post = qs.parse(postData);
        if(post.delete_download)
        {
            sql.removeDownload(post.delete_download).then(function()
            {
                resolve(postData);
            }).catch(function(err)
            {
                reject(err);
            });
        }
        else
        {
            resolve(postData);
        }
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
        "<td><form action=\"/admin\" method =\"post\" >\n" +
            "    <input type=\"submit\" name=\"submit\" value=\"Delete\"\n" +
            "              class=\"btn btn-secondary\"/>\n" +
            "<input type='hidden' name='delete_download' value='" +
                download.download_id + "'/>"+
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
                "<td>Download Name</td><td>File</td>" +
                "<td>Download Count</td><td>Delete</td>" +
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
                    const htmlafter = "</tbody></table></div></div><br>" +
                        "</div>";

                    resolve(html + htmls.join('') + htmlafter);
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
    /**
     * Renders tha download section of the admin page
     *
     * @param postData
     * @returns {Promise}
     */
    main: function(postData)
    {
        return new Promise(function(resolve, reject)
        {
            Promise.all([addDownload(postData),
                displayDownloads(postData)]).then(function(html)
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