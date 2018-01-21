const utils = require('../utils/utils.js');


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

        require("../includes/sidebar.js").main(res, requestURL);
    }
};