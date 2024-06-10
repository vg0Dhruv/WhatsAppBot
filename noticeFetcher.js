const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const siteConfigs = require('./siteConfigs');
const lastSentNoticesPath = path.join(__dirname, 'lastSentNotices.json');

let noticeData = [];

const fetchNotices = async () => {
    noticeData = [];

    for (const site of siteConfigs) {
        try {
            const html = await fetchHTML(site.url);
            const $ = cheerio.load(html);
            const notices = site.parseNotices($);

            for (const notice of notices) {
                notice.siteName = site.name; // Add site name to notice for tracking
                noticeData.push(notice);
            }
        } catch (error) {
            console.error(`Error fetching notices from ${site.url}: ${error.message}`);
        }
    }
};

const fetchHTML = async (url, retries = 3) => {
    try {
        const { data: html } = await axios.get(url, { timeout: 5000 });
        return html;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... (${3 - retries + 1})`);
            await new Promise(res => setTimeout(res, 1000));
            return fetchHTML(url, retries - 1);
        } else {
            throw new Error(`Error fetching HTML from ${url}: ${error.message}`);
        }
    }
};

const getLastSentNotices = () => {
    if (fs.existsSync(lastSentNoticesPath)) {
        const data = fs.readFileSync(lastSentNoticesPath);
        return JSON.parse(data);
    }
    return {};
};

const updateLastSentNotices = (notices) => {
    fs.writeFileSync(lastSentNoticesPath, JSON.stringify(notices, null, 2));
};

module.exports = {
    fetchNotices,
    getLastSentNotices,
    updateLastSentNotices,
    noticeData
};
