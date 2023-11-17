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

    await wbm.start({ showBrowser: true, session: true});

    const template = await TemplateMessage.findByPk(id_template);

    // console.log('template', template.message);

    if (!template) {
        res.status(404).json({ message: 'Template not found' });
        return;
    }

    // Fetch recipient data based on the recipientList
    const recipients = await Recipient.findAll({
    where: {
      id: recipientList,
        },
    });

    // console.log('Recipient Data:', recipients);

    const contacts = recipients.map(data => ({
        nama: data.nama,
        no_whatsapp: data.no_whatsapp
    }));

    console.log(contacts);

    let contactCounter = 0;

    const sendNextContact = async () => {
        if (contactCounter < contacts.length) {
            const contact = contacts[contactCounter];

            const seen = new Set(); // To keep track of which messages have been added

            const message = `${template.message.replace('{{nama}}', contact.nama)}}`;
            console.log(message);
            console.log(contact.no_whatsapp);

            await wbm.send([contact.no_whatsapp], message); // wbm.send() expects an array of phone numbers
            const timeoutMillis = 15000;
            await new Promise(resolve => setTimeout(resolve, timeoutMillis));

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
