const express = require("express");
const {
  getCurrentCourseProgress,
  markCurrentLectureAsViewed,
  resetCurrentCourseProgress,
  getVideoUrl,
} = require("../../controllers/student/course-progress-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get/:userId/:courseId", getCurrentCourseProgress);
router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
router.post("/reset-progress", resetCurrentCourseProgress);
router.get("/video-url/:courseId/:lectureId", authenticate, getVideoUrl);

module.exports = router;