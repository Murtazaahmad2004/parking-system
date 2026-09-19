require("dotenv").config();
const express = require("express"); // Express ek framework hai jo server banana bahut aasaan kar deta hai.
const mongoose = require("mongoose"); // Ye MongoDB ko use karne ke liye hai Mongoose ek bridge hai.
const cors = require("cors"); // Frontend ko backend se request bhejne ki permission hai
const SignupModel = require("./models/signup");
const LoginHistory = require("./models/loginhistory");
const BookingForm = require("./models/booking");
const AddStaff = require("./models/addstaff");
const slotRoutes = require("./routes/slotRoutes");
const Plan = require("./models/plan");
const Slot = require("./models/slot");
const bcrypt = require("bcryptjs");
const emailRoutes = require("./routes/emailRoutes");

const app = express(); //Express ko use karke application banai ja rahi hai.
app.use(express.json()); // Frontend say data JSON format ma send krna
app.use(cors()); // Request aur Response ke beech chalne wala function.

mongoose.connect("mongodb://localhost:27017/parkflow");

// ==================== Routes ====================
// ---------- SIGN UP ----------
app.post("/signup", async (req, res) => {
  try {
    const { userid, name, email, password } = req.body;

    if (!userid || !name || !email || !password) {
      return res.json({
        status: "Please fill all fields",
      });
    }

    const existingUser = await SignupModel.findOne({ email });

    if (existingUser) {
      return res.json({
        status: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10)

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
    res.status(500).json(err);
  }
});

// ---------- LOGIN ----------
// async function ka use kiya gaya hai kyunki database se data fetch karna time-consuming ho
// sakta hai aur hum chahte hain ki server is process ke complete hone tak wait kare.

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

    const user = await SignupModel.findOne({ email });

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

    // ---------- LOGIN HISTORY ----------
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
    res.status(500).json(err);
  }
});

// ---------- BOOKING FORM ----------
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
    // CHECK REQUIRED FIELDS
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
    // CURRENT DATE & TIME
    // =========================

    const now = new Date();

    // =========================
    // CHECK USER ACTIVE BOOKING
    // =========================

    const userBookings = await BookingForm.find({
      userid,
      status: "active",
    });

    for (const booking of userBookings) {
      const bookingEnd = new Date(
        `${booking.enddate}T${booking.endtime}`
      );

      if (bookingEnd <= now) {
        await BookingForm.findOneAndUpdate(
          {
            bookingid: booking.bookingid,
          },
          {
            status: "completed",
          }
        );
      }
    }

    // =========================
    // CHECK USER STILL HAS ACTIVE BOOKING
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
    // CHECK SLOT + AREA
    // =========================

    const existingSlotBooking = await BookingForm.findOne({
      slot: slot,
      area: area,
      status: "active",
    });

    if (existingSlotBooking) {
      return res.status(400).json({
        message:
          `Slot ${slot} is already booked in ${area}. Please select another slot.`,
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

// ---------- ADD STAFF ----------
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
    res.status(500).json(err);
  }
});

// ADD NEW PLAN
app.post("/plan", async (req, res) => {
  try {
    const {  planname, price, features, duration, durationtype,  } = req.body;

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
    res.status(500).json(err)
  }
});

// ---------- GET BOOKINGS ----------
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await BookingForm.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------- GET STAFF ----------
app.get("/addstaff", async (req, res) => {
  try {
    const staff = await AddStaff.find();
    res.json(staff);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ---------- GET ROUTES ----------
app.use("/api", slotRoutes);

app.use("/email", emailRoutes);

app.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/slots", async (req, res) => {
  try {
    // Database se saare slots lao
    const slots = await Slot.find();

    // Parking areas
    const areas = [
      "basement",
      "groundfloor",
      "firstfloor",
      "secondfloor",
    ];

    // Current date/time
    const now = new Date();

    // Sirf active bookings lao
    const activeBookings = await BookingForm.find({
      status: "active",
    });

    // Expired bookings ko completed karo
    for (const booking of activeBookings) {
      const bookingEnd = new Date(
        `${booking.enddate}T${booking.endtime}`
      );

      if (bookingEnd <= now) {
        await BookingForm.findOneAndUpdate(
          { bookingid: booking.bookingid },
          { status: "completed" }
        );
      }
    }

    // Expired bookings update hone ke baad
    // fresh active bookings dobara lao
    const currentBookings = await BookingForm.find({
      status: "active",
    });

    // Final result
    const result = [];

    // Har area ke andar har slot check karo
    for (const area of areas) {
      for (const slot of slots) {

        // Check karo kya SAME slot
        // SAME area mein already booked hai
        const isBooked = currentBookings.some(
          (booking) =>
            booking.slot === slot.slot &&
            booking.area === area
        );

        // Result mein slot + area + availability bhejo
        result.push({
          slot: slot.slot,
          area: area,
          available: !isBooked,
        });
      }
    }

    // Frontend ko result bhejo
    res.json(result);

  } catch (err) {
    console.log("SLOTS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch slots",
      error: err.message,
    });
  }
});

app.get("/booking/:userid", async (req, res) => {
  try {
    const { userid } = req.params;

    const bookings = await BookingForm.findOne({ userid });

    if(!bookings) {
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

app.get("/booked-slots", async (req, res) => {
  try {
    const totalSlots = await Slot.countDocuments();
    const bookedSlots = await BookingForm.countDocuments();

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

// DELETE ROUTES 
app.delete("/booking/:bookingid", async (req, res) => {
  try {
    const booking = await BookingForm.findOne({
      bookingid: req.params.bookingid,
    });

    if(!booking) {
      return res.status(404).json({
        message: "Booking Not Found."
      });
    }

    await Slot.findOneAndUpdate(
      { slot: booking.slot },
      { status: "available" }
    );

    await BookingForm.findOneAndUpdate(
      {
        bookingid: req.params.bookingid,
      },
      {
        status: "cancelled",
      }
    );
    
    res.json({
      status: "Success",
      message: "Booking Cancelled",
    });

  } catch (err) {
    res.status(500).json({
      err: err.message,
    });
  }
});

app.listen(3001, () => {
  console.log("server is running");
});