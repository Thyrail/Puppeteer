const puppeteer = require ('puppeteer');
const $ = require ('cheerio');
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
require('dotenv').config();

const url = 'https://www.amazon.de/Logitech-Kabelloses-Gaming-Kopfh%C3%B6rer-Klangtreiber-LYGHTSYNC/dp/B07MTY7N22/ref=sxts_sxwds-bia-wc-drs-ajax1_0?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&cv_ct_cx=logitech+935&dchild=1&keywords=logitech+935&pd_rd_i=B07MTY7N22&pd_rd_r=8fbac1c4-96d4-45ea-8064-c052e70af697&pd_rd_w=FSIRB&pd_rd_wg=F2Lqy&pf_rd_p=40f59696-5383-4304-87a0-e0d132e844bd&pf_rd_r=0QXZFKZ636CADEP0VYGZ&psc=1&qid=1603029905&sr=1-1-e00012f1-1c8d-4cb3-8ce3-384c62c0be4f';

async function configureBrowser() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page) {

    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    //console.log(html);

    $('#priceblock_ourprice', html).each(function() {
        let euroPrice = $(this).text();
        console.log(euroPrice)
        let currentPrice = Number(euroPrice.replace(/[^0-9.-]+/g,""));

        if (currentPrice < 200) {
            console.log("Kaufen!!!" + currentPrice);
            sendNotification(currentPrice);
        }
    });
}

async function startTracking() {
    const page = await configureBrowser();

    let job = new CronJob('*/30 * * * * *', function() { // Läuft alle 15 Sekunden durch
        checkPrice(page);
    }, null, true, null, null, true);
    job.start();
}

startTracking();

async function sendNotification(price) {

    let transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ssl: process.env.TYPEORM_DRIVER_EXTRA,
        auth: {
            user: process.env.MAIL_THY,
            pass: process.env.PW_THY
        }
    });

    let textToSend = 'Price dropped to' + price;
    let htmlText = `<a href=\"${url}\">Link</a>`;

    let info = await transporter.sendMail ({
        from: process.env.T_PrTr + process.env.MAIL_THY,
        to: process.env.MAIL_ATH,
        subject: 'Price dropped to ' + price,
        text: textToSend,
        html: htmlText
    });

    console.log("Message sent: %s", info.messageId);
}
// async function monitor() {
//     let page = await configureBrowser();
//     await checkPrice(page);
// }

// monitor();
