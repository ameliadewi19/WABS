const express = require('express');
const router = express.Router();
const wbm = require("wbm");

const { 
    authenticateWhatsApp
} = require('../controllers/WhatsappAuthController.js');

router.get("/authenticate", async (req, res) => {
  wbm.start({qrCodeData: true, session: true, showBrowser: true})
  .then(async qrCodeData => {
    if (qrCodeData) {
      console.log(qrCodeData); // show data used to generate QR Code
      res.send(qrCodeData);
      await wbm.waitQRCode();
      const timeoutMillis = 20000;
      await new Promise(resolve => setTimeout(resolve, timeoutMillis));
      await wbm.end();
    } else {
      console.log('Authentication successful, no QR Code needed.');
      res.send('Authentication successful, no QR Code needed.');
    }
  } ).catch(err => { console.log(err); });

});  

router.get("/authenticate-status", async (req, res) => {
  try {
    const qrCodeData = await wbm.start({ qrCodeData: true, session: true, showBrowser: true });

    if (qrCodeData) {
      console.log(qrCodeData); // show data used to generate QR Code
      res.send('Not Authenticated');
      // await wbm.waitQRCode();
      await wbm.end();
    } else {
      console.log('Authentication successful, no QR Code needed.');
      res.send('Authenticated');
      await wbm.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post("/test-client", async (req, res) => {
  const { phone, msg } = req.body;

  console.log(phone, msg);
  wbm
    .start({ qrCodeData: true, session: true, showBrowser: true })
    .then(async (qrCodeData) => {

      console.log(qrCodeData); // show data used to generate QR Code
      await wbm.waitQRCode();

      const phones = [phone];
      const message = msg;

      await wbm.send(phones, message);
      const timeoutMillis = 15000;
      await new Promise(resolve => setTimeout(resolve, timeoutMillis));

      await wbm.end();
    })
    
    .catch((err) => {
      console.log(err);
    });

});

module.exports = router;
