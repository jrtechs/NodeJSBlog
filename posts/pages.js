var renderPage = function(result, requestURL)
{
    return new Promise(function(resolve, reject)
    {
        result.write("<div class=\"w3-col l8 s12\">");

    });
};

module.exports=
    {
        /**
         * Displays a page and sidebar to users
         *
         * @param res
         * @param fileName request url
         */
        main: function(res, requestURL, request)
        {
            console.log("posts page");
            return new Promise(function(resolve, reject)
            {
                renderPage(res, requestURL).then(function()
                {
                    return require("../sidebar/sidebar.js").main(res)
                }).then(function ()
                {
                    resolve();
                });
            });
        }
    };