const cron = require('node-cron');
const Logger = require('../util/Logger');
const Calls = require('../database/functions')
require('dotenv').config()

function setCron() {
    cron.schedule('* * * * *', updateRealtime);
    cron.schedule('* * * * *', saveStats);
}

async function updateRealtime() {
    try {
        let allUsers = await Calls.getAllRealtime();
        for (let i = 0; i < allUsers.length; i++) {
            let user = allUsers[i];
            if (user.latest_update < Math.floor(Date.now()/1000)-300) {
                await Calls.removeRealtime(user.steamid);
            }
        }
    } catch (e) {
        console.log(e)
    }
}

async function saveStats() {
    try {
        let realtime = await Calls.getAllRealtimeFiltered(0);
        let realtime_in_games = await Calls.getAllRealtimeFiltered(1);
        let total_realtime = await Calls.getAllRealtime();
        let allusers = await Calls.getAllUsers();
        await Calls.saveMetrics(realtime.length, realtime_in_games.length, allusers.length, total_realtime.length);

    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    setCron
};
