const { handleErrors } = require('../services/auth.services');
const UserModel = require('../models/user.model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const urls = require('../controllers/url.controllers')



//controller for sign up route
module.exports.signup = async(req, res) => {

    //console.log(req.body)
    try {

        const { firstname, lastname, email, password } = req.body;

        const user = await UserModel.create({ firstname, lastname, email, password });
        const userObj = user;
        if (user) {
            delete userObj.password;
            return res.status(201).json({ message: "Successfully created user", user: userObj });

        }

        return res.json({ message: "Something went wrong" });



    } catch (error) {
        const errors = handleErrors(error);
        return res.json({ error_messages: errors });


    }

};



module.exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        let token;

        //validate user data
        if (!email || !password || password == '' || password == null || email == '' || email == null) {
            return res.status(400).json({ message: "Incomplete Input" });
        }

        const user = await UserModel.findOne({ email: email });
        //console.log(user);

        if (!user) {
            return res.json({ message: "Wrong email" });
        }

        if (user && await (bcrypt.compare(password, user.password)) === false) {
            return res.json({ message: "Wrong password" });
        }

        if (user && await (bcrypt.compare(password, user.password))) {
            token = await jwt.sign({
                    userid: user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname
                },
                process.env.jwt_secret, { expiresIn: process.env.expiry });
            req.session.token = token;

            res.status(200).json({ success: "Logged in", token: token });

        }





    } catch (error) {
        console.log(error);
        return res.status(409).json({ message: "An error occurred" + error.message });
    }

};