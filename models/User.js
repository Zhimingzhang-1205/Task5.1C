const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    city: {
        type: String,
        trim: true,
        required: true
    },
    fname: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
    },
    lname: {
        type: String,
        maxlength: 50,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    cpassword: {
        type: String,
        minlength: 8,
        required: true,
        validator(value) {
            if (!(value == this.password)) {
                { throw new Error('Two passwords are not the same') }
            }
        }
    },
    address: {
        type: String,
        required: true,
    },
    address1: {
        type: String,
        required: true,
    },
    region: {
        type: String,
        required: true,
    },
    zip: String,
    phone: String,
})

module.exports = mongoose.model("User", userSchema);