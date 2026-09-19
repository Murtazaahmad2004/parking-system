const mongoose = require("mongoose");

const BookingFormSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  bookingid: {
    type: String,
    required: true,
    unique:true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  cnic: {
    type: String,
    required: true,
    unique:true,
  },
  phonenumber: {
    type: Number,
    required: true,
    unique:true,
  },
  vehiclenumber: {
    type: String,
    required: true,
    unique: true,
  },
  vehicletype: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  plan: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookingdate: {
    type: String,
    required: true,
  },
  enddate: {
    type: String,
    required: true,
  },
  bookingtime: {
    type: String,
    required: true,
  },
  endtime: {
    type: String,
    required: true,
  },
  status: {
    type : String,
    enum: ["active", "cancelled", "completed"],
    default: "active",
  },
});
 
module.exports = mongoose.model("booking", BookingFormSchema);