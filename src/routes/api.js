const { default: axios } = require('axios');
const Router = require('../classes/Router');
const Calls = require('../database/functions');
require('dotenv').config()

class API extends Router {
    constructor(client) {
        super(client, '/api/v1');
    }

    createRoute() {
        this.router.get('/live', async (req, res) => {
            let realtime_users = await Calls.getAllRealtime();
            let realtime_users_in_lobbys = await Calls.getAllRealtimeStatus(1);
            res.status(200).json({
                players_online: realtime_users.length,
                players_in_lobby: realtime_users_in_lobbys.length,
            })
        })
        
        this.router.get('/total_users_count', async (req, res) => {
            let number = await Calls.getTotalUsersCount();
            res.status(200).json({
                number
            })
        })

        return this.router;
    }
}

module.exports = API;