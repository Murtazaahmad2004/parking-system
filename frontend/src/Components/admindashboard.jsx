import {
  FaFileInvoiceDollar,
  FaParking,
  FaSignOutAlt,
  FaUserPlus,
  FaUserTie,
  FaCar,
  FaBookmark,
  FaTicketAlt,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import {
  LineChart,
  BarChart,
  XAxis,
  YAxis,
  Line,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Bar,
} from "recharts"; // Dashboard graphs banane ke liye.
import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { MdDashboard, MdTrendingUp } from "react-icons/md";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
// SCALE ANIMATION Element zoom effect ke sath show hota hai.
const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};
// Graphs
const vehicalentries = [
  { date: "02-may-2026", vehicals: 15 },
  { date: "03-may-2026", vehicals: 20 },
  { date: "05-may-2026", vehicals: 12 },
  { date: "08-may-2026", vehicals: 18 },
  { date: "10-may-2026", vehicals: 25 },
  { date: "15-may-2026", vehicals: 30 },
];
const revenuedata = [
  { month: "Jan", profit: 15000 },
  { month: "Feb", profit: 20000 },
  { month: "Mar", profit: 12000 },
  { month: "Apr", profit: 18000 },
  { month: "May", profit: 25000 },
  { month: "Jun", profit: 30000 },
];
const vehicaltype = [
  { type: "Car", count: 15 },
  { type: "Bike", count: 20 },
  { type: "Truck", count: 12 },
  { type: "Van", count: 18 },
  { type: "Bus", count: 25 },
];
const donutdata = [
  { name: "available", value: 38 },
  { name: "booked", value: 7 },
];
const colors = ["#28a745", "#ffc107", "#007bff"];
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function AdminDashboard() {
   const [bookings, setBookings] = useState([]);
   const [totalrevenue, setTotalRevenue] = useState(0);
   const [stats, setStats] = useState({
      totalSlots: 0,
      availableSlots: 0,
      bookedSlots: 0,
    });

  useEffect(() => {
    document.title = "Admin || Dashboard - ParkFlow";
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/booked-slots")
      .then((result) => {
        setStats(result.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
    .get("http://localhost:3001/bookings")
    .then((result) => {
      console.log("All Bookings:", result.data);
      
      if(Array.isArray(result.data)) {
        setBookings(result.data);
      } else {
        setBookings([]);
      }
    })
    .catch((err) => {
      console.log(err);
      setBookings([]);
    });
  }, []);

  useEffect(() => {
  const revenue = bookings.reduce((total, booking) => {
    return total + Number(booking?.price || 0);
  }, 0);

  setTotalRevenue(revenue);
}, [bookings]);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");

    navigate("/loginsignup");
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
        </div>
      </div>
      {/* SIDEBAR */}
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
                <NavLink to="/adminbooking" className="user-nav-item">
                  <li>
                    <FaTicketAlt className="icon" />
                    Booking Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/vehicalmanagement" className="user-nav-item">
                  <li>
                    <FaCar className="icon" />
                    Vehicle Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/addstaff" className="user-nav-item">
                  <li>
                    <FaUserPlus className="icon" />
                    Add Staff
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/staffmanagement" className="user-nav-item">
                  <li>
                    <FaUserTie className="icon" />
                    Staff Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/slotmanagement" className="user-nav-item">
                  <li>
                    <FaParking className="icon" />
                    Slot Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/plan" className="user-nav-item">
                  <li>
                    <FaPlus className="icon" />
                    Add Plan
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/planmanagement" className="user-nav-item">
                  <li>
                    <FaClipboardList className="icon" />
                    Plan Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div
                variants={fadeUp}
                whileHover={{ x: 10 }} // Hover karne pe element 10px right move karega
              >
                <NavLink to="/billingmanagement" className="user-nav-item">
                  <li>
                    <FaFileInvoiceDollar className="icon" />
                    Billing Management
                  </li>
                </NavLink>
              </motion.div>
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
                <MdTrendingUp />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Revenue</p>
                <h3 className="stat-number">RS.{totalrevenue}</h3>
                <p className="stat-sub">Total Revenue</p>
              </div>
            </motion.div>
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
          </motion.div>
        </div>
        {/* GRAPHS SECTION */}
        {/* start monthly and yearly graph */}
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
            <h3>Monthly / Yearly Profit</h3>
            <LineChart width={900} height={350} data={revenuedata}>
              <XAxis dataKey="month" />
              <YAxis dataKey="profit" />
              <Tooltip />
              {/* Hover pe popup show karta hai */}
              <Legend />
              {/* Chart labels show karta hai */}
              <Line
                type="monotone"
                dataKey="month"
                stroke="#185FA5"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#0fa80a"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              {/* monotone smooth curved line banata hai. or strokewidth line ki width ko show krta ha or dot r dot ki width ki show krta ha */}
            </LineChart>
          </motion.div>
          {/* end monthly and yearly graph */}

          {/* start parking overview donut chart */}
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
                  label
                >
                  {donutdata.map(
                    (
                      curitem,
                      i, // har data items k liya cells create ho rahy han (curitem (current item han) aur i (index) han)
                    ) => (
                      <Cell key={i} fill={colors[i]} /> // Har pie section ka color set kar raha hai. (key unique index hai, fill colors array se color le raha hai)
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          {/* end parking overview donut chart */}

          {/* start vehicals entries bar graph */}
          <motion.div
            className="chart-card"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }} // Hover karne pe element 1.02px zoom hoga
          >
            <h3>Vehicals Entries</h3>
            <BarChart width={900} height={350} data={vehicalentries}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              {/* Hover pe popup show karta hai */}
              <Legend />
              {/* Chart labels show karta hai */}
              <Bar
                dataKey="vehicals"
                fill="#4472a0"
                barSize={30}
                name="Vehicals Entries"
              />
              {/* monotone smooth curved line banata hai. */}
            </BarChart>
          </motion.div>
          {/* end vehicals entries bar graph */}

          {/* start vehical type pie chart */}
          <motion.div
            className="donut-chart-container"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }} // Hover karne pe element 1.02px zoom hoga
          >
            <h3 className="chart-title">Vehical Types</h3>
            <ResponsiveContainer width="100%" height={290}>
              {/* Responsive Container Different screen sizes pe adjust hota ha */}
              <PieChart>
                {/* pie chart ka main container */}
                <Pie
                  data={vehicaltype}
                  cx="50%" // center x-axis
                  cy="50%" // center y-axis
                  outerRadius={100} // Outer circle size.
                  paddingAngle={5} // Chart sections ke darmiyan gap.
                  dataKey="count"
                  nameKey="type"
                  label
                >
                  {vehicaltype.map(
                    (
                      curitem,
                      i, // har data items k liya cells create ho rahy han (curitem (current item han) aur i (index) han)
                    ) => (
                      <Cell key={i} fill={colors[i]} /> // Har pie section ka color set kar raha hai. (key unique index hai, fill colors array se color le raha hai)
                    ),
                  )}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          {/* end vehical type pie chart */}
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
export default AdminDashboard;
