/**
 * File which deals with adding and removing downloads from
 * the admin section of the website.
 *
 * @author Jeffery Russell 6-30-18
 */

/** Whiskers template file */
const TEMPLATE_FILE = "admin/adminUsers.html";


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
const addUserPostData = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        if(post.add_user)
        {
            sql.addUser(post.add_user_name, post.add_user_password)
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
const removeUserPost = function(postData)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        console.log(post);
        if(post.delete_user)
        {
            console.log("Removing user: " + post.delete_user);
            sql.removeUser(post.delete_user).then(function()
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
 * Processes post data to determine if the user requested that
 * a user be updated in the database.
 */
const editUserPost = function(postData, templateContext)
{
    return new Promise(function(resolve, reject)
    {
        const post = qs.parse(postData);
        if(post.edit_user)
        {
            sql.getUserByID(post.edit_user).then(function(user)
            {
                if(user.length == 1)
                {
                    templateContext.edit_user = post.edit_user;
                    templateContext.user_name = user[0].user_name;
                    resolve();
                }
                else
                {
                    resolve();
                }
            }).catch(function(err)
            {
                reject(err);
            });
        }
        else if(post.edit_user_2)
        {
            sql.updateUser(post.edit_user_2, post.edit_user_name, post.edit_user_password)
                .then(function()
            {
                resolve();
            })
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
const getUserInformation = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        sql.getAllUsers().then(function(users)
        {
            templateContext.users = users;
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
                    addUserPostData(postData),
                    removeUserPost(postData),
                    editUserPost(postData, templateContext),
                    getUserInformation(templateContext)]).then(function(template)
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