const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookirParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const passport = require("passport");
const GoogleStartegy = require("passport-google-oauth20");
// ----------- Khai báo Router-------------//
const authRouter = require("./routers/authRouter.js");
const testRouter = require("./routers/testRouter.js");
const userRouter = require("./routers/userRouter.js");
const imageRouter = require("./routers/imageRouter.js");
const categoryRouter = require("./routers/categoryRoutes.js");
const mangaRouter = require("./routers/mangaRouter.js");
const chapterRouter = require("./routers/chapterRouter.js");
const commentRoutes = require("./routers/commentRoutes.js");
const notificationRoutes = require("./routers/notificationRoutes.js");
// ----------- Hết khai báo Router-------------//

const app = express();

//
const cookieParser = require("cookie-parser");

app.use(cookieParser());
//

app.use(cors()); // cái này thì tuỳ người để trống hoặc để  cái link của fe vào cho nó dảm bảo chỉ nhận cái fe đó
app.use(helmet());
app.use(cookirParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connect DB successfull!");
  })
  .catch((err) => {
    console.log("Connect DB failed..." + err);
  });

//----------- Cho Router-------------//
app.use("/api/auth", authRouter);

app.use("/api/test", testRouter); // cho test ko quan trọng

app.use("/api/image", imageRouter);
app.use("/avatars", express.static("assets/avatars"));
app.use(
  "/thumbnails",
  express.static("assets/thumbnailsManga", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use(
  "/chapter",
  express.static("assets/chapterImages", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

app.use("/api/users", userRouter);

app.use("/api/category", categoryRouter);

app.use("/api/manga", mangaRouter);

app.use("/api/chapter", chapterRouter);

app.use("/api/comments", commentRoutes);

app.use("/api/notifications", notificationRoutes);
//----------- Hết router-------------//

app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(process.env.PORT, () => {
  console.log("listening..." + process.env.PORT);
});
