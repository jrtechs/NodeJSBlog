/**
 * File which deals with adding and removing downloads from
 * the admin section of the website.
 *
 * @author Jeffery Russell 6-30-18
 */

/** Whiskers template file */
const TEMPLATE_FILE = "admin/adminDownloads.html";


const includes = require('../includes/includes.js');

//updates db
const sql = require('../utils/sql');

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
                resolve();
            }).catch(function(error)
            {
                reject(error);
            })
        }
        else
        {
            resolve();
        }
    });
};



/**
 * Removes a download if requested by the
 * post data from an admin.
 */
const removeDownloads = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        if(post.delete_download)
        {
            sql.removeDownload(post.delete_download).then(function()
            {
                resolve();
            }).catch(function(err)
            {
                reject(err);
            });
        }
        else
        {
            resolve();
        }
    });
};


/**
 * Fetches the download items in the database so that
 * the template engine can use it to display them in
 * a table.
 *
 * @param templateContext-- context item used by whiskers
 * @returns {Promise}
 */
const displayDownloads = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getAllDownloads().then(function(downloads)
        {
            templateContext.downloads = downloads;
            resolve();
        }).catch(function(error)
        {
            reject(error);
        });
    });
};


module.exports=
{
    /** Fetches context information for the template and handles
     * post data for the downloads.
     *
     * @param postData posted by user
     * @param templateContext json object used as the template context
     * @returns {Promise} renders the template used for this page
     */
    main: function(postData, templateContext)
    {
        return new Promise(function(resolve, reject)
        {
            Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                addDownloadPostData(postData),
                removeDownloads(postData),
                displayDownloads(templateContext)]).then(function(template)
            {
                resolve(template[0]);
            }).catch(function(error)
            {
                console.log("error in add downloads.js");
                reject(error);
            });
        });
    }
};