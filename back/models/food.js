const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  published: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  created_by: {
    type: String,
    default: "user",
  },
});
foodSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Food", foodSchema);
