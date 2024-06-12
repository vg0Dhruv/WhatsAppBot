const { fetchNotices, noticeData, getLastSentNotices, updateLastSentNotices } = require('./noticeFetcher');

function cleanFileLink(fileLink) {
    // Replace '/../' with '/'
    fileLink = fileLink.replace(/\/\.\.\//g, '/');
    // Replace '%2520' with '%20'
    fileLink = fileLink.replace(/%2520/g, '%20');
    // Replace spaces with '%20'
    fileLink = fileLink.replace(/ /g, '%20');
    return fileLink;
}


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
                    const message = `${notice.linkTitle}\n${cleanFileLink(notice.fileLink)}`; // Clean the file link
                    await sock.sendMessage("120363294435678005@g.us", { text: message });
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
                    const message = `${lastNotice.linkTitle}\n${cleanFileLink(lastNotice.fileLink)}`; // Clean the file link
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
