const utils = require('../utils/utils.js');

var Promise = require('promise');

module.exports=
{
    /**
     * renderPost() displays a single blog post in it's entirety
     *
     * @param res result sent to user
     * @param post sql data about the blog post
     * @return {*|Promise}
     */
    renderPost: function(res, post)
    {
        return new Promise(function (resolve, reject)
        {
            res.write("<div class=\"w3-card-4 w3-margin w3-white\">");
            //image
            res.write("<div class=\"w3-container\">");
            //title
            res.write("<h3><b>" + post.name + "</b></h3>");
            //date
            res.write("<h5><span class=\"w3-opacity\">" + post.date + "</span></h5>");
            res.write("</div>");

            res.write("<div class=\"w3-container\">");
            //include page content
            utils.include(res, "../entries/" + post.url + ".html").then(function (value) {
                res.write("</div></div>");
                resolve();
            });
        });
    }
};

/*

<div class="w3-card-4 w3-margin w3-white">

    <img src="/w3images/woods.jpg" alt="Nature" style="width:100%">

    <div class="w3-container">

        <h3><b>TITLE HEADING</b></h3>

        <h5>Title description, <span class="w3-opacity">Date</span></h5>

    </div>



    <div class="w3-container">
        content

    </div>

</div>

 */