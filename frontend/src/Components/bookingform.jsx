import { useEffect, useState } from "react";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

import {
  FaCalendarCheck,
  FaCheck,
  FaChevronDown,
  FaParking,
  FaSignOutAlt,
} from "react-icons/fa";

import "./styling/bookingform.css";

import { MdDashboard } from "react-icons/md";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

const container = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

function BookingForm() {
  const navigate = useNavigate();

  // ================================
  // STATES
  // ================================

  const [open, setOpen] = useState(false);

  const [user, setUser] = useState("");

  const [email, setEmail] = useState("");

  const [userid, setUserid] = useState("");

  const [bookingid, setBookingid] = useState("");

  const [name, setName] = useState("");

  const [cnic, setCnic] = useState("");

  const [phonenumber, setPhonenumber] = useState("");

  const [vehiclenumber, setVehiclenumber] = useState("");

  const [vehicletype, setVehicletype] = useState("");

  const [slot, setSlot] = useState("");

  const [slots, setSlots] = useState([]);

  const [area, setArea] = useState("");

  const [plan, setPlan] = useState("");

  const [plans, setPlans] = useState([]);

  const [price, setPrice] = useState("");

  const [bookingdate, setBookingdate] = useState("");

  const [enddate, setEnddate] = useState("");

  const [bookingtime, setBookingtime] = useState("");

  const [endtime, setEndtime] = useState("");

  // ================================
  // GENERATE BOOKING ID
  // ================================

  const generateBookId = () => {
    const book = "PF-2026-BOOK";

    const randomId = Math.floor(1000 + Math.random() * 9000);

    const bookingId = `${book}-${randomId}`;

    console.log(bookingId);

    setBookingid(bookingId);
  };

  // ================================
  // LOAD PLANS
  // ================================

  useEffect(() => {
    document.title = "Booking Form - ParkFlow";

    axios

      .get("http://localhost:3001/plans")

      .then((result) => {
        console.log("Plans:", result.data);

        setPlans(result.data);
      })

      .catch((err) => {
        console.log("Plans Error:", err);
      });
  }, []);

  // ================================
  // GENERATE BOOKING ID
  // ================================

  useEffect(() => {
    generateBookId();
  }, []);

  // ================================
  // GET LOGGED-IN USER
  // ================================

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if (loggedInUser) {
      setUser(loggedInUser);

      setUserid(loggedInUser.userid);

      setName(loggedInUser.name);

      setEmail(loggedInUser.email);
    }
  }, []);

  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");

    sessionStorage.removeItem("role");

    sessionStorage.removeItem("user");

    navigate("/loginsignup");
  };

  // ================================
  // SCROLL TOP
  // ================================

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,

      behavior: "smooth",
    });
  };

  // ================================
  // AREA CHANGE
  // ================================

  const handleAreaChange = async (e) => {
    const selectedArea = e.target.value;

    // Set selected area

    setArea(selectedArea);

    // Reset selected slot

    setSlot("");

    // Clear previous slots

    setSlots([]);

    // If no area selected

    if (!selectedArea) {
      return;
    }

    try {
      const result = await axios.get(
        `http://localhost:3001/slots?area=${selectedArea}`,
      );

      console.log("Selected Area:", selectedArea);

      console.log("Available Slots:", result.data);

      setSlots(result.data);
    } catch (err) {
      console.log("Slot Error:", err);
    }
  };

  // ================================
  // PLAN CHANGE
  // ================================

  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;

    setPlan(selectedPlan);

    const selected = plans.find((plan) => plan.planname === selectedPlan);

    if (!selected) {
      return;
    }

    // PRICE

    setPrice(selected.price);

    // CURRENT DATE

    const today = new Date();

    setBookingdate(today.toISOString().split("T")[0]);

    // CURRENT TIME

    const currentTime =
      String(today.getHours()).padStart(2, "0") +
      ":" +
      String(today.getMinutes()).padStart(2, "0");

    setBookingtime(currentTime);

    // END DATE

    const end = new Date(today);

    if (selected.durationtype === "month") {
      end.setMonth(end.getMonth() + selected.duration);
    }

    if (selected.durationtype === "year") {
      end.setFullYear(end.getFullYear() + selected.duration);
    }

    setEnddate(end.toISOString().split("T")[0]);

    setEndtime("23:59");
  };

  // ================================
  // SUBMIT
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      alert("Please fill all fields");

      return;
    }

    const result = {
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
    };

    sessionStorage.setItem(
      "bookingData",

      JSON.stringify(result),
    );

    navigate("/paymentscreen");
  };

  return (
    <>
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="home-header">
        <div className="home-nav-bar">
          <div className="home-logo">
            <NavLink to="#" className="home-logo-link" onClick={scrollToTop}>
              <div className="home-logo">
                <img src="/logo.png" alt="Logo" />
              </div>
            </NavLink>
          </div>

          <h1>ParkFlow</h1>

          {/* USER DROPDOWN */}

          <div
            className="dropdown-container"
            onClick={(e) => {
              e.stopPropagation();

              setOpen(!open);
            }}
          >
            <span className="user-name">{user.name}</span>

            <FaChevronDown className="icon" />

            {open && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-logo">
                    <img src="/logo.png" alt="Logo" />
                  </div>

                  <div className="dropdown-user-info">
                    <h3>{user.name}</h3>

                    <p>{user.email}</p>

                    <p>{user.userid}</p>
                  </div>
                </div>

                <hr />

                <motion.div
                  variants={fadeUp}
                  whileHover={{
                    x: 10,
                  }}
                >
                  <NavLink
                    to="/loginsignup"
                    className="user-nav-item"
                    onClick={() => {
                      scrollToTop();

                      handleLogout();
                    }}
                  >
                    <li>
                      <FaSignOutAlt className="icon" />
                      Logout
                    </li>
                  </NavLink>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* SIDEBAR */}
      {/* ========================= */}

      <div className="side-bar">
        <div className="side-bar-container">
          <motion.div
            className="side-bar-links"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="user-nav-links">
              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 10,
                }}
              >
                <NavLink to="/userhome" className="user-nav-item">
                  <li>
                    <MdDashboard className="icon" />
                    DashBoard
                  </li>
                </NavLink>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 10,
                }}
              >
                <NavLink to="/bookingform" className="user-nav-item">
                  <li>
                    <FaParking className="icon" />
                    Book Parking
                  </li>
                </NavLink>
              </motion.div>

              <motion.div
                variants={fadeUp}
                whileHover={{
                  x: 10,
                }}
              >
                <NavLink to="/mybooking" className="user-nav-item">
                  <li>
                    <FaCalendarCheck className="icon" />
                    My Booking
                  </li>
                </NavLink>
              </motion.div>
            </motion.ul>
          </motion.div>
        </div>
      </div>

      {/* ========================= */}
      {/* BOOKING FORM */}
      {/* ========================= */}

      <div className="booking-form-container">
        <div className="booking-form">
          <h2>Booking Form</h2>

          <form onSubmit={handleSubmit}>
            <motion.div
              className="booking-form-wrapper"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.8,
              }}
            >
              <div className="booking-form-content">
                {/* USER ID */}

                <label htmlFor="userid">User ID:</label>

                <input
                  type="text"
                  id="userid"
                  value={userid}
                  readOnly
                  required
                />

                {/* BOOKING ID */}

                <label htmlFor="bookingid">Booking ID:</label>

                <input
                  type="text"
                  id="bookingid"
                  value={bookingid}
                  readOnly
                  required
                />

                {/* NAME */}

                <label htmlFor="name">Name:</label>

                <input
                  type="text"
                  id="name"
                  // value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                />

                {/* EMAIL */}

                <label htmlFor="email">Email:</label>

                <input
                  type="email"
                  id="email"
                  // value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />

                {/* CNIC */}

                <label htmlFor="id-card">CNIC:</label>

                <input
                  type="number"
                  id="id-card"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="CNIC"
                  required
                />

                {/* PHONE */}

                <label htmlFor="p-no">Phone Number:</label>

                <input
                  type="number"
                  id="p-no"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  placeholder="Phone Number"
                  required
                />

                {/* VEHICLE NUMBER */}

                <label htmlFor="v-no">Vehicle Number:</label>

                <input
                  type="text"
                  id="v-no"
                  value={vehiclenumber}
                  onChange={(e) => setVehiclenumber(e.target.value)}
                  placeholder="Vehicle Number"
                  required
                />

                {/* VEHICLE TYPE */}

                <label htmlFor="v-type">Vehicle Type:</label>

                <select
                  id="v-type"
                  name="v-type"
                  value={vehicletype}
                  onChange={(e) => setVehicletype(e.target.value)}
                  required
                >
                  <option value="">Select Vehicle Type</option>

                  <option value="car">Car</option>

                  <option value="bike">Bike</option>

                  <option value="bus">Bus</option>

                  <option value="truck">Truck</option>
                </select>

                {/* ========================= */}
                {/* PARKING AREA */}
                {/* ========================= */}

                <label htmlFor="area">Parking Area:</label>

                <select
                  id="area"
                  name="area"
                  value={area}
                  onChange={handleAreaChange}
                  required
                >
                  <option value="">Select Area</option>

                  <option value="basement">Basement</option>

                  <option value="groundfloor">Ground Floor</option>

                  <option value="firstfloor">1st Floor</option>

                  <option value="secondfloor">2nd Floor</option>
                </select>

                {/* ========================= */}
                {/* PARKING SLOT */}
                {/* ========================= */}

                <label htmlFor="slot">Choose Slot:</label>

                <select
                  id="slot"
                  name="slot"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  required
                  disabled={!area}
                >
                  <option value="">
                    {area ? "Select Slot" : "First Select Area"}
                  </option>

                  {slots

                    .filter((item) => item.available === true)

                    .map((item) => (
                      <option key={item.slot} value={item.slot}>
                        {item.slot}
                      </option>
                    ))}
                </select>

                {/* ========================= */}
                {/* PLAN */}
                {/* ========================= */}

                <label htmlFor="plan">Choose Plan:</label>

                <select
                  id="plan"
                  name="plan"
                  value={plan}
                  onChange={handlePlanChange}
                  required
                >
                  <option value="">Select Plan</option>

                  {plans.map((plan) => (
                    <option key={plan._id} value={plan.planname}>
                      {plan.planname}
                    </option>
                  ))}
                </select>

                {/* PRICE */}

                <label htmlFor="price">Price:</label>

                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Price"
                  required
                />

                {/* BOOKING DATE */}

                <label htmlFor="booking-date">Booking Date:</label>

                <input
                  type="date"
                  id="booking-date"
                  name="booking-date"
                  value={bookingdate}
                  readOnly
                  required
                />

                {/* END DATE */}

                <label htmlFor="end-date">Ending Date:</label>

                <input
                  type="date"
                  id="end-date"
                  name="end-date"
                  value={enddate}
                  readOnly
                  required
                />

                {/* BOOKING TIME */}

                <label>Booking Time:</label>

                <input type="time" value={bookingtime} readOnly required />

                {/* END TIME */}

                <label>Ending Time:</label>

                <input type="time" value={endtime} readOnly required />

                {/* SUBMIT */}

                <button type="submit" className="pay-subscribe-btn">
                  <FaCheck className="pay-icon" />
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}

      <footer className="login-footer">
        <div className="login-footer-container">
          {/* LEFT */}

          <div className="login-footer-section">
            <div className="login-footer-brand">
              <div className="login-logo">
                <img src="/logo.png" alt="Logo" />
              </div>

              <h2>ParkFlow</h2>
            </div>

            <p>
              Smart parking solution to find and book parking spaces
              efficiently.
            </p>
          </div>

          {/* CENTER */}

          <div className="login-footer-section">
            <div className="login-company-policies">
              <h3>Company Policies</h3>

              <ul>
                <li>
                  <NavLink to="#" className="login-policy-link">
                    Privacy Policy
                  </NavLink>
                </li>

                <li>
                  <NavLink to="#" className="login-policy-link">
                    Terms of Service
                  </NavLink>
                </li>

                <li>
                  <NavLink to="#" className="login-policy-link">
                    Refund Policy
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT */}

          <div className="login-footer-section">
            <h3>Contact Us</h3>

            <a href="mailto:parkflow101@gmail.com" className="login-gmail">
              parkflow101@gmail.com
            </a>

            <br />

            <a
              href="https://wa.me/923001234567"
              target="_blank"
              className="login-whatsapp"
              rel="noreferrer"
            >
              +92 300 1234567
            </a>
          </div>
        </div>

        {/* BOTTOM */}

        <div className="login-footer-bottom">
          <p>© 2026 ParkFlow. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default BookingForm;
