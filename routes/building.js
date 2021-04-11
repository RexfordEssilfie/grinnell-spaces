var express = require("express");
const Building = require("../models/building");
var router = express.Router();
const { ObjectId } = require("mongodb");

router.post("/", async function (req, res, next) {
  try {
    const { name, startHours, endHours } = req.body;
    const existingBuilding = await Building.findOne({ name });

    if (existingBuilding) {
      res.send({ message: "Building already exists", success: false });
    } else {
      const newBuilding = new Building({
        name,
        startHours,
        endHours,
        id: new ObjectId(),
      });
      await newBuilding.save();
      res.status(500).send({
        message: "Building successfully created",
        success: true,
        building: newBuilding,
      });
    }
  } catch (error) {
    //res.send({ success: false, message: "Building could not be created" });
    throw error;
  }
});

router.get("/", async function (req, res, next) {
  try {
    const allBuildings = await Building.find();
    res.send({
      success: true,
      message: "Retrieved all buildings",
      buildings: allBuildings,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Building could not be created" });
  }
});

router.get("/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const building = await Building.findById(id);
    if (!building) {
      throw Error("Building not found");
    }
    res.send({ success: true, message: "Retrieved building", building });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Building could not be found" });
    throw error;
  }
});

module.exports = router;
