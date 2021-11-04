const cron = require('node-cron');
const Logger = require('../util/Logger');
const Calls = require('../database/functions')
require('dotenv').config()

function setCron() {
    cron.schedule('* * * * *', updateRealtime);
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

module.exports = {
    setCron
};
