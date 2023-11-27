const express = require('express');
const router = express.Router();
const wbm = require("wbm");
const axios = require('axios');

const { Client, LocalAuth } = require('whatsapp-web.js');

const allSessionsObject = {};

const { 
    authenticateWhatsApp
} = require('../controllers/WhatsappAuthController.js');

// router.get('/getQRCode', async (req, res) => {
//   const whatsappClient = new Client({
//     puppeteer: {
//       headless: false
//     },
//     authStrategy: new LocalAuth({
//         clientId: "YOUR_CLIENT_ID",
//     }),
//   });

//   console.log("getQRCode");

//   try {
//     whatsappClient.on('qr', (qr) => {
//       // Respond with the QR code data
//       res.json({ qrCodeData: qr });
//     });

//     await whatsappClient.initialize();
//     await whatsappClient.destroy();

    
//   } catch (error) {
//     console.error('Error initializing WhatsApp client:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

router.get('/getQRCode', async (req, res) => {
  const whatsappClient = new Client({
    puppeteer: {
      headless: true
    },
    authStrategy: new LocalAuth({
        clientId: "YOUR_CLIENT_ID",
    }),
  });

  console.log("getQRCode");

  try {
    whatsappClient.on('qr', async (qr) => {
      // Respond with the QR code data
      // res.json({ qrCodeData: qr });

      const qrCodeData = await whatsappClient.pupPage.screenshot();
      res.json({ qrCodeData: qr });
    });

    console.log('Starting initialization...');
    await whatsappClient.initialize();
    console.log('Initialization completed.');

    // await whatsappClient.destroy();
 
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await whatsappClient.destroy();
  }
});

// router.post('/test-client', async (req, res) => {
//   const { phone, msg } = req.body;

//   const whatsappClient = new Client({
//     puppeteer: {
//       headless: true
//     },
//     authStrategy: new LocalAuth({
//       clientId: "YOUR_CLIENT_ID",
//     }),
//   });

//   try {
//     console.log('Phone:', phone);
//     console.log('Message:', msg);

//     whatsappClient.on('ready', () => {
//       console.log('Client is ready!');
      
//       const number = phone;
//       const text = msg;
//       const chatId = number.substring(1) + "@c.us";

//       whatsappClient.sendMessage(chatId, text, { quotedMessageId: null })
//         .then(() => {
//           console.log('Message sent successfully!');
//           // Send the response only if it hasn't been sent yet
//           if (!res.headersSent) {
//             res.status(200).json({ success: true, message: 'Message sent successfully' });
//           }
//         })
//         .catch((err) => {
//           console.error('Error sending message:', err);
//           // Send the response only if it hasn't been sent yet
//           if (!res.headersSent) {
//             res.status(500).json({ error: 'Error sending message' });
//           }
//         })
//       });

//     await whatsappClient.initialize();

//     // Add a delay (e.g., 5 seconds) before destroying the client
//     setTimeout(async () => {
//       await whatsappClient.destroy();
//     }, 5000);
//   } catch (error) {
//     console.error('Error initializing WhatsApp client:', error);
//     // Send the response only if it hasn't been sent yet
//     if (!res.headersSent) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   } 
// });

router.post('/test-client', async (req, res) => {
  const { phone, msg } = req.body;

  const whatsappClient = new Client({
    puppeteer: {
      headless: true
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

    console.log('Starting initialization...');
    await whatsappClient.initialize();
    console.log('Initialization completed.');

    // Add a delay (e.g., 5 seconds) before destroying the client
    setTimeout(async () => {
      await whatsappClient.destroy();
    }, 10000);
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    // Send the response only if it hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } 
});

// router.get('/getAuthStatus', async (req, res) => {
//   let status = 'Not Authenticated';

//   const whatsappClient = new Client({
//     puppeteer: {
//       headless: true
//     },
//     authStrategy: new LocalAuth({
//       clientId: "YOUR_CLIENT_ID",
//     }),
//   });

//   whatsappClient.on('qr', (qr) => {
//     // Respond with the QR code data
//     setImmediate(() => whatsappClient.destroy());
//     res.json('Not Authenticated');
//   });

//   whatsappClient.on('ready', () => {
//     console.log('Client is authenticated!');
//     setImmediate(() => whatsappClient.destroy());
//     res.json('Authenticated');
//   });

//   try {
//     await whatsappClient.initialize();
//     await whatsappClient.destroy();
//   } catch (error) {
//     console.error('Error initializing WhatsApp client:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   } 
// });

router.get('/getAuthStatus', async (req, res) => {
  let responseSent = false; // Flag to track if a response has been sent

  const whatsappClient = new Client({
    puppeteer: {
      headless: true
    },
    authStrategy: new LocalAuth({
      clientId: "YOUR_CLIENT_ID",
    }),
  });

  whatsappClient.on('qr', () => {
    if (!responseSent) {
      // Respond with the status
      console.log('Not Authenticated');
      res.json('Not Authenticated');
      responseSent = true; // Set the flag to true
      whatsappClient.destroy();
    }
  });

  console.log(responseSent);

  whatsappClient.on('ready', async () => {
    // if (!responseSent) {
      console.log('Client is authenticated!');
      res.json('Authenticated');
      await whatsappClient.destroy();
    // }
  });

  try {
    console.log('Starting initialization...');
    await whatsappClient.initialize();
    console.log('Initialization completed.');

    // Destroy the client after the response is sent
    // await whatsappClient.destroy();
    // Note: You may also want to listen for the 'authenticated' event if available
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    // if (!responseSent) {
      res.status(500).json({ error: 'Internal server error' });
      responseSent = true; // Set the flag to true
    // }
  } finally {
    await whatsappClient.destroy();
  } 
});



// router.get('/logout', async (req, res) => {
//   const whatsappClient = new Client({
//     puppeteer: {
//       headless: false
//     },
//     authStrategy: new LocalAuth({
//       clientId: "YOUR_CLIENT_ID",
//     }),
//   });

//   try {
//     whatsappClient.on('ready', async () => {
//       console.log('Client is ready!');
      
//       try {
//         // Attempt to log out once the client is ready
//         await whatsappClient.logout();
//         // Listen for the 'disconnected' event to detect when the client has successfully logged out
//         res.status(200).json('Success Logout!');
//       } catch (logoutError) {
//         console.error('Error during logout:', logoutError);
//         res.status(500).json({ error: 'Error during logout' });
//       } finally {
//         // Always destroy the client, whether there's an error or not
//         await whatsappClient.destroy();
//       }
//     });

//     await whatsappClient.initialize();
//   } catch (error) {
//     console.error('Error initializing WhatsApp client:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/logout', async (req, res) => {
  const whatsappClient = new Client({
    puppeteer: {
      headless: true
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
        // Listen for the 'disconnected' event to detect when the client has successfully logged out
        res.status(200).json('Success Logout!');
      } catch (logoutError) {
        console.error('Error during logout:', logoutError);
        res.status(500).json({ error: 'Error during logout' });
      } finally {
        // Always destroy the client, whether there's an error or not
        await whatsappClient.destroy();
      }
    });

    console.log('Starting initialization...');
    await whatsappClient.initialize();
    console.log('Initialization completed.');
  } catch (error) {
    console.error('Error initializing WhatsApp client:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
