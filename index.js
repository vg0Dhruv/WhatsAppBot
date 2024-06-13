const { makeWASocket, DisconnectReason, Browsers, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { sendWhatsAppMessages } = require('./connection');
const { fetchNotices, getLastSentNotices, updateLastSentNotices, noticeData } = require('./noticeFetcher');
const schedule = require('node-schedule');
const express = require('express');
const app = express();
const port = 8000; 

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const GROUP_JID = '120363294435678005@g.us';

async function connectionLogic(authFile) {
    const { state, saveCreds } = await useMultiFileAuthState(authFile);

    const sock = makeWASocket({
        syncFullHistory: true,
        version: [2, 3000, 1013812660],
        browser: Browsers.windows('Desktop'),
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect, qr } = update || {};

        if (qr) {
            console.log('QR Code:', qr);
        }

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, shouldReconnect:', shouldReconnect);
            if (shouldReconnect) {
                connectionLogic(authFile);
            }
        }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const m = messages[0];
            await sendWhatsAppMessages(sock, m);
        } catch (error) {
            console.log("Error processing message:", error);
        }
    });

    // Schedule the notice fetching and sending every 10 minutes
    schedule.scheduleJob('*/10 * * * *', async () => {
        try {
            console.log('Fetching notices...');
            await fetchNotices();
            const lastSentNotices = getLastSentNotices();
            let messagesSent = 0;

            for (const notice of noticeData) {
                const siteName = notice.siteName;
                const lastSentNotice = lastSentNotices[siteName] || {};

                console.log(`Processing notice for site: ${siteName}`);
                console.log(`Notice link: ${notice.link}`);
                console.log(`Last sent notice link: ${lastSentNotice.link}`);

                if (notice.link !== lastSentNotice.link) {
                    const message = `${notice.linkTitle}\n${notice.fileLink}`;
                    console.log(`Sending message: ${message}`);
                    await sock.sendMessage(GROUP_JID, { text: message });
                    console.log("Link message sent successfully for:", notice.linkTitle);

                    // Update last sent notice for the site
                    lastSentNotices[siteName] = {
                        link: notice.link,
                        linkTitle: notice.linkTitle,
                        fileLink: notice.fileLink
                    };

                    messagesSent++;
                }
            }

            // Save updated last sent notices to file
            updateLastSentNotices(lastSentNotices);

            if (messagesSent === 0) {
                console.log("No new notices available. No messages sent.");
            } else {
                console.log(`${messagesSent} new messages sent.`);
            }
        } catch (error) {
            console.log("Error in scheduled task:", error);
        }
    });
}

async function main() {
    try {
        const authFile = "auth_info_baileys";
        await connectionLogic(authFile).catch(err => console.error("Error in connection logic:", err));
    } catch (error) {
        console.error("Failed to send message:", error);
    }
}

main();
