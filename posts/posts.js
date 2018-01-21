const utils = require('../utils/utils.js');
const sql = require('../utils/sql');

module.exports=
{
    /**
     * Function which parses a url and displays appropriate post
     *
     * @param res
     * @param fileName request url
     */
    main: function(res, requestURL)
    {
        res.write("<div class=\"w3-col l8 s12\">");

        var splitURL = requestURL.split("/");

        //user entered /category/name/ or /category/name
        if(splitURL.length == 3 || splitURL.length == 4)
        {
            var post = sql.getPost(requestURL);
            if(post)
                require("../posts/singlePost.js").renderPost(res, post);
            else
                utils.include(res, "includes/404.html");
        }
        else
        {

        }
        res.write("</div>");
        require("../includes/sidebar.js").main(res, requestURL);
    }
};