import express from "express";
import CareerSession from "../models/CareerSession.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// =======================
// SAVE CAREER SESSION
// =======================
router.post("/session", requireAuth, async (req, res) => {
  try {
    const {
      userProfile,
      recommendations,
      skillGapResults,
      jobResults
    } = req.body;

    if (!userProfile || !recommendations || !skillGapResults || !jobResults) {
      return res.status(400).json({
        error: "Missing required session data"
      });
    }

    const newSession = new CareerSession({
      userId: req.user.userId,
      inputSnapshot: userProfile,
      phaseResults: {
        recommendations,
        skillGapResults,
        jobResults
      }
    });

    const saved = await newSession.save();

    return res.status(201).json({
      message: "Session saved successfully",
      sessionId: saved._id
    });

  } catch (err) {
    console.error("❌ Save session error:", err);
    return res.status(500).json({
      error: "Failed to save session"
    });
  }
});

// =======================
// GET USER CAREER HISTORY
// =======================
router.get("/history", requireAuth, async (req, res) => {
  try {
    const sessions = await CareerSession.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const history = sessions.map((session) => {
      const recommendations =
        session.phaseResults?.recommendations || [];

      return {
        sessionId: session._id,
        createdAt: session.createdAt,
        topCareer:
          recommendations.length > 0
            ? recommendations[0].career_title
            : "N/A",
        totalCareersSuggested: recommendations.length
      };
    });

    return res.json(history);

  } catch (err) {
    console.error("❌ Fetch history error:", err);
    return res.status(500).json({
      error: "Failed to fetch history"
    });
  }
});

// =======================
// GET USER PROGRESS ANALYTICS
// =======================
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const sessions = await CareerSession.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: 1 })
      .lean(); // oldest → newest

    if (sessions.length === 0) {
      return res.json({
        totalSessions: 0,
        message: "No session data available yet."
      });
    }

    // ===== TOTAL SESSIONS =====
    const totalSessions = sessions.length;

    // ===== CAREER STABILITY =====
    const topCareers = sessions.map((session) => {
      const recs = session.phaseResults?.recommendations || [];
      return recs.length > 0 ? recs[0].career_title : null;
    }).filter(Boolean);

    const latestTopCareer = topCareers[topCareers.length - 1] || null;
    const previousTopCareer =
      topCareers.length > 1
        ? topCareers[topCareers.length - 2]
        : null;

    let stability = "Insufficient Data";
    if (topCareers.length >= 2) {
      stability =
        latestTopCareer === previousTopCareer
          ? "Stable"
          : "Shifting";
    }

    // Career consistency score
    const careerFrequency = {};
    topCareers.forEach((career) => {
      careerFrequency[career] =
        (careerFrequency[career] || 0) + 1;
    });

    const maxOccurrences = Math.max(...Object.values(careerFrequency));
    const consistencyScore = Math.round(
      (maxOccurrences / totalSessions) * 100
    );

    // ===== SKILL GAP TREND =====
    const missingCounts = sessions.map((session) => {
      const skillGap = session.phaseResults?.skillGapResults || [];

      return skillGap.reduce((total, career) => {
        return total + (career.skills_missing?.length || 0);
      }, 0);
    });

    const latestTotalMissing =
      missingCounts[missingCounts.length - 1];

    const previousTotalMissing =
      missingCounts.length > 1
        ? missingCounts[missingCounts.length - 2]
        : null;

    let skillGapTrend = "Insufficient Data";
    if (missingCounts.length >= 2) {
      if (latestTotalMissing < previousTotalMissing)
        skillGapTrend = "Improving";
      else if (latestTotalMissing > previousTotalMissing)
        skillGapTrend = "Expanding";
      else
        skillGapTrend = "No Change";
    }

    return res.json({
      totalSessions,
      careerProgress: {
        latestTopCareer,
        previousTopCareer,
        stability,
        consistencyScore
      },
      skillGapProgress: {
        latestTotalMissingSkills: latestTotalMissing,
        previousTotalMissingSkills: previousTotalMissing,
        trend: skillGapTrend
      }
    });

  } catch (err) {
    console.error("❌ Progress analytics error:", err);
    return res.status(500).json({
      error: "Failed to compute progress"
    });
  }
});

export default router;