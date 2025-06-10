require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

const app = express();

app.use(cors({
  origin: "*"
}));

const allowedOrigins = ['https://shopping-frontend-gamma.vercel.app' || "http://localhost:5173"];

app.use(cors({
  origin: allowedOrigins,   // ✅ safer than "*"
}));


app.use(express.json());
app.use(cookieParser());
connectDB();

app.use("/api/v1/auth", require("./routes/googleRoute.js"));
app.use("/api/v1/user", require("./routes/userRoute.js"));
app.use("/api/v1/seller", require("./routes/sellerRoute.js"));
app.use("/api/v1/products", require("./routes/productRoute.js"));
app.use("/api/v1/cart", require("./routes/cartRoute.js"));
app.use("/api/v1/order", require("./routes/paymentRoute.js"));
app.use("/api/v1/orderDetail", require("./routes/orderRoute.js"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
