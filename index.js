const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const port = process.env.port || 5001;

// routers
const userRoutes = require("./routes/userRoutes");
const logoRouter = require("./routes/logoRoutes");
const contactRouter = require("./routes/contactRoutes");
const bannerRouter = require("./routes/bannerRoutes");
const aboutRouter = require("./routes/aboutRoutes");
const categoryRouter = require("./routes/categoriesRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reveiwRoutes");
const campaignBannerRouter = require("./routes/campaignBannerRoutes");
const brandRouter = require("./routes/brandRoutes");
const couponRouter = require("./routes/couponRoutes");

const orderRouter = require("./routes/orderRoutes");
const paymentRouter = require("./routes/paymentRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Connect Database
mongoose.connect(process.env.DB_URL).then(() => {
  console.log("Database connection is successful");
});

app.use("/user", userRoutes);
app.use("/logo", logoRouter);
app.use("/contact", contactRouter);
app.use("/banner", bannerRouter);
app.use("/about", aboutRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/review", reviewRouter);
app.use("/campaignBanner", campaignBannerRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);

app.use("/order", orderRouter);
app.use("/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send(`Server is Running on port ${port}`);
});

app.listen(port, () => {
  console.log(`Server is Running on port ${port}`);
});
