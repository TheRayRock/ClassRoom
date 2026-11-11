import express from "express";
import subjectRouter from "./db/routes/subjects.js";
import cors from "cors";

const app = express();

const PORT = 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/subjects", subjectRouter);

app.get("/", (req, res) => {
  res.send("hello, welcome to the classRoom Api!");
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
});
