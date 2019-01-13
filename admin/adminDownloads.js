/**
 * File which deals with adding and removing downloads from
 * the admin section of the website.
 *
 * @author Jeffery Russell 6-30-18
 */

const TEMPLATE_FILE = "admin/adminDownloads.html";

//file IO
const utils = require('../utils/utils.js');

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
 * Handel form requests from the downloads table
 *
 * @param postData
 * @returns {*|Promise}
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
 * Displays all the download information in a table
 * @param postData
 * @returns {*|Promise}
 */
const displayDownloads = function(postData, templateContext)
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
    /**
     * Renders tha download section of the admin page
     *
     * @param postData
     * @returns {Promise}
     */
    main: function(postData, templateContext)
    {
        console.log(postData);
        console.log("downloads page called");
        return new Promise(function(resolve, reject)
        {
            Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                addDownloadPostData(postData),
                removeDownloads(postData),
                displayDownloads(postData, templateContext)]).then(function(template)
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