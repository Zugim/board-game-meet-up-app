const express = require("express");
const router = express.Router();
const knex = require("../knex");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bcrypt = require("bcryptjs");

router.use(express.json());

const sessionOptions = {
  store: new pgSession({
    conString:
      process.env.DATABASE_URL ||
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  }),
  name: "bg_auth",
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: ENVIRONMENT === "development" ? false : true,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,
};

router.use(session(sessionOptions));

// register endpoint
router.post("/register", async (req, res) => {
  const userData = req.body;

  userData.password = bcrypt.hashSync(userData.password, 10);

  try {
    const [user] = await knex("users")
      .insert({
        username: userData.username,
        password: userData.password,
        city: userData.city,
      })
      .returning(["id", "username", "city"]);

    res.status(201).json({ message: "Successfully registered", user });
  } catch (err) {
    res.status(500).json({ message: "Error registering" });
    throw err;
  }
});

// login endpoint
router.post("/login", async (req, res) => {
  const userData = req.body;

  try {
    const user = await knex("users")
      .select("id", "username", "password")
      .where("username", userData.username)
      .first();

    if (user && bcrypt.compareSync(userData.password, user.password)) {
      req.session.user = user;

      res.status(200).json({
        message: "Successfully logged in",
        user: { id: user.id, username: user.username },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
    throw err;
  }
});

// logout endpoint
router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json({ message: "Unable to log out" });
        throw err;
      } else {
        res.json({ message: "Logout successful" });
      }
    });
  } else {
    res.json({ message: "Error logging out" });
  }
});

// authentication endpoint
router.get("/user", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await knex("users")
      .select("id", "username", "city")
      .where({ id: req.session.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found", user });
    }

    res.json({ message: "Auth successful", user });
  } catch (err) {
    res.json({ message: "Error authenticating" });
    throw err;
  }
});

module.exports = router;
