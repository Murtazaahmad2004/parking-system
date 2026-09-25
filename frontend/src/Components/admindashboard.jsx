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
  CartesianGrid,
} from "recharts";
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

const scaleUp = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

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
        if (Array.isArray(result.data)) {
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

  const chartData = Object.values(
    bookings.reduce((result, booking) => {
      const month = new Date(booking.bookingdate).toLocaleString("en-US", {
        month: "short",
      });

      const price = Number(booking.price || 0);

      if (!result[month]) {
        result[month] = {
          month: month,
          price: 0,
        };
      }
      result[month].price += price;

      return result;
    }, []),
  );

  const vehicalEntries = Object.values(
    bookings.reduce((result, booking) => {
      const date = booking.bookingdate;
      if (!result[date]) {
        result[date] = {
          date: date,
          vehicals: 0,
        };
      }
      result[date].vehicals += 1;

      return result;
    }, []),
  );

  // Corrected property fallback mapping to catch 'vehicaltype', 'vehicleType', or 'type'
  const vehicalTypes = Object.values(
    bookings.reduce((result, booking) => {
      const vehicaltype =
        booking.vehicaltype || booking.vehicleType || booking.type || "Other";

      if (!result[vehicaltype]) {
        result[vehicaltype] = {
          type: vehicaltype,
          vehicals: 0,
        };
      }
      result[vehicaltype].vehicals += 1;

      return result;
    }, []),
  );

  const donutdata = [
    { name: "available", value: stats.availableSlots },
    { name: "booked", value: stats.bookedSlots },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    navigate("/loginsignup");
  };

  const colors = [
    "#22C55E",
    "#3B82F6",
    "#A855F7",
    "#F97316",
    "#EF4444",
    "#06B6D4",
    "#EAB308",
    "#EC4899",
  ];

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
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="#" className="user-nav-item">
                  <li>
                    <MdDashboard className="icon" />
                    DashBoard
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/adminbooking" className="user-nav-item">
                  <li>
                    <FaTicketAlt className="icon" />
                    Booking Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/vehicalmanagement" className="user-nav-item">
                  <li>
                    <FaCar className="icon" />
                    Vehicle Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/addstaff" className="user-nav-item">
                  <li>
                    <FaUserPlus className="icon" />
                    Add Staff
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/staffmanagement" className="user-nav-item">
                  <li>
                    <FaUserTie className="icon" />
                    Staff Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/slotmanagement" className="user-nav-item">
                  <li>
                    <FaParking className="icon" />
                    Slot Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/plan" className="user-nav-item">
                  <li>
                    <FaPlus className="icon" />
                    Add Plan
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/planmanagement" className="user-nav-item">
                  <li>
                    <FaClipboardList className="icon" />
                    Plan Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
                <NavLink to="/billingmanagement" className="user-nav-item">
                  <li>
                    <FaFileInvoiceDollar className="icon" />
                    Billing Management
                  </li>
                </NavLink>
              </motion.div>
              <motion.div variants={fadeUp} whileHover={{ x: 10 }}>
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
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
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
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
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
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
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
              whileHover={{ y: -10, scale: 1.03 }}
              transition={{ duration: 0.3 }}
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
        <motion.div
          className="graphs-section"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Monthly / Yearly Profit */}
          <motion.div
            className="chart-card"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }}
          >
            <h3>Monthly / Yearly Profit</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#185FA5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Parking Overview Donut Chart */}
          <motion.div
            className="donut-chart-container"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="chart-title">Parking Overview</h3>
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={donutdata}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {donutdata.map((curitem, i) => (
                    <Cell key={i} fill={colors[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Vehicles Entries Bar Graph */}
          <motion.div
            className="chart-card"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }}
          >
            <h3>Vehicals Entries</h3>
            <BarChart width={900} height={350} data={vehicalEntries}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vehicals">
                {vehicalEntries.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </motion.div>

          {/* Vehicle Types Pie Chart */}
          <motion.div
            className="donut-chart-container"
            variants={scaleUp}
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="chart-title">Vehicle Types</h3>
            <ResponsiveContainer width="100%" height={290}>
              <PieChart>
                <Pie
                  data={vehicalTypes}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="vehicals"
                  nameKey="type"
                  label
                >
                  {vehicalTypes.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                    />
                  ))}
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

        <div className="login-footer-bottom">
          <p>© 2026 ParkFlow. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default AdminDashboard;