import {
  FaBookmark,
  FaCalendarCheck,
  FaCar,
  FaChevronDown,
  FaParking,
  FaSignOutAlt,
} from "react-icons/fa"; // icons import kar rahi hai.
import { MdDashboard, MdSubscriptions } from "react-icons/md"; // Material Design icons import ho rahe hain.
import React, { useEffect, useState } from "react"; // page title set karne ke liye use hua hai.
import { NavLink, useNavigate } from "react-router-dom"; // Pages ke darmiyan navigation.
import { motion } from "framer-motion"; // Elements ko animate karta hai.
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"; // Dashboard graphs banane ke liye.
import "./styling/userhome.css"; // CSS file import.
import axios from "axios";
// FADE UP Ye animation object hai.
const fadeUp = {
  hidden: { opacity: 0, y: 60 }, // simple 60 mean 60px ha (element 60px neeche shift hoga (vertical position down))
  visible: { opacity: 1, y: 0 },
};
// STAGGER CONTAINER
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2, // har child element 0.2 seconds ke gap se animate hoga
    },
  },
};
// SCALE ANIMATION Element zoom effect ke sath show hota hai.
const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};
function UserHome() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [booking, setBooking] = useState("");
  const [data, setData] =useState([])
  const [stats, setStats] = useState({
    totalSlots: 0,
    availableSlots: 0,
    bookedSlots: 0,
  });

  // PAGE TITLE
  useEffect(() => {
    document.title = "User Dashboard - ParkFlow";

    axios
      .get("http://localhost:3001/booked-slots")
      .then((result) => {
        setStats(result.data);
      })
      .catch ((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const userid = sessionStorage.getItem("userid");
  axios
    .get(`http://localhost:3001/booking/${userid}`)
    .then((result) => {
      setBooking(result.data);
    })
    .catch((err) => console.log(err));
}, []);

  useEffect(() => {
    const userid = sessionStorage.getItem("userid");
    if(!userid) {
      console.log("User ID not found in sessionStorage");
      return;
    }

    axios
      .get(`http://localhost:3001/booking/${userid}`)
      .then((result) => {
        setData([
          {
            plan: result.data.plan,
            price: Number(result.data.price),
          },
        ]);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if(loggedInUser) {
      setUser(loggedInUser);
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
  // Graphs
  // const bardata = [
  //   { month: "January", profit: 500},
  //   { month: "February", profit: 1000},
  //   { month: "March", profit: 1500},
  //   { month: "April", profit: 2000},
  //   { month: "May", profit: 3300},
  //   { month: "June", profit: 4500},
  //   { month: "July", profit: 5000},
  // ];
  const donutdata = [
    { name: "available", value: 38 },
    { name: "booked", value: 7 },
  ];
  const colors = ["#28a745", "#ffc107"];
  return (
    <>
      {/* HEADER AND NAVIGATION */}
      <div className="user-home-header">
        <div className="user-home-nav-bar">
          <div className="user-home-logo">
            <NavLink
              to="#"
              className="user-home-logo-link"
              onClick={scrollToTop}
            >
              <div className="user-home-logo">
                <img src="/logo.png" alt="Logo" />
              </div>
            </NavLink>
            <h1>ParkFlow</h1>
          </div>

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
                <NavLink to="#" className="user-nav-item">
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
      {/* DASHBOARD */}
      <div className="main-dashboard">
        <div className="dashboard-container">
          <motion.div
            className="dashboard-cards"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="stat-card"
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }} // Hover karne pe element 10px upar move karega aur 1.03px zoom hoga
              transition={{ duration: 0.3 }} // animation 0.3 seconds ma complete hoga
            >
              <div className="stat-icon">
                <FaParking />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Slots</p>
                <h3 className="stat-number">{stats.totalSlots}</h3>
                <p className="stat-sub">All Parking Slots</p>
              </div>
            </motion.div>
            <motion.div
              className="stat-card"
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }} // Hover karne pe element 10px upar move karega aur 1.03px zoom hoga
              transition={{ duration: 0.3 }} // animation 0.3 seconds ma complete hoga
            >
              <div className="stat-icon">
                <FaCar />
              </div>
              <div className="stat-info">
                <p className="stat-label">Available Slots</p>
                <h3 className="stat-number">{stats.availableSlots}</h3>
                <p className="stat-sub">Slots Available</p>
              </div>
            </motion.div>
            <motion.div
              className="stat-card"
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }} // Hover karne pe element 10px upar move karega aur 1.03px zoom hoga
              transition={{ duration: 0.3 }} // animation 0.3 seconds ma complete hoga
            >
              <div className="stat-icon">
                <FaBookmark />
              </div>
              <div className="stat-info">
                <p className="stat-label">Booked Slots</p>
                <h3 className="stat-number">{stats.bookedSlots}</h3>
                <p className="stat-sub">Currently Booked</p>
              </div>
            </motion.div>
            <motion.div
              className="stat-card"
              variants={fadeUp}
              whileHover={{ y: -10, scale: 1.03 }} // Hover karne pe element 10px upar move karega aur 1.03px zoom hoga
              transition={{ duration: 0.3 }} // animation 0.3 seconds ma complete hoga
            >
              <div className="stat-icon">
                <MdSubscriptions />
              </div>
              <div className="stat-info">
                <p className="stat-label">Subscription Card</p>
                <h3 className="stat-number">{booking.plan}</h3>
                <p className="stat-sub">Currently Active Plan</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        {/* GRAPHS SECTION */}
        <motion.div
          className="graphs-section"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="chart-card"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }} // Hover karne pe element 1.02px zoom hoga
          >
            <h3>Total Spent</h3>
            <BarChart width={890} height={350} data={data}>
              <XAxis dataKey="plan" />
              <YAxis />
              <Tooltip /> {/* Hover pe popup show karta hai */}
              <Legend /> {/* Chart labels show karta hai */}
                <Bar
                  dataKey="price"
                  fill="#22C55E"
                  stroke="#22C55E"
                  strokeWidth={2}
                />
            </BarChart>
          </motion.div>

          <motion.div
            className="donut-chart-container"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }} // Hover karne pe element 1.02px zoom hoga
          >
            <h3 className="chart-title">Parking Overview</h3>
            <ResponsiveContainer width="100%" height={290}>
              {/* Responsive Container Different screen sizes pe adjust hota ha */}
              <PieChart>
                {/* pie chart ka main container */}
                <Pie
                  data={donutdata}
                  cx="50%" // center x-axis
                  cy="50%" // center y-axis
                  innerRadius={70} // Center me hole create karta hai.
                  outerRadius={100} // Outer circle size.
                  paddingAngle={5} // Chart sections ke darmiyan gap.
                  dataKey="value"
                >
                  {donutdata.map(
                    (
                      curitem,
                      i, // har data items k liya cells create ho rahy han (curitem(current item) (i(indexing k liya ha color assign k liya)
                    ) => (
                      <Cell key={i} fill={colors[i]} /> // Har pie section ka color set kar raha hai. (key is unique id)
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

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
export default UserHome;
