import express from "express";
import cors from "cors";
const app = express();
app.listen(8080, () => {
  console.log("Server Started on port 8080");
});

app.use(express.json());
app.use(cors());
const users = [];

app.get("/", (req, res) => {
  return res.json(users);
});

app.post("/register", (req, res) => {
  const { name, email, pass } = req.body;
  users.push({ name, email, pass });
  return res.json(users);
});

app.post("/login", (req, res) => {
  const { email, pass } = req.body;
  const found = users.find(
    (value) => value.email === email && value.pass === pass
  );
  if (!found) {
    res.json({message:"User not found"})
  }
  res.json({...found,token:"123"});
});