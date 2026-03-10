const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error("MongoDB is not connected");
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    });

module.exports = mongoose.connection;