const { default: axios } = require('axios');
const Router = require('../classes/Router');
const Calls = require('../database/functions');
require('dotenv').config()

class API extends Router {
    constructor(client) {
        super(client, '/api/v1');
    }

    createRoute() {
        this.router.get('/live', (req, res) => {
            res.status(200).json({
                players_online: 42,
                players_in_lobby: 31,
            })
        })
        
        this.router.get('/total_users_count', async (req, res) => {
            let number = await Calls.getTotalUsersCount();
            res.status(200).json({
                number
            })
        })

        this.router.get('/bans', (req, res) => {
            res.status(200).json({
                players_online: 42,
                players_in_lobby: 31,
            })
        })
        async function user() {
            await axios.get('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=A7A35E400E53A38E6150D2A9FD1F0732&format=json&steamids=76561198036370701', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }).then(async response => {
                await Calls.getUser(response.data.response.players[0])
            }).catch(error => {
                console.log(error)
            })
        }
        user()
        
        return this.router;
    }
}

module.exports = API;