const crypto = require('crypto')

function generateSlug(botName) {
    const base = botName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    const suffix = crypto.randomBytes(3).toString('hex')
    return `${base}-${suffix}`
}

module.exports =  generateSlug 