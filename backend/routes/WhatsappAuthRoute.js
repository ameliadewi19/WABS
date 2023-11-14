const express = require('express');
const router = express.Router();
const wbm = require("wbm");

const { 
    authenticateWhatsApp
} = require('../controllers/WhatsappAuthController.js');

router.post("/authenticate", async (req, res) => {
  const { phone, msg } = req.body;

  console.log(phone, msg);
  wbm
    .start({ qrCodeData: true, session: true, showBrowser: true })
    .then(async (qrCodeData) => {
      console.log(qrCodeData); // show data used to generate QR Code
      res.send(qrCodeData);
      await wbm.waitQRCode();

      const phones = [phone];
      const message = msg;

      await wbm.send(phones, message);
      const timeoutMillis = 15000;
      await new Promise(resolve => setTimeout(resolve, timeoutMillis));
      await wbm.send(phones, message);

      await wbm.end();
    })
    .catch((err) => {
      console.log(err);
    });

});  

module.exports = router;
