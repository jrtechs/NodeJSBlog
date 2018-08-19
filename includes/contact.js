/**
 * @author Jeffery Russell 8-19-18
 */


//used for file IO
const utils = require('../utils/utils.js');


//used for static files
const includes = require('../includes/includes');

//for parsing post data
const qs = require('querystring');


const processContactPage = function(request)
{
    return new Promise(function(resolve, reject)
    {
        utils.getPostData(request).then(function(postData)
        {

            const data = qs.parse(postData);
            console.log(postData);
            console.log(data);
            if(data.name && data.email)
            {
                //send email

                resolve(utils.include("includes/messageSent.html"));
            }
            else
            {
                resolve(utils.include("includes/contact.html"));
            }

        }).catch(function(err)
        {
            reject(err);
        })
    });


};

module.exports =
    {
        main: function(request, result)
        {
            result.writeHead(200, {'Content-Type': 'text/html'});
            Promise.all([includes.printAdminHeader(),
                processContactPage(request),
                require("../sidebar/sidebar.js").main(),
                includes.printFooter()]).then(function(content)
            {
                result.write(content.join(''));
                result.end();

            }).catch(function(err)
            {
                console.log(err);
            });
        }
    };
