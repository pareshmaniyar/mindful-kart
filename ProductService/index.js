const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const mongoose = require('mongoose');
const Product = require('./Product');
const app = express();
const {
    PORT,
    mongodbURL,
    CREATE_PRODUCT,
    READ_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT
} = require('./constants');

mongoose.connect(
    mongodbURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('MongoDB is now in the party!');
    }
);

app.use(express.json());
app.use(logger('dev'));
app.post(CREATE_PRODUCT, (req, res) => {
    const productProperties = req.body;
    const newProduct = new Product({ sellerId: "Dummy", productProperties });
    newProduct.save(err => {
        if (err) return res.status(500).send(err);
        return res.status(200).send({
            id: newProduct._id,
            ...newProduct.productProperties
        });
    });
});

app.get(READ_PRODUCT, async (req, res) => {
    // comma separated id values
    const { id } = req.query;
    let result;
    if(!id) {
        result = await Product.find({ deleted : false });
    } else {
        result = await Product.find({ 
            _id: {
                $in: id.split(',')
            },
            deleted : false
        });
    }
    res.send(result.map(product => ({
        id: product._id,
        ...product.productProperties
    })));
});

app.patch(UPDATE_PRODUCT, (req, res) => {
    const { id } = req.query;
    const productProperties = req.body;
    let update = {};
    Object.keys(productProperties).forEach(key => {
        update[`productProperties.${key}`] = productProperties[key];
    });
    Product.findByIdAndUpdate(id, { $set: { ...update } }, { new: true }, (err, result) => {
        if(err) return res.status(500).send(err);
        res.send({
            id: result._id,
            ...result.productProperties
        });
    });
});

app.delete(DELETE_PRODUCT, (req, res) => {
    // delete flag is made to true
    const { id } = req.query;
    Product.findByIdAndUpdate(id, { deleted: true }, { new: true }, (err, result) => {
        if(err) return res.status(500).send(err);
        res.json({ deleted: true });
    });
});

app.use(function(req, res, next) {
    next(createError(404));
});

app.listen(PORT, (req, res) => {
    console.log("Party has begun at port " + PORT);
});
