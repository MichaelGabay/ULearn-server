const jwt = require('jsonwebtoken')
const { secretTokenWord } = require('../../../config/secret')

exports.authUser = (req, res, next) => {
  try {
    let token = req.header("apiKey")
    if (!token) return res.json({ msg: "you don't have a token for this end-point" }).status(400)
    let decodeToken = jwt.verify(token, secretTokenWord)
    req.tokenData = decodeToken
    next()
  }
  catch (err) {
    res.json({ err, msg: "invalid decodeing" })
  }
}

exports.authAdmin = (req, res, next) => {
  let token = req.header("apiKey")
  if (!token) return res.json({ msg: "you don't have a token for this end-point" })
  try {
    let decodeToken = jwt.verify(token, secretTokenWord)
    if (decodeToken.userData.role === "admin") {
      req.tokenData = decodeToken
      next()
    }
    else return res.json({ msg_err: "you must to be admin to be in this end-point" })
  }
  catch (err) {
    res.json(err)
  }
}