const User = require("./user.model");

const getUser = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    console.log("🚀 ~ file: user.controller.js:6 ~ getUser ~ findOne:", User.findOne)
    return res.status(200).json(user);
  } catch (err) {
    console.error(`Error finding user ${req.body.name}:`, err);
    return res.status(500).json({ message: err });
  }
}

module.exports = {
  getUser
}