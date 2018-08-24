


module.exports=
    {
        main: function(postData)
        {
            return new Promise(function(resolve, reject)
            {
                Promise.all([utils.include("./admin/addCategory.html"),
                    printCategories(),
                    processPost(postData)]).then(function(html)
                {
                    resolve("<div class=\"col-md-6\">" +
                        html.join('') +
                        "</div></div>");
                }).catch(function(error)
                {
                    console.log("error in addCategory.js");
                    reject(error);
                })
            });
        }
    };