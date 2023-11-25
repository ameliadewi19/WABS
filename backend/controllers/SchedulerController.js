const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment');
const { Client, LocalAuth } = require('whatsapp-web.js');
const TemplateMessage = require("../models/TemplateMessageModel.js"); // Sesuaikan dengan path yang benar
const { fi } = require('date-fns/locale');

const allSessionsObject = {};

const MAX_MESSAGES_PER_INTERVAL = 10; // Adjust as needed
const MINUTE_INTERVAL = 1; // Adjust as needed

async function sendMessageGeneral(id_message, listContacts) {
    const whatsappClient = new Client({
        puppeteer: {
          headless: true
        },
        authStrategy: new LocalAuth({
            clientId: "YOUR_CLIENT_ID",
        }),
    });

    try {
    
        const template = await TemplateMessage.findByPk(id_message);
    
        if (!template) {
          res.status(404).json({ message: 'Template not found' });
          return;
        }
    
        const contacts = listContacts.map(data => ({
            nama: data.recipients.nama,
            no_whatsapp: data.recipients.no_whatsapp
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
                whatsappClient.sendMessage(chatId, text, { quotedMessageId: null })
                    .then(() => {
                        console.log('Message sent successfully!');
                        // Send the response only if it hasn't been sent yet
                        // if (!res.headersSent) {
                        // res.status(200).json({ success: true, message: 'Message sent successfully' });
                        // }
                    })
                    .catch((err) => {
                        console.error('Error sending message:', err);
                        // Send the response only if it hasn't been sent yet
                        // if (!res.headersSent) {
                        // res.status(500).json({ error: 'Error sending message' });
                        // }
                    })
        
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

          await whatsappClient.initialize();
      
            // Add a delay (e.g., 5 seconds) before destroying the client
            setTimeout(async () => {
              await whatsappClient.destroy();
            }, 5000);
      } catch (error) {
        console.error('Error handling direct message submission:', error);
      }
}

async function sendMessageActivity(id_message, id_activity, listContacts) {
    const whatsappClient = new Client({
        puppeteer: {
          headless: true
        },
        authStrategy: new LocalAuth({
            clientId: "YOUR_CLIENT_ID",
        }),
    });

    try {
    
        const template = await TemplateMessage.findByPk(id_message);
    
        if (!template) {
          res.status(404).json({ message: 'Template not found' });
          return;
        }

        const activity = await fetchActivity(id_activity);
    
        const contacts = listContacts.map(data => ({
            nama: data.recipients.nama,
            no_whatsapp: data.recipients.no_whatsapp
          }));
      
          // console.log(contacts);
      
          let contactCounter = 0;
      
          const sendNextContact = async () => {
            if (contactCounter < contacts.length) {
              const contact = contacts[contactCounter];
              const message = template.message
                        .replace('{{nama}}', contact.nama)
                        .replace('{{nama_kegiatan}}', activity.activity_name)
                        .replace('{{tanggal}}', activity.activity_date)
                        .replace('{{keterangan}}', activity.activity_description);
      
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
                whatsappClient.sendMessage(chatId, text, { quotedMessageId: null })
                    .then(() => {
                        console.log('Message sent successfully!');
                        // Send the response only if it hasn't been sent yet
                        // if (!res.headersSent) {
                        // res.status(200).json({ success: true, message: 'Message sent successfully' });
                        // }
                    })
                    .catch((err) => {
                        console.error('Error sending message:', err);
                        // Send the response only if it hasn't been sent yet
                        // if (!res.headersSent) {
                        // res.status(500).json({ error: 'Error sending message' });
                        // }
                    })
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

          await whatsappClient.initialize();
      
            // Add a delay (e.g., 5 seconds) before destroying the client
            setTimeout(async () => {
              await whatsappClient.destroy();
            }, 5000);
      } catch (error) {
        console.error('Error handling direct message submission:', error);
      } 
}

async function fetchSchedule() {
    try {
        const response = await axios.get('http://localhost:5005/schedule');
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchActivity(id) {
    try {
        const response = await axios.get(`http://localhost:5005/activity/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function fetchMessage(id) {
    try {
        const response = await axios.get(`http://localhost:5005/template-messages/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

function calculateSchedule(item){
    if(item.jenis_schedule === "once"){
        const schedule = [];
        schedule.push(item.tanggal_mulai);
        return schedule;
    }
    else if(item.jenis_schedule === "daily"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'days');
        }
        return schedule;
    } else if (item.jenis_schedule === "weekly"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(7, 'days');
        }
        return schedule;
    } else if (item.jenis_schedule === "monthly"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'months');
        }
        return schedule;
    } else if (item.jenis_schedule === "annually"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'years');
        }
        return schedule;
    } else {
        return [];
    }
}

const scheduledJobs = {}; // Objek untuk menyimpan referensi pekerjaan cron yang sudah dijadwalkan

async function setupCronJobs() {
    const data = await fetchSchedule();
    const today = moment().format('YYYY-MM-DD');

    data.forEach((item) => {
        const schedule = calculateSchedule(item);
        schedule.forEach((date) => {
            // Tambahkan pengecekan apakah tanggal sudah terlewat
            if (moment(date).isSame(today, 'day')) {
                const [jam, menit, detik] = item.waktu.split(':');
                const cronSchedule = `${menit} ${jam} * * *`;
                const job = cron.schedule(cronSchedule, () => {
                    console.log(`Scheduled job for date ${date} and ID ${item.id}`);
                    if(item.jenis_message === 'general'){
                        // const recipientList = []
                        // item.recipient_list.forEach((recipient) => {
                        //     recipientList.push(recipient.id_recipient);
                        // });
                        // console.log("id_template", item.id_message);
                        // console.log("recipientList", recipientList);
                        // axios.post('http://localhost:5005/direct-message', {
                        //     id_template: item.id_message,
                        //     recipientList: recipientList,
                        // }, {
                        //     timeout: 5000  // Set the timeout in milliseconds (adjust as needed)
                        // });
                        sendMessageGeneral(item.id_message, item.recipient_list);
                    } else if(item.jenis_message === 'activity'){
                        // const recipientList = []
                        // item.recipient_list.forEach((recipient) => {
                        //     recipientList.push(recipient.id_recipient);
                        // });
                        // console.log("id_template", item.id_message);
                        // console.log("recipientList", recipientList);
                        // console.log("id_activity", item.id_activity);
                        // axios.post('http://localhost:5005/direct-message-activity', {
                        //     id_template: item.id_message,
                        //     recipientList: recipientList,
                        //     id_activity: item.id_activity
                        // }, {
                        //     timeout: 5000  // Set the timeout in milliseconds (adjust as needed)
                        // });
                        sendMessageActivity(item.id_message, item.id_activity, item.recipient_list)
                    }
                }, {
                    scheduled: true,
                    timezone: 'Asia/Jakarta'
                });
                
                job.start();
                console.log(`Cron job untuk tanggal ${date} dari id ${item.id} telah diatur.`)
            } 
        });
    });
}

setupCronJobs();

module.exports = {
    setupCronJobs
};