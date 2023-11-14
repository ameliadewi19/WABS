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

function calculateSchedule(item){
    if(item.jenis_schedule === "harian"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'days');
        }
        return schedule;
    } else if (item.jenis_schedule === "mingguan"){
        const schedule = [];
        const currentDate = moment(item.tanggal_mulai);

        while (currentDate <= moment(item.tanggal_akhir)) {
            schedule.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(7, 'days');
        }
        return schedule;
    } else if (item.jenis_schedule === "bulanan"){
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

async function setupCronJobs() {
    const data = await fetchSchedule();

    data.forEach((item) => {
        const schedule = calculateSchedule(item);
        
        schedule.forEach((date) => {
            const [jam, menit, detik] = item.waktu.split(':');
            const cronSchedule = `${menit} ${jam} * * *`;
            const job = cron.schedule(cronSchedule, () => {
                const today = moment().format('YYYY-MM-DD');
                if (today === date) {
                    console.log(`Sending message ${item.id_message} at ${date} ${item.waktu}...`);
                }
            }, {
                scheduled: true,
                timezone: 'Asia/Jakarta'
            });
            job.start();
            console.log(`Cron job untuk tanggal ${date} dari id ${item.id} telah diatur.`)
        });
    });
}

setupCronJobs();