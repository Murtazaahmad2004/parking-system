import {
  FaCalendar,
  FaCalendarCheck,
  FaCcMastercard,
  FaCcVisa,
  FaCreditCard,
  FaLock,
  FaUser,
} from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styling/paymentscreen.css";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

function PaymentScreen() {
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || null);

  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [cvvNumber, setCvvNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");

  const handlePayment = async () => {
    if (
      !cardNumber ||
      !cvvNumber ||
      !expiryMonth ||
      !expiryYear ||
      !cardHolderName
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const bookingData = JSON.parse(sessionStorage.getItem("bookingData"));

      const result = await axios.post("http://localhost:3001/email/send-otp", {
        email: bookingData.email,
      });

      if (result.data.status === "OTP sent successfully") {
        navigate("/otpverification", {
          state: {
            email: bookingData.email,
          },
        });
      } else {
        alert(result.data.status);
      }
    } catch (err) {
      console.log(err);
      console.log(err.response?.data);

      alert("Failed to send OTP");
    }
  };
  console.log(bookingData);

const [plan, setPlan] = useState([]);

useEffect(() => {
  axios
    .get("http://localhost:3001/plans")
    .then((result) => {
      setPlan(result.data);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);

const loggedInUser = JSON.parse(
  sessionStorage.getItem("bookingData") || "null"
);

const userPlan = plan.filter(
  (item) => item.planname === loggedInUser?.plan
);

console.log("Logged-in User:", loggedInUser);
console.log("User Plan:", userPlan);

  useEffect(() => {
    document.title = "Payment Page - ParkFlow";
  }, []);

  return (
    <>
      <div className="payment-form-section">
        {/* =====================================
            LEFT — CARD FORM
        ====================================== */}
        <motion.div
          className="payment-form-left"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          <div className="payment-container">
            <div className="card-icons">
              <FaCcVisa className="card-icon visa" />
              <FaCcMastercard className="card-icon mastercard" />
            </div>

            <div className="pay-inputs">
              {/* Card Number */}
              <div className="pay-input-group">
                <label>Card Number</label>

                <div className="pay-input">
                  <FaCreditCard className="pay-icon" />

                  <input
                    type="text"
                    placeholder="e.g. 1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* CVV */}
              <div className="pay-input-group">
                <label>CVV Number</label>

                <div className="pay-input">
                  <FaLock className="pay-icon" />

                  <input
                    type="password"
                    placeholder="e.g. 123"
                    value={cvvNumber}
                    onChange={(e) => setCvvNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Expiry Month */}
              <div className="pay-input-group">
                <label>Expiry Month</label>

                <div className="pay-input">
                  <FaCalendar className="pay-icon" />

                  <input
                    type="text"
                    placeholder="MM"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                  />
                </div>
              </div>

              {/* Expiry Year */}
              <div className="pay-input-group">
                <label>Expiry Year</label>

                <div className="pay-input">
                  <FaCalendarCheck className="pay-icon" />

                  <input
                    type="text"
                    placeholder="YY"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                  />
                </div>
              </div>

              {/* Card Holder Name */}
              <div className="pay-input-group">
                <label>Card Holder Name</label>

                <div className="pay-input">
                  <FaUser className="pay-icon" />

                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT — PLAN DETAIL */}
        <motion.div
          className="payment-form-right"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div>
            {userPlan.map((item) => (
              <motion.div className="pricing-card" key={item._id}>
                <h2>{item.planname}</h2>

                <p className="price">
                  Rs {item.price}
                  <span>/{item.durationtype}</span>
                </p>

                <ul>
                  {item.features.map((features, index) => (
                    <li key={index}>{features}</li>
                  ))}
                </ul>

                <NavLink to="/paymentscreen" className="plan-buttons">
                  Get {item.planname} Plan
                  <button onClick={handlePayment}>Pay Subscription</button>
                </NavLink>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}
export default PaymentScreen;
