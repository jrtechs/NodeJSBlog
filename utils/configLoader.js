const utils = require('../utils/utils');


/**
 * @author Jeffery Russell 11-24-18
 *
 * @type {{main: module.exports.main}}
 */
module.exports=
    {

        /**
         *
         * @returns {*|any}
         */
        getConfig: function()
        {
            const configContents = ["PORT", "SESSION_SECRET",
                "SQL_HOST", "SQL_DATABASE", "SQL_PASSWORD"];

            var config = utils.getFileAsJSON("./config.json");

            for(var i = 0; i < configContents.length; i++)
            {
                if(!config.hasOwnProperty(configContents[i]))
                {
                    console.log("Missing config property: " + configContents[i]);
                    process.exit(1);
                }
            }
            return config;
        }
    }
