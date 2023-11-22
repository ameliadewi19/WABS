const { Client, LocalAuth } = require('whatsapp-web.js');

const whatsappClient = new Client({
  puppeteer: {
    headless: false
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
  }),
});

whatsappClient.initialize();

module.exports = whatsappClient;
