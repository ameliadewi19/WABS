const { as } = require("pg-promise");
const User = require("../models/UserModel.js");
const jwt = require('jsonwebtoken');
const { ca } = require("date-fns/locale");

const refreshToken = async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await User.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if(!user) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) return res.sendStatus(403);
            const adminId = user[0].id;
            const username = user[0].username;
            const accessToken = jwt.sign({ adminId, username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20s'
            });
            res.json({ accessToken });
        });
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    refreshToken
};