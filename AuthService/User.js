const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    googleId: String,
    name: String,
    email: String,
    picture: String,
    number: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model("user", UserSchema);
