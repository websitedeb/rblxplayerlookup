import express, { json, urlencoded } from "express";
import CORS from "cors";
import fetch from "node-fetch";
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, 'key.env');

config({ path: envPath });
const apikey = process.env.API_KEY;

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(CORS({
    origin: 'http://localhost:3000'
}));

async function getHtmlWithPuppeteer(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const html = await page.content();
    await browser.close();

    return html;
}

export async function getImg(url) {
    const html = await getHtmlWithPuppeteer(url);
    const $ = cheerio.load(html);

    const img = $("span.thumbnail-2d-container.avatar-card-image.profile-avatar-thumb").children().first().attr('src');
    
    return img || 'Image not found';
}

async function getRobloxUserId(username) {
    const url = `https://users.roblox.com/v1/users/search?keyword=${username}&limit=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch user ID: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.data.length > 0) {
            const user = data.data.find(plyr => plyr.name === username);
            if (user) {
                return `${user.id}`;
            } else {
                return `Username "${username}" not found in the result.`;
            }
        } else {
            return `No users found for keyword "${username}".`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

async function getPresumedGender(username) {
    const url = `https://apis.roblox.com/cloud/v2/users/${username}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apikey,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const data = await response.json();

        if (data) {
            const bio = data.about || ''; 
            const name = data.name || ''; 
            const displayName = data.displayName || ''; 

            if (/boy/i.test(bio) || /male/i.test(bio) || /man/i.test(bio) || /mr/i.test(bio) ||
                /boy/i.test(name) || /male/i.test(name) || /man/i.test(name) || /mr/i.test(name) ||
                /boy/i.test(displayName) || /male/i.test(displayName) || /man/i.test(displayName) || /mr/i.test(displayName)) {
                return `<i class="bi bi-gender-male" id="male" style="color: blue;"></i><h3 id="male_txt" style="color: blue;">Male</h3>`;
            }

            if (/female/i.test(bio) || /woman/i.test(bio) || /girl/i.test(bio) || /ms/i.test(bio) || /miss/i.test(bio) || /mrs/i.test(bio) ||
                /female/i.test(name) || /woman/i.test(name) || /girl/i.test(name) || /ms/i.test(name) || /miss/i.test(name) || /mrs/i.test(name) ||
                /female/i.test(displayName) || /woman/i.test(displayName) || /girl/i.test(displayName) || /ms/i.test(displayName) || /miss/i.test(displayName) || /mrs/i.test(displayName)) {
                return `<i class="bi bi-gender-female" id="female" style="color: pink;"></i><h3 id="female_txt" style="color: pink;">Female</h3>`;
            }

            return `<i class="bi bi-gender-ambiguous" id="neutral" style="color: gray;"></i><h3 id="neutral_txt" style="color: gray;">Neutral Gender</h3>`;
        } else {
            return `<i class="bi bi-dash-circle-dotted" id="not_present" style="color: white;"></i><h3 id="not_found_txt" style="color: white;">User not found</h3>`;
        }
    } catch (error) {
        return `Error: ${error.message}`;
    }
}


app.get("/api/:userId", async (req, res) => {
    try {
        const user = req.params.userId;
        let img;
        let gender;
        let encodedUser;
        if(!(/[a-zA-Z]/.test(user))){
            encodedUser = encodeURIComponent(user);
            img = await getImg(`https://www.roblox.com/users/${user}/profile`);
            gender = await getPresumedGender(encodedUser);
        }
        else{
            let calcuserid = await getRobloxUserId(user);
            encodedUser = encodeURIComponent(calcuserid);
            img = await getImg(`https://www.roblox.com/users/${calcuserid}/profile`);
            gender = await getPresumedGender(encodeURIComponent(calcuserid));
        }
        const url = `https://apis.roblox.com/cloud/v2/users/${encodedUser}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': apikey,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const responseText = await response.text();
            console.log('Response Text:', responseText);
            return res.status(response.status).json({ error: `Error: ${response.statusText}` });
        }

        const data = {
            user: await response.json(),
            img,
            gender
        };
        
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(8080, () => {
    console.log("running...");
});
