const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const logger = require('morgan');
const Router = require('./Router');
const Logger = require('../util/Logger');
const crypto = require("crypto");
const cron = require('../util/cron');
cron.setCron();
const {
    default: axios
} = require('axios');
const config = require('../../config.json');
require('dotenv').config();

class App {
    io;
    server;
    constructor() {
        this.app = express();
        this.server = require('http').createServer(this.app);
        this.app.engine('e', require('ejs').renderFile);
        this.app.set('view engine', 'ejs');
        this.app.set('views', path.join(__dirname, '..', 'views/pages'));
        this.app.use(cors());
        this.app.use(cookieParser());
        this.app.use(function(req, res, next) {
            res.removeHeader('x-robots-tag', 'none')
            res.setHeader('x-robots-tag', 'all')
            next();
          });
        logger.token('userName', function (req, res) {
            return (req.session && req.session.passport && req.session.passport.user) ? `${req.session.passport.user.username}#${req.session.passport.user.discriminator}` : ''
        })
        this.app.use(logger(':method :url :status :res[content-length] - :response-time ms - :userName'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true
        }));
        this.app.use('/public', express.static(path.join(__dirname, '..', 'public')));
    }
    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {function()} next 
     */

    /**
     * 
     * @param {string} template 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {{...}} data 
     */

    async registerRoutes() {
        const filePath = path.join(__dirname, '..', 'routes');
        const files = await fs.readdir(filePath);
        for await (const file of files) {
            if (file.endsWith('.js')) {
                const router = require(path.join(filePath, file));
                if (router.prototype instanceof Router) {
                    const instance = new router(this);
                    Logger.route(`Route File ${instance.path} running.`);
                    if (instance.auth) {
                        this.app.use(instance.path, this.Authentication, instance.createRoute());
                    } else {
                        this.app.use(instance.path, instance.createRoute());
                    }
                }
            }
        }

        this.app.get('/', async function (req, res) {
            res.render('home/index.ejs', {
                path: req.path,
                user: req.user
            })
        })

        this.app.get('/metrics', async function (req, res) {
            res.render('home/metrics.ejs', {
                path: req.path,
                user: req.user
            })
        })

        this.app.get('/discord', async function (req, res) {
            res.redirect('https://discord.gg/YB69FA4HE2')
        })

        this.app.get('/github', async function (req, res) {
            res.redirect('https://github.com/DasJNNJ/CrabGame-Cheat')
        })

        this.app.get('/downloads', async function (req, res) {
            axios.get('https://api.github.com/repos/DasJNNJ/CrabGame-Cheat/releases', {
                    headers: {
                        'Authorization': `Basic ${process.env.GITHUB_SECRET}`
                    }
                }).then(releases => {
                    res.render('home/downloads.ejs', {
                        path: req.path,
                        user: req.user,
                        releases: releases.data
                    })
                })
                .catch(err => {
                    res.redirect('https://github.com/DasJNNJ/CrabGame-Cheat')
                })
        })

        this.app.use((req, res) => {
            res.render('custom/404.ejs', {
                path: req.path,
                user: req.user
            });
        });
    }
    async listen(fn, https = false) {
        this.server.listen(process.env.PORT, fn);
        Logger.info(`Server started on port: ${process.env.PORT}`)
    }
}

module.exports = App;