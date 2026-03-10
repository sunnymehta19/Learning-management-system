const express = require('express');
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 3000

require("dotenv").config();
const database = require("./config/mongoose-connection");

const authRoutes = require("./routes/auth/auth-router");
const mediaRoutes = require("./routes/instructor/media-router");
const instructorCourseRoutes = require("./routes/instructor/course-router");
const studentViewCourseRoutes = require("./routes/student/course-router");
const studentViewOrderRoutes = require("./routes/student/order-router");
const studentCoursesRoutes = require("./routes/student/student-courses-router");
const studentCourseProgressRoutes = require("./routes/student/course-progress-router");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//routes configuration
app.use("/auth", authRoutes);
app.use("/media", mediaRoutes);
app.use("/instructor/course", instructorCourseRoutes);
app.use("/student/course", studentViewCourseRoutes);
app.use("/student/order", studentViewOrderRoutes);
app.use("/student/courses-bought", studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);



app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});