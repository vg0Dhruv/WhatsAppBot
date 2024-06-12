const { cleanURL } = require('./utilities');

module.exports = [
    {
        name: 'Updates.php?id=2',
        url: 'https://www.igdtuw.ac.in/Updates.php?id=2',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const title = $(row).find('td[colspan="2"]').text().trim();
                const notice_date = $(row).find('td[style="text-align:center;"]').text().trim();
                const link = $(row).find('td[colspan="2"] a').attr('href');
                const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                if (title && notice_date && link) {
                    notices.push({
                        title,
                        notice_date,
                        link: fullLink
                    });
                }
            });
            return notices;
        }
    },
    {
        name: 'Updates.php?id=3',
        url: 'https://www.igdtuw.ac.in/Updates.php?id=3',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const title = $(row).find('td[colspan="2"]').text().trim();
                const notice_date = $(row).find('td').text().trim();
                const link = $(row).find('td[colspan="2"] a').attr('href');
                const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                if (title && notice_date && link) {
                    notices.push({
                        title,
                        notice_date,
                        link: fullLink
                    });
                }
            });
            return notices;
        }
    },
    {
        name: 'Academics.php?id=5',
        url: 'https://www.igdtuw.ac.in/Academics.php?id=5',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const title = $(row).find('td[colspan="5"]').text().trim();
                const notice_date = $(row).find('td[colspan="1"]').text().trim();
                const link = $(row).find('td[style="text-align:center;"] a').attr('href');
                const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                if (title && notice_date && link) {
                    notices.push({
                        title,
                        notice_date,
                        link: fullLink,
                        linkTitle: title,
                        fileLink: fullLink
                    });
                }
            });
            return notices;
        }
    },
    {
        name: 'Admission.php?id=2',
        url: 'https://www.igdtuw.ac.in/Admission.php?id=2',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const title = $(row).find('td[colspan="2"]').text().trim();
                const notice_date = $(row).find('td').text().trim();
                const link = $(row).find('td b a').attr('href');
                const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                if (title && notice_date && link) {
                    notices.push({
                        title,
                        notice_date,
                        link: fullLink,
                        linkTitle: title,
                        fileLink: fullLink
                    });
                }
            });
            return notices;
        }
    },
    {
        name: 'Examinations.php?id=3',
        url: 'https://www.igdtuw.ac.in/Examinations.php?id=3',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const cells = $(row).find('td[style="text-align:center;"]');
                const linkCell = $(row).find('td[style="text-align:center;font-weight:bold;"] a');
                
                if (cells.length >= 2 && linkCell.length) {
                    const title = $(cells[0]).text().trim();
                    const link = linkCell.attr('href');
                    const notice_date = $(cells[1]).text().trim();
                    const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                    
                    if (title && notice_date && link) {
                        notices.push({
                            title,
                            notice_date,
                            link: fullLink,
                            linkTitle: title,
                            fileLink: fullLink
                        });
                    }
                }
            });
            return notices;
        }
    },
    {
        name: 'StudentLife.php?id=8',
        url: 'https://www.igdtuw.ac.in/StudentLife.php?id=8',
        parseNotices: function($) {
            let notices = [];
            $('table>tbody>tr').each((i, row) => {
                const title = $(row).find('td[colspan="2"]').text().trim();
                const link = $(row).find('td a').attr('href');
                const notice_date = $(row).find('td').text().trim();
                const fullLink = cleanURL(`https://www.igdtuw.ac.in/${link}`);
                if (title && notice_date && link) {
                    notices.push({
                        title,
                        notice_date,
                        link: fullLink,
                        linkTitle: title,
                        fileLink: fullLink
                    });
                }
            });
            return notices;
        }
    }
];
