/**
 * @author Jeffery Russell 8-19-18
 */


//used for file IO
const utils = require('../utils/utils.js');


//used for static files
const includes = require('../includes/includes');

//for parsing post data
const qs = require('querystring');

const sanitizer = require('sanitizer');

const Request = require('request');


const nodemailer = require("nodemailer");


const smtpTransport = require('nodemailer-smtp-transport');


const CAPTCHA_SECRET = utils.getFileLine("../captcha_secret");

const EMAIL_PASSWORD = utils.getFileLine("../email_password");


const verifyCapcha = function(data)
{
    const recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?" +
                            "secret=" + CAPTCHA_SECRET + "&" +
                            "response=" + data;

    return sync = new Promise(function(resolve, reject)
    {
        Request(recaptcha_url,
            function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    const googleAnswer = JSON.parse(body);

                    if(googleAnswer.success == true)
                    {
                        resolve(true);
                    }
                    else
                    {
                        resolve(false);
                    }
                }
                else
                {
                    resolve(false);
                }
            }
        );
    });

};



const sendEmail = function(name, email, message)
{

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: 'jrtechswebsite@gmail.com',
            pass: EMAIL_PASSWORD
        }
    }));

    const mailOptions =
    {
        to: "jeffery@jrtechs.net", // list of receivers
        subject: "Jrtechs.net form submission", // Subject line
        text: message, // plaintext body
        html: message
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, response)
    {
        if(error)
        {
            console.log(error);
        }
        else
        {
            console.log("Message sent: " + response);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        transporter.close(); // shut down the connection pool, no more messages
    });
};



const processContactPage = function(request)
{
    return new Promise(function(resolve, reject)
    {
        utils.getPostData(request).then(function(postData)
        {
            const data = qs.parse(postData);

            if(data.name && data.email && data["g-recaptcha-response"] && data.message)
            {

                verifyCapcha(sanitizer.sanitize(data["g-recaptcha-response"])).then(function(valid)
                {
                    if(valid)
                    {
                        resolve(utils.include("includes/messageSent.html"));

                        sendEmail(data.name, data.email, data.message);
                    }
                    else
                    {
                        resolve(utils.include("includes/invalidCaptcha.html"));
                    }
                });
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
