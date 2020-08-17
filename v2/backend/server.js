require('dotenv').config()
const db = require("./helpers/db");
const express = require("express");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("./models/user.model");
const BearerStrategy = require('passport-http-bearer');
const cors = require('cors');
const helmet = require("helmet");
const path = require('path');
const app = express();

app.use(helmet());
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(cors());

app.use(express.static(path.join(__dirname, '__BUILD'))); // React build

const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

const server_port = process.env.PORT;

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 15 minutes
  max: 100
});

passport.use(
  "bearer",
  new BearerStrategy(async (token, done) => {
    console.log(token)
    try {
      await User.findOne({ access_token: token }, async function (err, user) {
        console.log(err)
        if (err) {
          return done(err, false, { message: "Invalid token." });
        }
        if (!user) {
          return done(err, false, { message: "Wrong token." });
        }
        return done(null, token, { message: "Token valid." });
      });
    } catch (error) {
      done(error);
    }
  })
);

// prepare jwt login
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        await User.findOne({ email: username }, async function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user)
            return done(null, false, { message: "Incorrect username." });
          let passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            return done(null, user, { message: "Logged in Successfully" });
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

app.use("/v2/", apiLimiter);
app.use("/v2", apiRoutes);
app.use("/auth", authRoutes);

// Handles React frontend requests
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'__BUILD/index.html'));
});

db.connectDb().then(async () => {
  app.listen(server_port, () =>
    console.log(`LotR backend listening on port ${server_port}!`)
  );
});
