import express from "express";
import User from "../models/User.js";
import CareerSession from "../models/CareerSession.js";

import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", requireAuth, requireAdmin, (req, res) => {
  res.json({
    message: "Admin route accessed successfully",
    admin: req.user,
  });
});

// 🔥 GET ALL USERS
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 🔥 DELETE USER
router.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Optional safety: prevent deleting yourself
    if (req.user.userId === userId) {
      return res.status(400).json({ error: "You cannot delete yourself" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// 🔥 Admin Stats
router.get("/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await CareerSession.countDocuments();

    const avgSessionsPerUser =
      totalUsers === 0 ? 0 : (totalSessions / totalUsers).toFixed(2);

    // 🔥 TOP JOBS
    const topJobsAgg = await CareerSession.aggregate([
      { $unwind: "$phaseResults.recommendations" },
      {
        $group: {
          _id: "$phaseResults.recommendations.career_title",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    // 🔥 TOP SKILLS
    const topSkillsAgg = await CareerSession.aggregate([
      { $unwind: "$inputSnapshot.skills" },
      {
        $group: {
          _id: "$inputSnapshot.skills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    // 🔥 TOP INTERESTS
    const topInterestsAgg = await CareerSession.aggregate([
      { $unwind: "$inputSnapshot.interests" },
      {
        $group: {
          _id: "$inputSnapshot.interests",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 3 },
    ]);

    // 🔥 SESSIONS OVER TIME
    const sessionsOverTime = await CareerSession.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🔥 MOST ACTIVE USERS
    const mostActiveUsers = await CareerSession.aggregate([
      {
        $group: {
          _id: "$userId",
          sessionCount: { $sum: 1 },
        },
      },
      { $sort: { sessionCount: -1 } },
      { $limit: 3 },

      // 🔗 Join with User collection
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },

      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          sessionCount: 1,
        },
      },
    ]);

    res.json({
      totalUsers,
      totalSessions,
      avgSessionsPerUser,

      topJobs: topJobsAgg,
      topSkills: topSkillsAgg,
      topInterests: topInterestsAgg,

      sessionsOverTime,
      mostActiveUsers
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

export default router;
