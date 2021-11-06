const { default: axios } = require('axios');
const Router = require('../classes/Router');
const Calls = require('../database/functions');
require('dotenv').config()

class Incoming extends Router {
    constructor(client) {
        super(client, '/api/v1/incoming');
    }

    createRoute() {
        this.router.post('/init', async (req, res) => {
            let steam_id = req.body.steamID;
            if (!steam_id || steam_id === '') return res.status(400).json({success:false, message:"Please provide a steam ID."})
            let steam_user = await axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_KEY}&format=json&steamids=${steam_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            if (steam_user.data.response.players.length === 0) return res.status(400).json({success:false, message:"Please provide a valid steam ID."})
            
            await Calls.getUser(steam_user.data.response.players[0])

            let realtime_user = await Calls.getRealtime(steam_user.data.response.players[0].steamid)
            if (realtime_user === null) {
                await Calls.insertRealtime(steam_user.data.response.players[0].steamid)
                return res.status(200).json({success:true})
            } else {
                return res.status(400).json({success:false, message:"This user is already init"})
            }
        })
        
        this.router.post('/heartbeat', async (req, res) => {
            let steam_id = req.body.steamID;
            if (!steam_id || steam_id === '') return res.status(400).json({success:false, message:"Please provide a steam ID."})
            if (!req.body.status) return res.status(400).json({success:false, message:"Please provide a status."})
            const valid_status = ["0", "1"]
            if (!valid_status.includes(req.body.status)) return res.status(400).json({success:false, message:"Please provide a valid status."})
            let realtime_user = await Calls.getRealtime(req.body.steamID)
            
            if (realtime_user === null) {
                return res.status(400).json({success:false, message:"This user hasn't init"})
            } else {
                await Calls.updateRealtime(req.body.steamID, "status", parseInt(req.body.status))
                await Calls.updateRealtime(req.body.steamID, "latest_update", parseInt(Date.now() / 1000))
                return res.status(200).json({success:true})
            }
        })
        
        return this.router;
    }
}

module.exports = Incoming;