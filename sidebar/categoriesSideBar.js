const Promise = require('promise');
const sql = require('../utils/sql');

module.exports=
    {
        /**
         * Responsible for querying the database and displaying all
         * categories that the blog has in the sidebar
         *
         * @param res
         * @return {*|Promise}
         */
        main: function(res)
        {
            return new Promise(function(resolve, reject)
            {
                res.write("<div class=\"w3-col l4\">");
                sql.getCategories().then(function(categories)
                {
                    console.log(categories[0].name);
                    console.log("cool beans");
                    // for(var category in categories)
                    // {
                    //     console.log(category);
                    //     res.write(category.name);
                    // }
                    res.write("</div>");
                    resolve();
                })
            });
        }
    };

/*
    <!-- Labels / tags -->

    <div class="w3-card w3-margin">

        <div class="w3-container w3-padding">

            <h4>Tags</h4>

        </div>

        <div class="w3-container w3-white">

            <p><span class="w3-tag w3-black w3-margin-bottom">Travel</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">New York</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">London</span>

                <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">IKEA</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">NORWAY</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">DIY</span>

                <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Ideas</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Baby</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Family</span>

                <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">News</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Clothing</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Shopping</span>

                <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Sports</span> <span class="w3-tag w3-light-grey w3-small w3-margin-bottom">Games</span>

            </p>

        </div>

    </div>
 */