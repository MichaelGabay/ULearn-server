const { UserModel } = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { secretTokenWord } = require('../../config/secret')
const crypto = require('crypto')
const { authValid } = require("../validations/authValidation")

exports.authCtrl = {
    signUp: async (req, res) => {
        try {
            let validation = authValid.signUp(req.body)
            if (validation.error)
                return res.json(validation.error.details)
            let user = await UserModel.findOne({ email: req.body.email })
            if (user) return res.status(400).json({ msg_err: "email already exists", code: 11000 })
            let newUser = await UserModel.create(req.body)
            newUser.password = await bcrypt.hash(req.body.password, 10)
            await newUser.save()
            newUser.password = "******"
            return res.json({ msg: "user added" })
        }
        catch (err) {
            console.log(err)
        }
    },
    login: async (req, res) => {
        let validation = authValid.login(req.body)
        if (validation.error)
            return res.json(validation.error.details)
        let { email, password } = req.body;
        email = new RegExp(email, "i");
        try {
            let user = await UserModel.findOne({ email })
            if (!user) return res.status(400).json({ msg_err: "account not found", wrongEmail: true })
            if (await bcrypt.compare(password, user.password)) {
                let userData = { _id: user._id, role: user.role, firstName: user.fullName.firstName }
                return res.json({ token: jwt.sign({ userData }, secretTokenWord) })
            }
            else return res.status(400).json({ msg_err: "wrong password please try again", wrongPassword: true })
        }
        catch (err) {
            console.log(err)
        }
    },
    loginWhithGoogle: async (req, res) => {
        let verified = req.query.verified;
        if (!verified) return res.json({ msg_err: "you are not verified" })
        let { email } = req.body;
        email = new RegExp(email, "i");
        try {
            let user = await UserModel.findOne({ email })
            if (!user) {
                return res.json({ msg_err: "account not found", wrongEmail: true }).status(400);
            }
            let userData = { _id: user._id, role: user.role, firstName: user.fullName.firstName }
            return res.json({ token: jwt.sign({ userData }, secretTokenWord) })
        }
        catch (err) {
            console.log(err)
            return res.json(err)
        }

    }

}

