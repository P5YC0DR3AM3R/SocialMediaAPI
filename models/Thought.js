const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const reactionSchema = require("./Reaction.js"); // Import the schema, not the model
const dateFormat = require("../utils/dateFormat");

const thoughtSchema = new Schema(
  {
    thoughtId: {
      type: Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
    },
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Use the reactionSchema here
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual for reaction count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
