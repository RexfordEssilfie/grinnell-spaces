const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassroomSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      alias: "id"
    },
    name:{
        type: Schema.Types.String
    },
    floor:{
        type: Schema.Types.Number
    },
    building:{
        type: Schema.Types.ObjectId,
        ref: "Building",
        required: true
    },
    capacity:{
      type: Schema.Types.Number,
    },
    occupied:{
      type: Schema.Types.Number
    }
  },
  {
    timestamps:true
  }
);

const Classroom = mongoose.model("Classroom", ClassroomSchema);

module.exports = Classroom;
