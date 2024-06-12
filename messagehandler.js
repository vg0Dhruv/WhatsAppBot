const { fetchNotices, noticeData, getLastSentNotices, updateLastSentNotices } = require('./noticeFetcher');

async function sendWhatsAppMessages(sock, m) {
    try {
        if (!sock) {
            console.log('Socket connection not established. Message not sent.');
            return;
        }
        const textMessage = (m.message?.conversation || m.message?.extendedTextMessage?.text || "").toLowerCase();

        if (textMessage === 'send pdf') {
            await fetchNotices();
            const lastSentNotices = getLastSentNotices();
            let messagesSent = 0;

            for (const notice of noticeData) {
                const siteName = notice.siteName;
                const lastSentNotice = lastSentNotices[siteName] || {};

                if (notice.link !== lastSentNotice.link) {
                    const message = `${notice.linkTitle}\n${encodeURI(notice.fileLink)}`; // Encode URL properly
                    await sock.sendMessage("120363280498250094@g.us", { text: message });
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

            if (messagesSent === 0) {
                console.log("No new notices available. Sending last sent notices.");
                for (const siteName in lastSentNotices) {
                    const lastNotice = lastSentNotices[siteName];
                    const message = `${lastNotice.linkTitle}\n${encodeURI(lastNotice.fileLink)}`; // Encode URL properly
                    await sock.sendMessage(m.key.remoteJid, { text: message });
                    console.log("Resent last notice successfully for:", lastNotice.linkTitle);
                }
            }

            // Save updated last sent notices to file
            updateLastSentNotices(lastSentNotices);
        }
    } catch (error) {
        console.log("Error sending WhatsApp messages:", error);
    }
}

module.exports = { sendWhatsAppMessages };
