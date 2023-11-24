const wbm = require('wbm');
const axios = require('axios');
const TemplateMessage = require("../models/TemplateMessageModel.js"); // Sesuaikan dengan path yang benar
const Recipient = require("../models/RecipientModel.js");
const Activity = require("../models/ActivityModel.js");
const { format } = require('date-fns');
const { Client, LocalAuth } = require('whatsapp-web.js');

const allSessionsObject = {};

const MAX_MESSAGES_PER_INTERVAL = 10; // Adjust as needed
const MINUTE_INTERVAL = 1; // Adjust as needed

const directMessagesGeneral = async (req, res) => {
  console.log("directMessagesGeneral");

  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
        clientId: "YOUR_CLIENT_ID",
    }),
  });

    try {
      const { id_template, recipientList } = req.body;

      console.log(req.body);

      const template = await TemplateMessage.findByPk(id_template);
  
      if (!template) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }
  
      const recipients = await Recipient.findAll({
        where: {
          id: recipientList,
        },
      });
  
      const contacts = recipients.map(data => ({
        nama: data.nama,
        no_whatsapp: data.no_whatsapp
      }));
  
      // console.log(contacts);
  
      let contactCounter = 0;
  
      const sendNextContact = async () => {
        if (contactCounter < contacts.length) {
          const contact = contacts[contactCounter];
          const message = `${template.message.replace('{{nama}}', contact.nama)}`;
  
          whatsappClient.on('ready', () => {
            console.log('Client is ready!');
            
            // Number where you want to send the message.
            const number = contact.no_whatsapp;

            console.log(number);
            
            // Your message.
            const text = message;
            
            // Getting chatId from the number.
            // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
            const chatId = number.substring(1) + "@c.us";
    
            // Sending message.
            whatsappClient.sendMessage(chatId, text);
    
            // res.status(200).json({ success: true, message: 'Messages sent successfully' });
          });

          contactCounter++;
  
          if (contactCounter < contacts.length && contactCounter % MAX_MESSAGES_PER_INTERVAL === 0) {
            setTimeout(sendNextContact, MINUTE_INTERVAL * 60 * 1000);
          } else {
            sendNextContact();
          }
        } 
      };
  
      sendNextContact();

      whatsappClient.initialize();
  
      res.status(200).json({ message: 'Direct message submitted successfully.' });
    } catch (error) {
      console.error('Error handling direct message submission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

const directMessagesActivity = async (req, res) => {
  const whatsappClient = new Client({
    puppeteer: {
      headless: false
    },
    authStrategy: new LocalAuth({
      clientId: "YOUR_CLIENT_ID",
    }),
  });

  try {
    const { id_template, recipientList, id_activity } = req.body;

    console.log(req.body);

    const template = await TemplateMessage.findByPk(id_template);

    if (!template) {
      res.status(404).json({ message: 'Template not found' });
      return;
    }

    const recipients = await Recipient.findAll({
      where: {
        id: recipientList,
      },
    });

    const activity = await Activity.findOne({
      where: {
        id_activity: id_activity,
      },
    });

    console.log(activity.activity_name);

    const contacts = recipients.map(data => ({
      nama: data.nama,
      no_whatsapp: data.no_whatsapp
    }));

    let contactCounter = 0;

    const sendNextContact = async () => {
      if (contactCounter < contacts.length) {
        const contact = contacts[contactCounter];
        const message = template.message
          .replace('{{nama}}', contact.nama)
          .replace('{{nama_kegiatan}}', activity.activity_name)
          .replace('{{tanggal}}', activity.activity_date)
          .replace('{{keterangan}}', activity.activity_description);

        console.log(message);
        whatsappClient.on('ready', () => {
          console.log('Client is ready!');

          // Number where you want to send the message.
          const number = contact.no_whatsapp;

          console.log(number);

          // Your message.
          const text = message;

          // Getting chatId from the number.
          // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
          const chatId = number.substring(1) + "@c.us";

          // Sending message.
          whatsappClient.sendMessage(chatId, text);

        });

        contactCounter++;

        if (contactCounter < contacts.length && contactCounter % MAX_MESSAGES_PER_INTERVAL === 0) {
          setTimeout(sendNextContact, MINUTE_INTERVAL * 60 * 1000);
        } else {
          sendNextContact();
        }
      }
    };

    sendNextContact();

    whatsappClient.initialize();

    res.status(200).json({ message: 'Direct message submitted successfully.' });
  } catch (error) {
    console.error('Error handling direct message submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    directMessagesGeneral,
    directMessagesActivity
};
