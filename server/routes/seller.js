const router = require('express').Router();
const Product = require('../models/product');

const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new aws.S3({ accessKeyId: "AKIAIICNKHC2NP72NPSA", secretAccessKey: "dij6vGCxMucApjFYsWfHi7xwD40XS31HVL2S/FT8" });

const faker = require('faker');

const checkJWT = require('../middlewares/check-jwt');

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "witto",
        metadata: function(req, file, cb) {
            cb(null, { fieldName:  file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
});

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({ owner: req.decoded.user._id })
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (products) {
                    res.json({
                        success: true,
                        message: "Products",
                        products: products
                    });
                }
            });
    })
    .post([checkJWT, upload.single('product_picture')], (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.file.location;
        product.save();
        res.json({
            succes: true,
            message: 'Produit ajouté avec succès'
        });
    });


/* Just for testing */
router.get('/faker/test', (req, res, next) => {
    for (i = 0; i < 20; i++) {
        let product = new Product();
        product.category = "5b0fc3fe6800f038987b83ca";
        product.owner = "5b0bcda53d0c230198e9fff2";
        product.image = faker.image.food();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();
        product.save();
    }

    res.json({
        message: "Ajout réussi de 20 images"
    });

});


module.exports = router;




