const generateApiKey = require('generate-api-key');

async function newKey() {
    return generateApiKey({ method: 'string', min: 30, max: 35, prefix: '2021-' })
}

async function secretKey() {
    return generateApiKey({ method: 'string', min: 30, max: 35, prefix: 'secret.' })
}

module.exports = {newKey, secretKey};