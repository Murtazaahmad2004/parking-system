import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import "./styling/mybooking.css";
import {
  FaCalendarCheck,
  FaChevronDown,
  FaCloudDownloadAlt,
  FaParking,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdCancel, MdDashboard } from "react-icons/md";


const fadeUp = {
  hidden: { opacity: 0, y: 60 },
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

function MyBooking() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    document.title = "My Booking - ParkFlow";

    const userid = sessionStorage.getItem("userid");

    axios
      .get(`http://localhost:3001/mybookings/${userid}`)
      .then((result) => setBookings(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);

const cancelBooking = async (bookingid) => {
  try {
    const result = await axios.delete(
      `http://localhost:3001/booking/${bookingid}`
    );

    console.log(result.data);

    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.bookingid === bookingid
          ? {
              ...booking,
              status: "cancelled",
            }
          : booking
      )
    );

  } catch (err) {
    console.log("Cancel Booking Error:", err);
  }
};
  
const downloadTicket = async (booking) => {
  let holder = null;
 
  try {
    /* ---------- 1. QR data ---------- */
    const qrData = {
      userid: booking.userid,
      bookingid: booking.bookingid,
      name: booking.name,
      vehiclenumber: booking.vehiclenumber,
      vehicletype: booking.vehicletype,
      slot: booking.slot,
      area: booking.area,
      plan: booking.plan,
      price: booking.price,
      bookingdate: booking.bookingdate,
      bookingtime: booking.bookingtime,
      enddate: booking.enddate,
      endtime: booking.endtime,
      status: booking.status,
    };
 
    const qrUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 420,
      margin: 1,
    });
 
    /* ---------- 2. Ticket ke rows (label : value) ---------- */
    const rows = [
      ["User ID", booking.userid],
      ["Booking ID", booking.bookingid],
      ["Booking Date", `${booking.bookingdate}  ${booking.bookingtime || ""}`],
      ["Ending Date", `${booking.enddate}  ${booking.endtime || ""}`],
      ["Parking Area", booking.area],
      ["Slot Number", booking.slot],
      ["Plan", booking.plan],
      ["Name", booking.name],
      ["Phone", booking.phonenumber],
      ["CNIC", booking.cnic],
      ["Vehicle No.", booking.vehiclenumber],
      ["Vehicle Type", booking.vehicletype],
      ["Status", booking.status],
      ["Price", `Rs. ${booking.price}`],
    ];
 
    const rowsHTML = rows
      .map(
        ([label, value]) => `
        <div style="display:flex;justify-content:space-between;gap:16px;
                    padding:9px 2px;border-bottom:1px solid #d8d8d8;font-size:15px;">
          <span style="color:#111111;">${label}:</span>
          <span style="font-weight:600;color:#111111;text-align:right;">${
            value ?? "--"
          }</span>
        </div>`
      )
      .join("");
 
    /* ---------- 3. Hidden ticket DOM (off-screen, screenshot ke liye) ---------- */
    holder = document.createElement("div");
    holder.style.position = "fixed";
    holder.style.left = "-10000px";
    holder.style.top = "0";
 
    holder.innerHTML = `
      <div id="pf-ticket" style="width:520px;background:#ffffff;padding:28px 30px 34px;
           font-family:Arial,Helvetica,sans-serif;color:#111111;box-sizing:border-box;">
 
        <!-- HEADER -->
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:48px;height:48px;border-radius:50%;background:#0b6b3a;color:#ffffff;
                      font-size:18px;font-weight:700;line-height:48px;text-align:center;">PF</div>
          <div style="font-size:24px;font-weight:700;color:#0b6b3a;letter-spacing:.5px;">
            ParkFlow
          </div>
        </div>
 
        <!-- TITLE -->
        <div style="text-align:center;margin:22px 0 4px;font-size:19px;font-weight:600;">
          Parking Booking Ticket
        </div>
        <div style="text-align:center;font-size:13px;color:#666666;margin-bottom:18px;">
          Smart Parking Reservation Receipt
        </div>
 
        <!-- SLOT LINE -->
        <div style="text-align:center;margin-bottom:18px;">
          <div style="font-size:17px;font-weight:600;">Slot ${booking.slot}</div>
          <div style="font-size:15px;color:#333333;">${booking.area}</div>
        </div>
 
        <!-- ROWS -->
        <div style="border-top:1px solid #d8d8d8;">${rowsHTML}</div>
 
        <!-- NOTES -->
        <div style="margin-top:18px;font-size:12px;line-height:1.6;color:#555555;">
          <div>Entry ke waqt ye QR code security ko scan karwana zaroori hai.</div>
          <div>Booking sirf upar diye gaye vehicle ke liye valid hai.</div>
          <div>Ticket transferable nahi hai.</div>
        </div>
 
        <!-- QR -->
        <div style="text-align:center;margin-top:20px;">
          <img id="pf-qr" src="${qrUrl}" width="180" height="180"
               style="border:1px solid #d8d8d8;" />
          <div style="margin-top:8px;font-size:13px;letter-spacing:.5px;color:#333333;">
            ${booking.bookingid}
          </div>
        </div>
 
        <div style="margin-top:18px;font-size:11.5px;color:#999999;text-align:center;">
          Generated ${new Date().toLocaleString()}
        </div>
        <div style="margin-top:6px;font-size:13px;color:#333333;text-align:center;">
          Online Ticket
        </div>
      </div>
    `;
 
    document.body.appendChild(holder);
 
    /* ---------- 4. QR image fully load hone ka wait ---------- */
    const qrImg = holder.querySelector("#pf-qr");
    if (!qrImg.complete) {
      await new Promise((res) => {
        qrImg.onload = res;
        qrImg.onerror = res;
      });
    }
 
    /* ---------- 5. Poore ticket ka screenshot -> PNG ---------- */
    const canvas = await html2canvas(holder.querySelector("#pf-ticket"), {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
 
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `ParkFlow-Ticket-${booking.bookingid}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.log("Ticket Download Error:", error);
  } finally {
    if (holder) document.body.removeChild(holder);
  }
};

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");

    navigate("/loginsignup");
  };
  return (
    <>
      {/* HEADER */}
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

      {/* BOOKING ROWS */}
      <div className="booking-page">
        <motion.div
          className="booking-table-container"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          <table className="booking-table">
            <thead>
              <tr>
                <th>Sr.No</th>
                <th>User ID</th>
                <th>Booking ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>CNIC</th>
                <th>Vehicle Number</th>
                <th>Vehicle Type</th>
                <th>Slot Number</th>
                <th>Parking Area</th>
                <th>Plan</th>
                <th>Price</th>
                <th>Booking Date</th>
                <th>Booking Time</th>
                <th>Ending Date</th>
                <th>Ending Time</th>
                <th>Status</th>
                <th>QR Code</th>
              </tr>
            </thead>

            <tbody>
              {/* booking current item ha */}
              {/* bookings array ha */}
              {/* index current item ka number ha */}
              {bookings.map((booking, index) => (
                <tr key={booking._id}>
                  <td>{index + 1}</td>
                  <td>{booking.userid}</td>
                  <td>{booking.bookingid}</td>
                  <td>{booking.name}</td>
                  <td>{booking.email}</td>
                  <td>{booking.cnic}</td>
                  <td>{booking.vehiclenumber}</td>
                  <td>{booking.vehicletype}</td>
                  <td>{booking.slot}</td>
                  <td>{booking.area}</td>
                  <td>{booking.plan}</td>
                  <td>Rs. {booking.price}</td>
                  <td>{booking.bookingdate}</td>
                  <td>{booking.bookingtime}</td>
                  <td>{booking.enddate}</td>
                  <td>{booking.endtime}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button 
                      className="vehical-button-primary btn-primary"
                      onClick={() => downloadTicket(booking)}
                      title="Download QR Code"
                    >
                      <FaCloudDownloadAlt className="icon" />
                    </button>
                    <button
                      className="vehical-button-danger btn-danger"
                      onClick={() => {
                        cancelBooking(booking.bookingid);
                      }}
                    >
                      <MdCancel className="icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default MyBooking;
