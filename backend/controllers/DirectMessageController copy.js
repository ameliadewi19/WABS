const wbm = require('wbm');
const axios = require('axios');
const TemplateMessage = require("../models/TemplateMessageModel.js"); // Sesuaikan dengan path yang benar
const Recipient = require("../models/RecipientModel.js");
const { format } = require('date-fns');

const MAX_MESSAGES_PER_INTERVAL = 10; // Adjust as needed
const MINUTE_INTERVAL = 1; // Adjust as needed

const directMessagesGeneral = async (req, res) => {
    try {
      const { id_template, recipientList } = req.body;
  
      console.log('Received Direct Message Submission:');
      console.log('ID Template:', id_template);
      console.log('Recipient List:', recipientList);
  
      await wbm.start({ showBrowser: true, session: true });
  
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
  
      console.log(contacts);
  
      let contactCounter = 0;
  
      const sendNextContact = async () => {
        if (contactCounter < contacts.length) {
          const contact = contacts[contactCounter];
          const message = `${template.message.replace('{{nama}}', contact.nama)}`;
  
          // Send two messages for the first contact, one for the rest
          const messageCount = contactCounter === 0 ? 2 : 1;
  
          for (let i = 0; i < messageCount; i++) {
            await wbm.send([contact.no_whatsapp], message);
            const timeoutMillis = 30000;
            await new Promise(resolve => setTimeout(resolve, timeoutMillis));
          }
  
          contactCounter++;
  
          if (contactCounter < contacts.length && contactCounter % MAX_MESSAGES_PER_INTERVAL === 0) {
            setTimeout(sendNextContact, MINUTE_INTERVAL * 60 * 1000);
          } else {
            sendNextContact();
          }
        } else {
          await wbm.end();
        }
      };
  
      sendNextContact();
  
      res.status(200).json({ message: 'Direct message submitted successfully.' });
    } catch (error) {
      console.error('Error handling direct message submission:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
module.exports = {
    directMessagesGeneral,
};
