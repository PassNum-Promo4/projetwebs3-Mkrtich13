const router = require('express').Router();

const algoliasearch = require('algoliasearch');
const client = algoliasearch("7HHOE4AN7I","e01a56c555d0621c31aa31a2028ecf19");
const index = client.initIndex('wittov1');



router.get('/', (req, res, next) => {
    if (req.query.query) {
        index.search({
            query: req.query.query,
            page: req.query.page,
        }, (err, content) => {
            res.json({
                success: true,
                message: "Voici votre recherche",
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }
});

module.exports = router;