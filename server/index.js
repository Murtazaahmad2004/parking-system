require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const SignupModel = require("./models/signup");
const LoginHistory = require("./models/loginhistory");
const BookingForm = require("./models/booking");
const AddStaff = require("./models/addstaff");
const Plan = require("./models/plan");
const Slot = require("./models/slot");

const slotRoutes = require("./routes/slotRoutes");
const emailRoutes = require("./routes/emailRoutes");

const bcrypt = require("bcryptjs");

const app = express();

// ================================
// MIDDLEWARE
// ================================

app.use(express.json());
app.use(cors());

// ================================
// MONGODB CONNECTION
// ================================

mongoose
  .connect("mongodb://localhost:27017/parkflow")
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// ================================
// SIGN UP
// ================================

app.post("/signup", async (req, res) => {
  try {
    const { userid, name, email, password } = req.body;

    if (!userid || !name || !email || !password) {
      return res.json({
        status: "Please fill all fields",
      });
    }

    const existingUser = await SignupModel.findOne({
      email,
    });

    if (existingUser) {
      return res.json({
        status: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await SignupModel.create({
      userid,
      name,
      email,
      password: hashedPassword,
    });

    res.json({
      status: "Success",
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// LOGIN
// ================================

app.post("/login", async (req, res) => {
  try {
    const pakistanDate = new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Karachi",
    });

    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: "Please fill all fields",
      });
    }

    const user = await SignupModel.findOne({
      email,
    });

    if (!user) {
      return res.json({
        status: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        status: "Invalid Email Password",
      });
    }

    // LOGIN HISTORY

    await LoginHistory.create({
      userid: user.userid,
      name: user.name,
      email: user.email,
      role: user.role,
      status: "Success",
      loginTime: pakistanDate,
    });

    res.json({
      status: "Success",

      user: {
        userid: user.userid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// BOOKING FORM
// ================================

app.post("/bookingform", async (req, res) => {
  try {
    const {
      userid,
      bookingid,
      name,
      email,
      cnic,
      phonenumber,
      vehiclenumber,
      vehicletype,
      slot,
      area,
      plan,
      price,
      bookingdate,
      enddate,
      bookingtime,
      endtime,
    } = req.body;

    // =========================
    // REQUIRED FIELDS
    // =========================

    if (
      !userid ||
      !bookingid ||
      !name ||
      !email ||
      !cnic ||
      !phonenumber ||
      !vehiclenumber ||
      !vehicletype ||
      !slot ||
      !area ||
      !plan ||
      !price ||
      !bookingdate ||
      !enddate ||
      !bookingtime ||
      !endtime
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // =========================
    // CURRENT DATE
    // =========================

    const now = new Date();

    // =========================
    // USER ACTIVE BOOKINGS
    // =========================

    const userBookings = await BookingForm.find({
      userid,
      status: "active",
    });

    // =========================
    // COMPLETE EXPIRED BOOKINGS
    // =========================

    for (const booking of userBookings) {
      const bookingEnd = new Date(`${booking.enddate}T${booking.endtime}`);

      if (bookingEnd <= now) {
        await BookingForm.findOneAndUpdate(
          {
            bookingid: booking.bookingid,
          },
          {
            status: "completed",
          },
        );
      }
    }

    // =========================
    // CHECK ACTIVE USER BOOKING
    // =========================

    const existingUserBooking = await BookingForm.findOne({
      userid,
      status: "active",
    });

    if (existingUserBooking) {
      return res.status(400).json({
        message:
          "You already have an active booking. Please wait until it expires.",
      });
    }

    // =========================
    // CHECK SLOT BOOKING
    // =========================

    const existingSlotBooking = await BookingForm.findOne({
      slot: slot,
      area: area,
      status: "active",
    });

    if (existingSlotBooking) {
      return res.status(400).json({
        message: `Slot ${slot} is already booked in ${area}. Please select another slot.`,
      });
    }

    // =========================
    // CREATE BOOKING
    // =========================

    const bookingform = await BookingForm.create({
      userid,
      bookingid,
      name,
      email,
      cnic,
      phonenumber,
      vehiclenumber,
      vehicletype,
      slot,
      area,
      plan,
      price,
      bookingdate,
      enddate,
      bookingtime,
      endtime,

      status: "active",
    });

    // =========================
    // RESPONSE
    // =========================

    return res.json({
      status: "Success",

      bookingform,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: err.message,
    });
  }
});

// ================================
// ADD STAFF
// ================================

app.post("/addstaff", async (req, res) => {
  try {
    const { staffid, name, email, role, salary, cnic, phone, age } = req.body;

    const addstaff = await AddStaff.create({
      staffid,
      name,
      email,
      role,
      salary,
      cnic,
      phone,
      age,
    });

    res.json({
      status: "Success",

      addstaff,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// ADD NEW PLAN
// ================================

app.post("/plan", async (req, res) => {
  try {
    const { planname, price, features, duration, durationtype } = req.body;

    const plan = await Plan.create({
      planname,
      price,
      features,
      duration,
      durationtype,
    });

    res.json({
      status: "Success",

      plan,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// GET BOOKINGS
// ================================

app.get("/bookings", async (req, res) => {
  try {
    const bookings = await BookingForm.find();

    res.json(bookings);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// GET STAFF
// ================================

app.get("/addstaff", async (req, res) => {
  try {
    const staff = await AddStaff.find();

    res.json(staff);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// SLOT ROUTES
// ================================

app.use("/api", slotRoutes);

// ================================
// EMAIL ROUTES
// ================================

app.use("/email", emailRoutes);

// ================================
// GET PLANS
// ================================

app.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find();

    res.json(plans);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// =====================================================
// GET SLOTS
// =====================================================

app.get("/slots", async (req, res) => {
  try {
    // ================================
    // GET SELECTED AREA
    // ================================

    const { area } = req.query;

    // ================================
    // CURRENT DATE & TIME
    // ================================

    const now = new Date();

    // ================================
    // GET ACTIVE BOOKINGS
    // ================================

    const activeBookings = await BookingForm.find({
      status: "active",
    });

    // ================================
    // COMPLETE EXPIRED BOOKINGS
    // ================================

    for (const booking of activeBookings) {
      const bookingEnd = new Date(`${booking.enddate}T${booking.endtime}`);

      if (bookingEnd <= now) {
        await BookingForm.findOneAndUpdate(
          {
            bookingid: booking.bookingid,
          },

          {
            status: "completed",
          },
        );
      }
    }

    // ================================
    // GET FRESH ACTIVE BOOKINGS
    // ================================

    const currentBookings = await BookingForm.find({
      status: "active",
    });

    // ================================
    // GET ALL 100 SLOTS
    // ================================

    const slots = await Slot.find().sort({
      slot: 1,
    });

    // ================================
    // FILTER SLOTS ACCORDING TO AREA
    // ================================

    let filteredSlots = [];

    // -------------------------------
    // BASEMENT
    // A1 - A25
    // -------------------------------

    if (area === "basement") {
      filteredSlots = slots.filter((slot) => {
        const match = slot.slot.match(/^A([0-9]+)$/);

        if (!match) {
          return false;
        }

        const number = Number(match[1]);

        return number >= 1 && number <= 25;
      });
    }

    // -------------------------------
    // GROUND FLOOR
    // B1 - B25
    // -------------------------------
    else if (area === "groundfloor") {
      filteredSlots = slots.filter((slot) => {
        const match = slot.slot.match(/^B([0-9]+)$/);

        if (!match) {
          return false;
        }

        const number = Number(match[1]);

        return number >= 1 && number <= 25;
      });
    }

    // -------------------------------
    // FIRST FLOOR
    // C1 - C25
    // -------------------------------
    else if (area === "firstfloor") {
      filteredSlots = slots.filter((slot) => {
        const match = slot.slot.match(/^C([0-9]+)$/);

        if (!match) {
          return false;
        }

        const number = Number(match[1]);

        return number >= 1 && number <= 25;
      });
    }

    // -------------------------------
    // SECOND FLOOR
    // D1 - D25
    // -------------------------------
    else if (area === "secondfloor") {
      filteredSlots = slots.filter((slot) => {
        const match = slot.slot.match(/^D([0-9]+)$/);

        if (!match) {
          return false;
        }

        const number = Number(match[1]);

        return number >= 1 && number <= 25;
      });
    }

    // ================================
    // NO AREA SELECTED
    // ================================
    else {
      filteredSlots = [];
    }

    // ================================
    // NATURAL ASCENDING ORDER
    // ================================

    filteredSlots.sort((a, b) => {
      const numA = parseInt(a.slot.slice(1), 10);
      const numB = parseInt(b.slot.slice(1), 10);

      return numA - numB;
    });

    // ================================
    // CHECK AVAILABILITY
    // ================================

    const result = filteredSlots.map((slot) => {
      const isBooked = currentBookings.some(
        (booking) => booking.slot === slot.slot && booking.area === area,
      );

      return {
        slot: slot.slot,

        available: !isBooked,
      };
    });

    // ================================
    // RESPONSE
    // ================================

    res.json(result);
  } catch (err) {
    console.log("SLOTS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch slots",

      error: err.message,
    });
  }
});

// ================================
// GET SINGLE BOOKING
// ================================

app.get("/booking/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const bookings = await BookingForm.findOne({
      userid,
    });

    if (!bookings) {
      return res.status(404).json({
        message: "Booking Not Found",
      });
    }

    res.json(bookings);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// GET ALL USER BOOKINGS
// ================================

app.get("/mybookings/:userid", async (req, res) => {
  try {
    const bookings = await BookingForm.find({
      userid: req.params.userid,
    });

    res.json(bookings);
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

// ================================
// BOOKED SLOTS
// ================================

app.get("/booked-slots", async (req, res) => {
  try {
    const totalSlots = await Slot.countDocuments();

    const bookedSlots = await BookingForm.countDocuments({
      status: "active",
    });

    const availableSlots = totalSlots - bookedSlots;

    res.json({
      totalSlots,

      bookedSlots,

      availableSlots,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// ================================
// CANCEL BOOKING
// ================================

app.delete("/booking/:bookingid", async (req, res) => {
  try {
    const booking = await BookingForm.findOne({
      bookingid: req.params.bookingid,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking Not Found.",
      });
    }

    await BookingForm.findOneAndUpdate(
      {
        bookingid: req.params.bookingid,
      },

      {
        status: "cancelled",
      },
    );

    res.json({
      status: "Success",

      message: "Booking Cancelled",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      status: "Error",

      message: err.message,
    });
  }
});

// ================================
// SERVER
// ================================

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
