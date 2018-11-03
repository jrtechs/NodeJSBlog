//used to append static content to result
const includes = require('../includes/includes.js');



/**
 * @author Jeffery Russell 10-30-18
 *
 * @type {{main: (function(*=, *): Promise)}}
 */
module.exports=
    {

        serveStaticContent: function(request, result, filename, baseURL)
        {
            console.log(filename);
            if (filename.includes(".svg") || filename.includes(".svg"))
            {
                includes.sendSVG(result, baseURL + filename);
                return true;
            }
            //handles image requests
            else if (filename.includes(".jpg") ||
                filename.includes(".png") || filename.includes(".ico"))
            {
                console.log("Da fuck");
                includes.sendImage(result, baseURL + filename);
                return true;
            }
            //css and font files
            else if (filename.includes(".woff2") || filename.includes(".css") ||
                filename.includes(".txt"))
            {
                includes.sendCSS(result, baseURL + filename);
                return true;
            }
            //scripts
            else if (filename.includes("/js/") || filename.includes(".js"))
            {
                includes.sendJS(result, baseURL + filename);
                return true;
            }
            //html
            else if (filename.includes(".html"))
            {
                includes.sendHTML(result, baseURL + filename);
                return true;
            }
            return false;
        }
    };