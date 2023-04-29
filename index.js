const bcrypt = require("bcryptjs");
const jwtgen = require("./utils/jwtgen");
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
app.use(cors());
app.use(express.json());

app.post("/student", async (req, res) => {
  try {
    const { rollno, marks } = req.body;
    await pool.query(
      "INSERT INTO marksofstudent (rollno,marks) VALUES ($1,$2) RETURNING *",
      [rollno, marks]
    );
    res.json({ message: "ok" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1,$2,$3) RETURNING *",
      [username, email, hash]
    );

    const token = jwtgen(newUser.rows[0].name);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
  }
});
app.post("/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query("SELECT * FROM users WHERE name=($1)", [
      username,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Cred");
    }
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(401).json("Incorrect password");
    }
    res.json({ message: "ok" });
  } catch (err) {
    console.error(err);
  }
});
app.get("/user", async (req, res) => {
  try {
    const all = await pool.query("SELECT * FROM users;");
    res.json(all.rows);
  } catch (err) {
    console.log(err.message);
  }
});
app.get("/user/:id/info/", async (req, res) => {
  try {
    const { id } = req.params;
    const all = await pool.query("SELECT * FROM users where name=($1);", [id]);
    res.json(all.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(2000, () => {
  console.log("connected");
});
