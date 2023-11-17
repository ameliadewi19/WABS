const User = require("../models/UserModel.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUser = async(req, res) =>{
    try {
        const response = await User.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

const login = async (req, res) => {
  console.log("Username yang dicari:", req.body.username);
 try {
      const user = await User.findOne({
          where: {
              username: req.body.username
          }
      });
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(400).json({ msg: "Password salah" });
      const userID = user.id;
      const username = user.username;
      const accessToken = jwt.sign({ userID, username }, process.env.ACCESS_TOKEN_SECRET);

      const refreshToken = jwt.sign({ userID, username }, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: '1d'
      });

      await User.update({ refresh_token: refreshToken }, {
          where: {
              id: userID
          }
      });

      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.json({ accessToken });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

const logout = async (req, res) => {
    console.log("Logout");
    const refreshToken = req.cookies.refreshToken;

    console.log("refreshToken:", refreshToken);

    if (!refreshToken) return res.sendStatus(204);

    // Mencari admin berdasarkan refreshToken
    const user = await User.findOne({
        where: {
            refresh_token: refreshToken
        }
    });

    if (!user) return res.sendStatus(204);

    const userID = user.id;

    // Hapus refreshToken dari admin
    await User.update({ refresh_token: null }, {
        where: {
            id: userID
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

module.exports={
    getUser,
    login,
    logout
}