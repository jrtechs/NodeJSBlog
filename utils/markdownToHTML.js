const pandoc = require('node-pandoc');
// const args = '-t html5';

const args = '-S --base-header-level=1 --toc --toc-depth=6 -N --normalize -s --mathjax -t html5';

console.log("");
module.exports=
    {
        convertToHTML: function(markdownContents)
        {
            return new Promise(function(resolve, reject)
            {
                // Set your callback function
                callback = function (err, result)
                {
                    if (err)
                    {
                        reject(err);
                    }
                    resolve(result);
                };
                pandoc(markdownContents, args, callback);
            });
        },
    }
