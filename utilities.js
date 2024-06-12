const axios = require('axios');
const cheerio = require('cheerio');

function cleanURL(link) {
    if (link.startsWith('http')) {
        return link;
    } else if (link.startsWith('../')) {
        // Handle relative paths
        const baseURL = 'https://www.igdtuw.ac.in/';
        return new URL(link, baseURL).href;
    } else {
        // Handle URLs with encoded characters
        return decodeURIComponent(link);
    }
}

module.exports = { cleanURL };

async function fetchHTML(url, retries = 3) {
    try {
        // Ensure the URL is encoded before making the request
        url = encodeURI(url);
        const { data: html } = await axios.get(url, { timeout: 5000 });
        return html;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... (${3 - retries + 1})`);
            await new Promise(res => setTimeout(res, 1000));
            return fetchHTML(url, retries - 1);
        } else {
            console.error(`Error fetching the HTML from ${url}: ${error.message}`);
            throw error;
        }
    }
}

async function processLink(fullLink) {
    try {
        const html = await fetchHTML(fullLink);
        const $ = cheerio.load(html);

        const linkTitle = $('table>tbody>tr td[colspan="3"]').text().trim();
        const fileLink = $('table>tbody>tr td[colspan="3"] a').attr('href');

        if (linkTitle && fileLink) {
            return {
                linkTitle,
                fileLink: cleanURL(`https://www.igdtuw.ac.in/${fileLink}`)
            };
        }
    } catch (error) {
        console.error(`Error processing the link ${fullLink}: ${error.message}`);
    }

    return null;
}

module.exports = { fetchHTML, cleanURL, processLink };
