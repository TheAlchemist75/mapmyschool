// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const router = express.Router();

// // Register Route
// router.post("/register", async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     user = new User({ username, email, password });

//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     await user.save();

//     const payload = { user: { id: user.id } };

//     jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid Credentials" });
//     }

//     const payload = { user: { id: user.id } };

//     jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
//       if (err) throw err;
//       res.json({ token });
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;
// -------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust the path as necessary

// Register a new user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        username: user.username, // Include username in the payload
      },
    };

    jwt.sign(
      payload,
      "your_jwt_secret", // Replace with your JWT secret
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;