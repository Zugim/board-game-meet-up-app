const express = require("express");
const cors = require("cors");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const bcrypt = require("bcryptjs");
const path = require("path");
const knex = require("./knex");

const app = express();

// checks if in development or production
ENVIRONMENT = process.env.NODE_ENV || "development";
console.log("ENVIRONMENT", ENVIRONMENT);

if (ENVIRONMENT === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
} else {
  app.use("/", express.static(path.join(__dirname, "../../client/dist")));
}

app.use(express.json());

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

app.use(session(sessionOptions));

// AUTHENTICATION

// REGISTER
app.post("/api/auth/register", async (req, res) => {
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

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error saving the user" });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  const userData = req.body;

  try {
    const user = await knex("users")
      .where("username", userData.username)
      .first();

    if (user && bcrypt.compareSync(userData.password, user.password)) {
      req.session.user = user;

      res.status(200).json({ message: "Successfully logged in" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// DELETE /api/auth/logout
app.delete("/api/auth/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send("Unable to log out");
      } else {
        res.send("Logout successful");
      }
    });
  } else {
    res.end();
  }
});

app.get("/api/auth/user", (req, res) => {
  if (!req.session.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  knex("users")
    .select("id", "username", "city")
    .where({ id: req.session.user.id })
    .first()
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    })
    .catch((error) => {
      console.error("Database connection error.", error);
      res.status(500).json({ error: error.message });
    });
});

// test endpoints
app.get("/api/user", async (req, res) => {
  try {
    const users = await knex.select(`*`).from("users").limit(100);
    res.json({ users });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`We can hear you over on port ${PORT} 👂`);
});
