//file io
const utils = require('../../utils/utils.js');

//update db
const sql = require('../../utils/sql');

const qs = require('querystring');

const DEBUG = false;


/**
 * Processes post data to see if the user has successfully
 * logged in. If the user has logged in successfully, a session
 * variable is set and the page is refreshed.
 *
 * @param request
 * @returns {Promise}
 */
const processLogin = function(request, clientAddress, templateContext)
{
    return new Promise(function(resolve, reject)
    {
        if(DEBUG)
        {
            //what actually logs in the user
            request.session.user = 1;
            console.log("user has logged in");
            templateContext.goodLoginAttempt = true;
            resolve();
        }

        utils.getPostData(request).then(function(postData)
        {
            const post = qs.parse(postData);
            if(!post.username && !post.password)
            {
                resolve("");
                return(false); // no login attempted
            }
            return sql.checkLogin(postData);
        }).then(function(loginResult)
        {
            if(loginResult !== false)
            {
                if(loginResult.pass)
                {
                    //what actually logs in the user
                    request.session.user = loginResult.user;
                    console.log("user has logged in");
                    templateContext.goodLoginAttempt = true;
                    resolve();
                }
                else
                {
                    templateContext.invalid = true;
                    banIP(clientAddress);
                    console.log("Invader!");
                    resolve("Wrong!");
                }
            }
        }).catch(function(err)
        {
            reject(err);
        })
    });
};


/** Global Containing Ban Data **/
var banData = {};

/** Number of incorrect login attempts permitted per ip */
const LOGIN_LIMIT = 5;


/**
 * Determines if a client is banned from the server
 * or not.
 *
 * @param clientAddress
 */
const isBanned = function(clientAddress)
{
    if(clientAddress in banData)
    {
        user = banData[clientAddress];

        return user.incorrectLogins > LOGIN_LIMIT;
    }
    return false;

};


/**
 * Increments the user's incorrect login attempt
 * counter.
 *
 * @param clientAddress
 */
const banIP = function(clientAddress)
{
    if(clientAddress in banData)
    {
        user = banData[clientAddress];
        user.incorrectLogins++;
    }
    else
    {
        var newUser = new Object();
        newUser.incorrectLogins = 1;
        banData[clientAddress] = newUser;
    }
};


module.exports=
    {
        /**
         * Renders the contents of the login page of the website
         *
         * @param request express request containing post data
         * @returns {Promise} resolves html of login page
         */
        main: function(request, clientAddress, templateContext)
        {
            return new Promise(function(resolve, reject)
            {
                if(isBanned(clientAddress))
                {
                    templateContext.banned = true;
                    resolve();
                }
                else
                {
                    processLogin(request, clientAddress, templateContext).then(function()
                    {
                        resolve();
                    }).catch(function(err)
                    {
                        reject(err);
                    })
                }
            });

        },
    };