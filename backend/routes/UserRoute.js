const express = require("express");
const { getUser,login, logout} = require("../controllers/LoginController.js");
const {verifyToken} = require("../middleware/VerifyToken.js");
const {refreshToken} = require("../controllers/RefreshToken.js");

const router = express.Router(); // Definisikan objek router terlebih dahulu

router.get('/user',verifyToken,getUser);
router.post('/login', login);
router.get('/token', refreshToken);
router.delete('/logout', logout);


module.exports = router; // Export objek router