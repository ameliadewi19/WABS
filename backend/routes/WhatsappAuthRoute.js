const express = require('express');
const router = express.Router();
const wbm = require("wbm");

const { Client, LocalAuth } = require('whatsapp-web.js');

const allSessionsObject = {};

const { 
    authenticateWhatsApp
} = require('../controllers/WhatsappAuthController.js');

router.get('/getQRCode', async (req, res) => {
  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
        clientId: "YOUR_CLIENT_ID",
    }),
  });

  console.log("getQRCode");

  whatsappClient.on('qr', (qr) => {
      // Respond with the QR code data
      res.json({ qrCodeData: qr });
  });

  try { await whatsappClient.initialize() } catch {}
});

router.get('/getAuthStatus', async (req, res) => {
  let status = 'Not Authenticated';

  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
      clientId: "YOUR_CLIENT_ID",
    }),
  });

  whatsappClient.on('qr', (qr) => {
    // Respond with the QR code data
    setImmediate(() => whatsappClient.destroy());
    res.json('Not Authenticated');
  });

  whatsappClient.on('ready', () => {
    console.log('Client is authenticated!');
    setImmediate(() => whatsappClient.destroy());
    res.json('Authenticated');
  });

  try {
    await whatsappClient.initialize();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});

router.get('/logout', async (req, res) => {
  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
      clientId: "YOUR_CLIENT_ID",
    }),
  });

  try {
    whatsappClient.on('ready', async () => {
      console.log('Client is ready!');
      
      try {
        // Attempt to log out once the client is ready
        await whatsappClient.logout();
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
        res.status(500).json({ error: 'Error during logout' });
      } finally {
        // Always destroy the client, whether there's an error or not
        await whatsappClient.destroy();
      }
    });

    // Listen for the 'disconnected' event to detect when the client has successfully logged out
    whatsappClient.on('disconnected', (reason) => {
      console.log(`Client has been disconnected. Reason: ${reason}`);
      res.status(200).json('Success Logout!');
    });

    await whatsappClient.initialize();
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
