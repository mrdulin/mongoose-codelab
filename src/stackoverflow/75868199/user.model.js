const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: "Name is required",
  },
});
module.exports = mongoose.model("User", UserSchema);