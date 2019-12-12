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
            var fullPath = baseURL + filename;
            var filename = filename.toLowerCase();
            if(fullPath.charAt(0) === '/')
                fullPath = fullPath.substring(1,);
            if (filename.includes(".svg") || filename.includes(".svg"))
            {
                includes.sendSVG(result, fullPath);
                return true;
            }
            //handles image requests
            else if (filename.includes(".jpg") ||
                filename.includes(".png") || filename.includes(".ico"))
            {
                includes.sendImage(result, fullPath);
                return true;
            }
            else if (filename.includes(".pdf"))
            {
                includes.sendPDF(result, fullPath);
                return true;
            }
            //css and font files
            else if (filename.includes(".woff2") || filename.includes(".css") ||
                filename.includes(".txt"))
            {
                includes.sendCSS(result, fullPath);
                return true;
            }
            else if (filename.includes(".json"))
            {
                if(fullPath.includes("includes/") || fullPath.includes("blogContent"))
                {
                    includes.sendHTML(result, fullPath);
                    return true;
                }
            }
            //scripts
            else if (filename.includes(".js"))
            {
                if(fullPath.includes("includes/") || fullPath.includes("blogContent"))
                {
                    includes.sendJS(result, fullPath);
                    return true;
                }
            }
            //html
            else if (filename.includes(".html"))
            {
                includes.sendHTML(result, fullPath);
                return true;
            }
            return false;
        }
    };
