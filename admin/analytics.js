
/** Whiskers template file */
const TEMPLATE_FILE = "admin/analytics.html";


const includes = require('../includes/includes.js');

//updates db
const sql = require('../utils/sql');


const generateData = function(templateContext)
{
    return new Promise(function(resolve, reject)
    {
        var data = [];

        sql.getTraffic().then(function(traffic)
        {
            var start = traffic[0].date;
            var currentMonth = new Date(start.getUTCFullYear(), start.getMonth(), 1, 0,0,0);
            templateContext.start = JSON.stringify(currentMonth);
            var monthCount = 0;
            for(var i = 0; i < traffic.length; i++)
            {
                var currentDate = traffic[i].date;

                if(currentMonth.getMonth() != currentDate.getMonth())
                {
                    var foo = new Object();
                    foo.x = currentMonth;
                    foo.y = monthCount;
                    data.push(foo);
                    monthCount = 0;
                    currentMonth = new Date(currentDate.getUTCFullYear(), currentDate.getMonth(), 1, 0,0,0);
                }
                monthCount = monthCount + 1;
            }
            templateContext.finish = JSON.stringify(currentMonth);
            templateContext.dataset = JSON.stringify(data);
            resolve();
        });
    });
};


module.exports=
    {
        /**
         * Fetches context information for the admin blog page and handles post
         * data sent regarding editing blog.
         *
         * @param templateContext json object used as the template context
         * @returns {Promise} renders the template used for this page
         */
        main: function(templateContext)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([includes.fetchTemplate(TEMPLATE_FILE), generateData(templateContext)]).then(function(template)
                {
                    templateContext.adminPage = template[0];
                    resolve();
                }).catch(function(error)
                {
                    console.log("error in add admin blog.js");
                    reject(error);
                });
            });
        }
    };