/**
 * Determines if the requested page is out of bounds
 *
 * @param page current page
 * @param postsPerPage - number of blog rendered on each page
 * @param totalPosts - total blog in this category/total
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
         * @param postsPerPage -- number of blog on each page
         * @param totalPosts -- total amount of blog in the category
         * @returns {Promise} promise which renders the buttons
         */
        main: function(baseURL, currentPage, postsPerPage, totalPosts, templateContext)
        {
            if(typeof currentPage == "undefined")
                currentPage = 1;
            currentPage = Number(currentPage);

            if(!isValidPage(currentPage, postsPerPage, totalPosts))
            {
                reject("Invalid Page");
            }

            var paginationObject = new Object();

            var nextPage = currentPage + 1;
            var previousPage = currentPage - 1;

            if (isValidPage(previousPage, postsPerPage, totalPosts))
            {
                paginationObject.previous = {url: baseURL + "?page=" + previousPage};
            }

            if (isValidPage(nextPage, postsPerPage, totalPosts))
            {
                paginationObject.next = {url: baseURL + "?page=" + nextPage};
            }

            var page = 1;
            var pages = [];
            while(isValidPage(page, postsPerPage, totalPosts))
            {
                if(page === currentPage)
                {
                    pages.push({isCurrent: true, number: page})
                }
                else
                {
                    pages.push({number: page, url: baseURL + "?page=" + page})
                }
                page = page + 1;
            }
            paginationObject.pages = pages;
            templateContext.pagination = paginationObject;
        }
    };