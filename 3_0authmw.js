const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const JWT_SECRET = "Chetan@394";
app.use(express.json());
const user = [];
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  user.push({
    username: username,
    password: password,
  });
  res.json({
    msg: "You are signed up",
  });
  console.log(user);
});
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let founduser = user.find(
    (u) => u.username === username && u.password === password
  );
  if (!founduser) {
    return res.status(401).json({
      msg: "Incorrect Credentials!",
    });
  } else {
    const token = jwt.sign(
      {
        username,
      },
      JWT_SECRET
    );
    res.json({
      token: token,
    });
  }
});
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      msg: "You are not logged in",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    const decodeddata = jwt.verify(token, JWT_SECRET);
    if (decodeddata.username) {
      req.username = decodeddata.username;
      next();
    } else {
      res.status(401).json({
        msg: "You are not logged in",
      });
    }
  } catch (err) {
    res.status(401).json({
      msg: "Invalid or expired token",
    });
  }
}
app.get("/me", auth, (req, res) => {
  const founduser = user.find((u) => u.username === req.username);
  if (!founduser) {
    return res.status(404).json({
      msg: "User not found",
    });
  }
  res.json({
    username: founduser.username,
    password: founduser.password,
  });
});
app.listen(3000);
