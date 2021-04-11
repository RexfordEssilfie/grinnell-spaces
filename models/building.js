const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BuildingSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      alias: "id"
    },
    name:{
        type: Schema.Types.String
    },
    startHours:{
        type: Schema.Types.Date,
    },
    endHours:{
        type: Schema.Types.Date
    }
  },
  {
    timestamps: true
  }
);

const Building = mongoose.model("Building", BuildingSchema);

module.exports = Building;
