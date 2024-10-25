import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use((req, res, next) => {
    const { method, url } = req;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${method} - ${url}`);
    next();
});

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "3gb"}))
app.use(express.urlencoded({extended: true, limit: "3gb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import userRouter from './routes/user.routes.js'
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// Routes Declaration'
app.use("/api/version_1/users", userRouter);
app.use("/api/version_1/comment", commentRouter);
app.use("/api/version_1/likes", likeRouter);
app.use("/api/version_1/subscriptions", subscriptionRouter);
app.use("/api/version_1/video", videoRouter);
app.use("/api/version_1/playlist", playlistRouter);
app.use("/api/version_1/dashboard", dashboardRouter);

export { app }