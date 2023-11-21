const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment');

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
    if(item.jenis_schedule === "daily"){
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
                if(!scheduledJobs[item.id]){
                    const job = cron.schedule(cronSchedule, () => {
                        console.log(`Scheduled job for date ${date} and ID ${item.id}`);
                    
                        item.recipient_list.forEach((recipient) => {
                            console.log(`Send message to ${recipient.recipients.nama}`);
                        });
                    }, {
                        scheduled: true,
                        timezone: 'Asia/Jakarta'
                    });
                    job.start();
                    
                    // Simpan referensi pekerjaan cron
                    scheduledJobs[item.id] = job;
                    console.log(`Cron job untuk tanggal ${date} dari id ${item.id} telah diatur.`)
                }
            } 
        });
    });
}

setupCronJobs();

module.exports = {
    setupCronJobs
};