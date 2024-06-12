const { fetchNotices, noticeData, getLastSentNotices, updateLastSentNotices } = require('./noticeFetcher');

const GROUP_JID = '120363280498250094@g.us';

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
                    // Replace '/../' with '/'
                    const cleanFileLink = notice.fileLink.replace('/../', '/');
                    // Replace spaces with '%20'
                    const message = `${notice.linkTitle}\n${cleanFileLink.replace(/ /g, '%20')}`;
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

            if (messagesSent === 0) {
                console.log("No new notices available. Sending last sent notices.");
                for (const siteName in lastSentNotices) {
                    const lastNotice = lastSentNotices[siteName];
                    // Replace '/../' with '/'
                    const cleanFileLink = lastNotice.fileLink.replace('/../', '/');
                    // Replace spaces with '%20'
                    const message = `${lastNotice.linkTitle}\n${cleanFileLink.replace(/ /g, '%20')}`;
                    await sock.sendMessage(GROUP_JID, { text: message });
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
