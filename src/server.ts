

import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import authRoutes from "./routes/auth.routes";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(process.env.DATABASE_URL);