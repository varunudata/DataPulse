import express from "express";
import cors from "cors";
import "dotenv/config";

import dbRoutes from "./routes/dbRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Server is running");
});

app.use("/api/auth", authRoutes);

app.use("/api/db", dbRoutes);
app.use("/api/query", queryRoutes);

if (process.env.production == 1) {
  app.listen(PORT, () => {
    console.log("Connected");
  });
}
export default app;
