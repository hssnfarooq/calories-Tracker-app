const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  foods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "user",
  },
  invited_by: {
    type: String,
    default: "user",
  },
  is_invited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("User", userSchema);
