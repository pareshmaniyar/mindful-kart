const PORT = 3000;
const mongodbURL = 'mongodb://localhost/product-service';
const CREATE_PRODUCT = '/add-product';
const READ_PRODUCT = '/read-product';
const UPDATE_PRODUCT = '/update-product';
const DELETE_PRODUCT = '/delete-product';
module.exports = {
    PORT,
    mongodbURL,
    CREATE_PRODUCT,
    READ_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT
};
// TODO: setup babel for commonjs
