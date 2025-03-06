require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");

const app = express();

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); 
app.use(cookieParser());
connectDB();

app.use("/api/v1/user", require("./routes/userRoute.js"));
app.use("/api/v1/seller", require("./routes/sellerRoute.js"));
app.use("/api/v1/products", require("./routes/productRoute.js"));
app.use("/api/v1/cart", require("./routes/cartRoute.js"));
app.use("/api/v1/order", require("./routes/paymentRoute.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
