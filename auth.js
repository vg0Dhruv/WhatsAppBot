const { useMultiFileAuthState } = require('@whiskeysockets/baileys');

async function getAuthState(authFile) {
    return await useMultiFileAuthState(authFile);
}

module.exports = { getAuthState };
