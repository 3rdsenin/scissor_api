const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    id: ObjectId,
    created_at: Date,
    firstname: {
        type: String,
        required: [true, 'Please enter a first name']
    },
    lastname: {
        type: String,
        required: [true, 'Please enter a last name']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'Please enter an email'],
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    }
});

UserSchema.post('save', (doc, next) => {

    next();
});

UserSchema.pre('save', async function(next) {
    const hashedpassword = await bcrypt.hash(this.password, 10);
    this.password = hashedpassword;
    next();
})

const User = mongoose.model('User', UserSchema);
module.exports = User;

//