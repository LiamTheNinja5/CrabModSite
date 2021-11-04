// const cron = require('node-cron');
// const axios = require('axios')
// const Logger = require('../util/Logger');
// const Calls = require('../database/functions')
// require('dotenv').config()

// function setCron() {
//     cron.schedule('0 1 * * *', updateRealtime);
// }

// let CLIENT = process.env.PAYPAL_KEY_CLIENT_ID;
// let SECRET = process.env.PAYPAL_KEY_CLIENT_SECRET;
// let PAYPAL_API = process.env.PAYPAL_API_URL;

// async function updateRealtime() {
//     let allServers = await Calls.getAllServers();
//     allServers.forEach(async (server) => {
//         if (!server.payments) return
//         if (server.payments.paypal.sub.status == 'CANCELLED') return
//         axios.get(PAYPAL_API+'/v1/billing/subscriptions/'+server.payments.paypal.sub.id, {
//             auth: {
//                 username: CLIENT,
//                 password: SECRET
//             },
//             timout: 10000
//         })
//         .then(async response => {
//             let planNumber = 0
//             if (response.data.status == 'ACTIVE') planNumber = server.plan
//             await Calls.updatePaymentData(server.uuid, response.data, planNumber)
//         })
//         .catch(err => {
//             Logger.info('Cron Error', err)
//         })
//     });
// }

// module.exports = {
//     setCron
// };
