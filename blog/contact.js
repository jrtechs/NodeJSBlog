/**
 * File which sends emails to me from
 * a captcha protected form on the contact
 * page.
 *
 * @author Jeffery Russell 8-19-18
 */

/** used for file IO */
const utils = require('../utils/utils.js');

/** used for static files */
const includes = require('../includes/includes');

/** for parsing post data */
const qs = require('querystring');

/** cleans form submission */
const sanitizer = require('sanitizer');

/** used to send post data for the captcha */
const Request = require('request');

/** sends the email using a throw away gmail account */
const nodemailer = require("nodemailer");

/** agent for sending the email */
const smtpTransport = require('nodemailer-smtp-transport');

/** Used to load the config file from the disk */
const config = require('../utils/configLoader').getConfig();


//captcha secret
const CAPTCHA_SECRET = config.CAPTCHA_SECRET;

//password to gmail account
const EMAIL_PASSWORD = config.EMAIL_PASSWORD;


const TEMPLATE_FILE = "blog/contact.html";
const whiskers = require('whiskers');


/**
 * Verifies if the captcha response recieved from the post data was
 * valid, or are bots trying to get around the captcha
 *
 * @param data captcha data from post request
 * @returns {Promise} resolves whether the captcha is valid
 */
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


/**
 * Sends a email to my personal emaail address using a throw away
 * gmail account
 *
 * @param name from contact form
 * @param email from contact form
 * @param message from contact form
 */
const sendEmail = function(name, email, message)
{

    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: config.GMAIL_ACCOUNT,
            pass: EMAIL_PASSWORD
        }
    }));

    const email_message_html = "<h2><b>email:</b> " + email + "</h2><br>" +
        "<h2><b>name:</b> " + name + "</h2><br>" +
        "<h2>message:</h2><br><p>" + message +  "</p>";

    const email_message_text = "email: " + email + "\n" +
        "name: " + name + "\n" +
        "message: \n" + message;


    const mailOptions =
    {
        to: config.DESTINATION_EMAIL, // list of receivers
        subject: "Jrtechs.net form submission", // Subject line
        text: email_message_text, // plaintext body
        html: email_message_html
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

        transporter.close(); // shut down the connection pool, no more messages
    });
};


/**
 * If there was post data on the contact page, it processes it to see
 * if it was a valid captcha request and sends an email. If no post data was sent,
 * the normal form is displayed
 *
 * @param request -- main express request
 * @returns {Promise} renders the html of the contact widget
 */
const processContactPage = function(request, templateContext)
{
    return new Promise(function(resolve, reject)
    {
        utils.getPostData(request).then(function(postData)
        {
            const data = qs.parse(postData);

            if(data.name &&
                data.email &&
                data["g-recaptcha-response"] &&
                data.message)
            {

                verifyCapcha(sanitizer.sanitize(data["g-recaptcha-response"]))
                    .then(function(valid)
                {
                    if(valid)
                    {
                        templateContext.messageSent = true;
                        resolve();
                        sendEmail(data.name, data.email, data.message);
                    }
                    else
                    {
                        resolve();
                    }
                });
            }
            else
            {
                resolve();
            }


        }).catch(function(err)
        {
            reject(err);
        })
    });
};


module.exports =
    {
        /**
         * Displays the contact page along with the header, sidebar, and footer.
         * This uses the admin header because it doesn't need any minified css
         * which has been purged of some css classes which are not used in any
         * of the blog blog.
         *
         * @param request -- main express request
         * @param result -- renders the html of the contact page
         */
        main: function(request, result)
        {
            result.writeHead(200, {'Content-Type': 'text/html'});

            var templateContext = Object();
            Promise.all([includes.fetchTemplate(TEMPLATE_FILE),
                processContactPage(request, templateContext),
                includes.printHeader(templateContext),
                includes.printFooter(templateContext),
                require("./sidebar.js").main(templateContext)])
                .then(function (content)
            {
                const html = whiskers.render(content[0], templateContext);
                result.write(html);
                result.end();
            }).catch(function(err)
            {
                console.log(err);
            });
        }
    };
