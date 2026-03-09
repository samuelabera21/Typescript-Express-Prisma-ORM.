

import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes";


import cors from "cors";
import authRoutes from "./routes/auth.routes";


dotenv.config();

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log(process.env.DATABASE_URL);