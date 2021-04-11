const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

const UserSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      alias: "id"
    },
    email:{
        type: Schema.Types.String,
        unique: true,
    },
    password:{
        type: Schema.Types.String
    }
  },
  {
    timestamps: true
  }
);

//Schema methods
UserSchema.methods.validPassword = async function (password) {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
  };

const User = mongoose.model("User", UserSchema);

module.exports = User;
