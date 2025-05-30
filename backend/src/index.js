import dotenv from 'dotenv';
import http from 'http';
import connectDB from "./db/index.js";
import app from './app.js'; // assuming you're using `export default app` in app.js

dotenv.config({ path: './.env' });

// Create the HTTP server
const server = http.createServer(app);

// Set timeout (10 minutes = 600000ms)
server.setTimeout(600000); // Helps for large file uploads or streaming

// Connect to DB and start server
connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8000;
        server.listen(PORT, () => {
            console.log(`✅ Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ MONGO DB connection failed.", err);
    });


// import express from "express";

// const app = express()

// ;( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on("error", (error) => {
//             console.log("ERROR : ", error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     }
//     catch (error) {
//         console.error("ERROR : ", error)
//         throw error
//     }
// })