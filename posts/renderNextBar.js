const isValidPage = function(page, postsPerPage, totalPosts)
{
    return (!(page === 0 || page -1 >= totalPosts/postsPerPage));
};


module.exports=
    {
        main: function(baseURL, currentPage, postsPerPage, totalPosts)
        {
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

            return "    <div class=\"row\">\n" +
                "        <div class=\"col-6\">" + newerPosts + "</div>\n" +
                "        <div class=\"col-6\"><span class=\"float-right\">" + olderPosts + "</span></div>\n" +
                "    <br><br></div>";
        }
    };