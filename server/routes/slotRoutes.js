const express = require("express");
const router = express.Router();
const Slot = require("../models/slot");

// Add multiple slots
router.post("/slots", async (req, res) => {
  try {
    const savedSlots = await Slot.insertMany(req.body);

    res.status(201).json({
      message: "Slots added successfully",
      data: savedSlots,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
});

router.get("/slots", async (req, res) => {
  try {
    const slots = await Slot.find({
      status: "available",
    });

    res.json(slots);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;