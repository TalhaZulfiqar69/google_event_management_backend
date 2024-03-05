const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  attendees: { type: Array, required: false },
  location: { type: String, required: false },
  description: { type: String, required: false },
  end: { type: String, required: false },
  start: { type: String, required: false },
  organizer: { type: String, required: false },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

eventsSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Event = mongoose.model("Event", eventsSchema);

module.exports = Event;
