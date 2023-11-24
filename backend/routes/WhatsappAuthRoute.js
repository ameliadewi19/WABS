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

router.post('/test-client', async (req, res) => {
  const { phone, msg } = req.body;

  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
      clientId: "YOUR_CLIENT_ID",
    }),
  });

  try {
    console.log('Phone:', phone);
    console.log('Message:', msg);

    whatsappClient.on('ready', () => {
      console.log('Client is ready!');
      
      const number = phone;
      const text = msg;
      const chatId = number.substring(1) + "@c.us";

      whatsappClient.sendMessage(chatId, text, { quotedMessageId: null })
        .then(() => {
          console.log('Message sent successfully!');
          // Send the response only if it hasn't been sent yet
          if (!res.headersSent) {
            res.status(200).json({ success: true, message: 'Message sent successfully' });
          }
        })
        .catch((err) => {
          console.error('Error sending message:', err);
          // Send the response only if it hasn't been sent yet
          if (!res.headersSent) {
            res.status(500).json({ error: 'Error sending message' });
          }
        })
      });

    await whatsappClient.initialize();

    // Add a delay (e.g., 5 seconds) before destroying the client
    setTimeout(async () => {
      await whatsappClient.destroy();
    }, 5000);
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    // Send the response only if it hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
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
