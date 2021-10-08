const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    productProperties: Schema.Types.Mixed,
    deleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    sellerId: String
});

module.exports = mongoose.model("product", ProductSchema);
