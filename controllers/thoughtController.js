const { Thought, User } = require("../models");

const thoughtController = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find().populate('reactions');
      res.json(thoughts);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json(err);
    }
  },

  // get single thought by id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId }).populate('reactions');
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
      res.json(thought);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json(err);
    }
  },

  // Add Thought to User
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      ).populate('thoughts');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("Error creating thought:", err);
      res.status(500).json({ message: "Failed to create thought" });
    }
  },

  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
  
      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
  
      const user = await User.findOneAndUpdate( // Assign result to 'user'
        { _id: thought.userId },
        { $pull: { thoughts: thought._id } },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ message: "Thought and associated reactions deleted!" });
    } catch (err) {
      console.error("Error deleting thought:", err); // More specific error
      res.status(500).json({ message: "Failed to delete thought" }); // Custom error message
    }
  },
  
  // Update Thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }

      res.json(thought);
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json(err);
    }
  },

  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
  
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }
  
      const reaction = await Reaction.create(req.body);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      await Reaction.findOneAndDelete({ _id: req.params.reactionId });
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json(err);

      const reaction = await Reaction.findOneAndDelete({ _id: req.params.reactionId });
      res.json(reaction);
    }
  },
};

module.exports = thoughtController;
