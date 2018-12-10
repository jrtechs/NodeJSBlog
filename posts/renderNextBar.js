/**
 * Determines if the requested page is out of bounds
 *
 * @param page current page
 * @param postsPerPage - number of posts rendered on each page
 * @param totalPosts - total posts in this category/total
 * @returns {boolean} if this is a valid page
 */
const isValidPage = function(page, postsPerPage, totalPosts)
{
    return !(page === 0 || page -1 >= totalPosts/postsPerPage);
};

module.exports=
    {
        /**
         * Renders two buttons on the bottom of the page to
         * go to the left or right
         *
         * Used by the home page and categories pages
         * @param baseURL -- base url of page being rendered
         * @param currentPage -- current page being rendered
         * @param postsPerPage -- number of posts on each page
         * @param totalPosts -- total amount of posts in the category
         * @returns {Promise} promise which renders the buttons
         */
        main: function(baseURL, currentPage, postsPerPage, totalPosts)
        {
            return new Promise(function(resolve, reject)
            {

                if(!isValidPage(currentPage, postsPerPage, totalPosts))
                {
                    reject("Invalid Page");
                }

                var nextPage = currentPage + 1;
                var previousPage = currentPage - 1;

                var olderPosts = "";
                var newerPosts = "";

                if (isValidPage(previousPage, postsPerPage, totalPosts))
                {
                    newerPosts = "<button class=\"btn btn-secondary btn-lg " +
                        "w3-padding-large w3-white w3-border\"  onclick=\"location.href='" +
                        baseURL + "?page=" + previousPage +
                        "'\"><b>Newer Posts &raquo;</b></button>";
                }

                if (isValidPage(nextPage, postsPerPage, totalPosts))
                {
                    olderPosts = "<button class=\"btn btn-secondary btn-lg " +
                        "w3-padding-large w3-white w3-border\"  onclick=\"location.href='" +
                        baseURL + "?page=" + nextPage +
                        "'\"><b>Older Posts &raquo;</b></button>";
                }

                resolve("    <div class=\"row\">\n" +
                    "        <div class=\"col-6\">" + newerPosts + "</div>\n" +
                    "        <div class=\"col-6\"><span class=\"float-right\">" + olderPosts + "</span></div>\n" +
                    "    <br><br></div>");
            })

        }
    };