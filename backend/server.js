import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import { sql } from "./config/db.js"; // db.js file to configure PostgreSQL connection
import appointmentRoute from "./routes/appointmentRoute.js";
import slotRoute from "./routes/slotRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use(async (req, res, next) => {
  try {
    const decision = await ar.appointment(req, {
      request: 1,
    });
    if (decision.isDenied) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ message: "Too many requests" });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot detected" });
      } else {
        return res.status(403).json({ message: "Access denied" });
      }
    }
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      res.status(403).json({ message: "Spoofed bot detected" });
      return;
    }
    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});
// API Routes
app.use("/api/appointments", appointmentRoute);
app.use("/api/slots", slotRoute);

async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        time TIME NOT NULL,
        isBooked BOOLEAN DEFAULT false
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        slotId INT REFERENCES slots(id) ON DELETE CASCADE,
        userName TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        date DATE NOT NULL,
        time TIME NOT NULL
      );
    `;
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed", error);
  }
}

initDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});
