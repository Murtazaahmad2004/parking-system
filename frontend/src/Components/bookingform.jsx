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
  hidden: { opacity: 0, y: 60 }, // simple 60 mean 60px ha (element 60px neeche shift hoga (vertical position down))
  visible: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // har child element 0.2 seconds ke gap se animate hoga
    },
  },
};

function BookingForm() {
  const navigate = useNavigate();
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

  const generateBookId = () => {
    const book = "PF-2026-BOOK";

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `${book}-${randomId}`;

    console.log(bookingId);

    setBookingid(bookingId);
  };

  useEffect(() => {
    document.title = "Booking Form - ParkFlow";

    axios
      .get("http://localhost:3001/plans")
      .then((result) => {
        console.log(result.data);
        setPlans(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/slots")
      .then((result) => {
        console.log(result.data);
        setSlots(result.data);
      })
      .catch((err) => console.log(err));
    generateBookId();
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if (loggedInUser) {
      setUser(loggedInUser);
      setUserid(loggedInUser.userid);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");

    navigate("/loginsignup");
  };

  // SCROLL TOP
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePlanChange = (e) => {
    const selectedPlan = e.target.value;
    setPlan(selectedPlan);

    //plans array me us object ko dhoondo jiska planname user ke selected plan ke barabar ho.
    const selected = plans.find((plan) => plan.planname === selectedPlan);
    if (!selected) return;

    setPrice(selected.price);

    const today = new Date();
    setBookingdate(today.toISOString().split("T")[0]);

    const CurrentTime =
      String(today.getHours()).padStart(2, "0") +
      ":" +
      String(today.getMinutes()).padStart(2, "0");

    setBookingtime(CurrentTime);

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
    )
      return;

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

    sessionStorage.setItem("bookingData", JSON.stringify(result));
    navigate("/paymentscreen");
  };

  return (
    <>
      {/* HEADER AND NAVIGATION */}
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

          {/* DROPDOWN */}
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
                  whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
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
      {/* sidebar */}
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
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
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
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
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
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
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
      {/* BOOKING FORM */}
      <div className="booking-form-container">
        <div className="booking-form">
          <h2>Booking Form</h2>
          <form onSubmit={handleSubmit}>
            <motion.div
              className="booking-form-wrapper"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.8 }}
            >
              <div className="booking-form-content">
                <label htmlFor="userid">User ID:</label>
                <input
                  type="text"
                  id="userid"
                  value={userid}
                  readOnly
                  required
                />

                <label htmlFor="bookingid">Booking ID:</label>
                <input
                  type="text"
                  id="bookingid"
                  value={bookingid}
                  readOnly
                  required
                />

                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  required
                />

                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />

                <label htmlFor="id-card">CNIC:</label>
                <input
                  type="number"
                  id="id-card"
                  value={cnic}
                  onChange={(e) => setCnic(e.target.value)}
                  placeholder="CNIC"
                  required
                />

                <label htmlFor="p-no">Phone Number:</label>
                <input
                  type="number"
                  id="p-no"
                  value={phonenumber}
                  onChange={(e) => setPhonenumber(e.target.value)}
                  placeholder="Phone Number"
                  required
                />

                <label htmlFor="v-no">Vehicle Number:</label>
                <input
                  type="text"
                  id="v-no"
                  value={vehiclenumber}
                  onChange={(e) => setVehiclenumber(e.target.value)}
                  placeholder="Vehicle Number"
                  required
                />

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

                <label htmlFor="area">Parking Area:</label>
                <select
                  id="area"
                  name="area"
                  value={area}
                  onChange={(e) => {
                    setArea(e.target.value);
                    setSlot("");
                  }}
                  required
                >
                  <option value="">Select Area</option>
                  <option value="basement">Basement</option>
                  <option value="groundfloor">Ground Floor</option>
                  <option value="firstfloor">First Floor</option>
                  <option value="secondfloor">Second Floor</option>
                </select>
                
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
                    .filter(
                    (item) =>
                      item.area === area &&
                      item.available === true
                    )
                    .map((item) => (
                      <option
                        key={`${item.area}-${item.slot}`}
                        value={item.slot}
                      >
                        {item.slot}
                      </option>
                    ))}
                </select>

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

                <label htmlFor="booking-date">Booking Date:</label>
                <input
                  type="date"
                  id="booking-date"
                  name="booking-date"
                  value={bookingdate}
                  readOnly
                  required
                />

                <label htmlFor="end-date">Ending Date:</label>
                <input
                  type="date"
                  id="end-date"
                  name="end-date"
                  value={enddate}
                  readOnly
                  required
                />

                <label>Booking Time:</label>
                <input type="time" value={bookingtime} readOnly required />

                <label>Ending Time:</label>
                <input type="time" value={endtime} readOnly required />

                <button type="submit" className="pay-subscribe-btn">
                  <FaCheck className="pay-icon" />
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </form>
        </div>
      </div>
      {/* FOOTER */}
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
