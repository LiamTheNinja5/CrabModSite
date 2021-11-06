const monk = require('monk');
const db = monk(process.env.MONGO_URL);
class Calls {
    static async insertUser(steam_schema) {
        const collection = db.get('users')
        return (await collection.insert({        
            steamid: steam_schema.steamid,
            steam_username: steam_schema.personaname,
            steam_realname: steam_schema.realname,
            steam_accountage: steam_schema.timecreated,
            loccountrycode: steam_schema.loccountrycode,
            locstatecode: steam_schema.locstatecode,
            loccityid: steam_schema.loccityid,
            steam_profile_url: steam_schema.profileurl,
            steam_primaryclanid: steam_schema.primaryclanid,
            avatar: {
                avatarfull: steam_schema.avatarfull,
                avatarmedium: steam_schema.avatarmedium,
                avatar: steam_schema.avatar,
                avatarhash: steam_schema.avatarhash
            },
            user_banned: false,
            user_admin: false,
            user_mod: false,
            user_premium: 0,
            user_creation: parseInt(Date.now() / 1000),
        }));
    }

    static async getUser(body) {
        if (!body || !body.steamid) return
        const collection = db.get('users')
        let user = await collection.findOne({ steamid: body.steamid })
        if (user === null) {
            return (await Calls.insertUser(body))
        } else {
            return (await Calls.getUserByID(body.steamid));
        }
    }

    static async getUserByID(steamid) {
        const collection = db.get('users')
        return (await collection.findOne({ steamid: steamid }))
    }

    static async updateUser(id, props, value) {
        const collection = db.get('users')
        return (await collection.findOneAndUpdate({steamid: id}, { $set: { [props]: value }}))
    }

    static async getAllUsers() {
        const collection = db.get('users')
        return(await collection.find())
    }

    static async getAllRealtimeFiltered(type) {
        const collection = db.get('realtime')
        return(await collection.find({ "status": type }))
    }

    static async getTotalUsersCount() {
        const collection = db.get('users')
        return(await collection.count())
    }

    static async insertRealtime(steamid) {
        const collection = db.get('realtime')
        return (await collection.insert({        
            steamid,
            status: 0,
            insert_time: parseInt(Date.now() / 1000),
            latest_update: parseInt(Date.now() / 1000),
        }));
    }

    static async saveMetrics(not_in_lobbys, in_lobbys, total_users, total_realtime) {
        const collection = db.get('metrics')
        return (collection.insert({
            not_in_lobbys,
            in_lobbys,
            total_users,
            total_realtime,
            insert_time: parseInt(Date.now() / 1000),
        }));
    }

    static async updateRealtime(id, props, value) {
        const collection = db.get('realtime')
        return (await collection.findOneAndUpdate({steamid: id}, { $set: { [props]: value }}))
    }

    static async getAllRealtimeStatus(status) {
        const collection = db.get('realtime')
        return (await collection.find({ status: status }));
    }

    static async getRealtime(steamid) {
        const collection = db.get('realtime')
        return (await collection.findOne({ steamid: steamid }));
    }

    static async getAllRealtime() {
        const collection = db.get('realtime')
        return (await collection.find());
    }

    static async removeRealtime(steamid) {
        const collection = db.get('realtime')
        return (await collection.findOneAndDelete({steamid: steamid}))
    }

    static async getHistroical(hours) {
        const collection = db.get('metrics')
        let all = await collection.find();
        let all_data = []
        for (let i = 0; i < all.length; i++) {
            if (all[i].insert_time > (parseInt(Date.now() / 1000) - hours * 3600)) {
                all_data.push(all[i])
            }
        }
        return (await all_data);
    }
}

module.exports = Calls;
