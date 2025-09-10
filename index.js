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
const productRoute = require("./routers/productRoute.js")
const categoryRoute = require("./routers/categoryRoute.js")
const cartRoute = require('./routers/cartRoute.js')
const groupRoute = require('./routers/groupRoute.js')
const styleRoute = require('./routers/styleRoutesr.js')
const userRouter = require('./routers/userRouter.js')
const policyRouter = require('./routers/policyRouter.js')
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

app.use("/api/product", productRoute)

app.use("/api/category", categoryRoute)

app.use("/api/cart", cartRoute)

app.use("/api/group", groupRoute)

app.use("/api/style", styleRoute)

app.use("/api/user", userRouter)

app.use("/api/policy", policyRouter)
// Cho assets
app.use(
  "/productImg",
  express.static("assets/productImages", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use(
  "/model",
  express.static("assets/models", {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
//----------- Hết router-------------//

app.get("/", (req, res) => {
  res.json({ message: "Hello from server" });
});

app.listen(process.env.PORT, () => {
  console.log("listening..." + process.env.PORT);
});
