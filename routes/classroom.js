var express = require("express");
const Building = require("../models/building");
const Classroom = require("../models/classroom");
var router = express.Router();
const { ObjectId } = require("mongodb");


// Creating a new classroom
router.post("/", async function (req, res, next) {
  try {
    const { buildingId } = req.body;
    const existingBuilding = await Building.findById(buildingId);

    if (existingBuilding) {
      const { name, floor, occupied } = req.body;
      const newClassroom = new Classroom({
        id: new ObjectId(),
        name,
        floor,
        occupied,
        building: existingBuilding.id,
      });
      const addedClassroom = await newClassroom.save();

      res.send({
        success: true,
        classroom: addedClassroom.populate('building'),
        message: "Classroom successfully added!",
      });
    } else {
      throw new Error('Classroom could not be added')
    }
  } catch (error) {
      console.log(error)
    res.status(500).send({
      message: "Classroom could not be added",
      success: false,
    });
  }
});

// Getting all classrooms
router.get("/", async function (req, res, next) {
  try {
    const { buildingName } = req.query;
    console.log(buildingName)
    const building = await Building.findOne({ name: buildingName });
    console.log(building)

    if (!building) {
      res.send({
        message: "Building for the classroom does not exist",
        success: false,
      });
    }

    const allClassrooms = await Classroom.find({ building: building.id }).populate('building');
    console.log({allClassrooms})

    res.send({
      success: true,
      message: "Retrieved all classrooms",
      classrooms: allClassrooms,
    });
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: "Classrooms could not be retrieved",
      error,
    });
  }
});

// Getting specific classroom
router.get("/:name", async function (req, res, next) {
  try {
    const { name } = req.params;
    const classroom = await Classroom.find({ name });
    res.send({ success: true, message: "Retrieved classroom", classroom });
  } catch (error) {
    res.status(500).send({ success: false, message: "Classroom could not be found" });
  }
});

// Update specific classroom
router.post("/:name", async function (req, res, next) {
  try {
    const { name } = req.params;
    const updatedClassroom = await Classroom.findOneAndUpdate(
      { name },
      req.body
    );
    res.send({
      success: true,
      message: "Retrieved classroom",
      classroom: updatedClassroom.populate('building'),
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Classroom could not be updated" });
  }
});

module.exports = router;
