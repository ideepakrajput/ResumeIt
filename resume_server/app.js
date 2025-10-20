import express from "express";
import routes from "./routes.js";
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";
const app = express();
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

app.use(cors());

// Logger middleware
app.use((req, res, next) => {
  const methodColor = "\x1b[36m"; // cyan
  const urlColor = "\x1b[33m"; // yellow
  const reset = "\x1b[0m";
  console.log(
    `${methodColor}${req.method}${reset} ${urlColor}${req.originalUrl}${reset}`
  );
  next();
});

app.use(express.json());

// Mount API v1 routes
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Hello there im the server :)");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
