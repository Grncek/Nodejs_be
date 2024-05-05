const express = require('express');
const app = express();
const port = 3000;
const APIKEY = '7b674925742140a6a95130205233006';

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


app.get('/', (req, res) => {
  res.send('Hello World! MORE MORE');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


async function getRandomCoordinatesInEurope() {
    // Define latitude and longitude ranges for Europe
    const minLatitude = 35; // Southern boundary of Europe
    const maxLatitude = 70; // Northern boundary of Europe
    const minLongitude = -10; // Western boundary of Europe
    const maxLongitude = 40; // Eastern boundary of Europe

    // Generate random latitude and longitude within Europe's bounds
    const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    const longitude = Math.random() * (maxLongitude - minLongitude) + minLongitude;

    return {
        latitude: latitude,
        longitude: longitude
    };
}

async function getAddress() {
    try {
        const coordinates = getRandomCoordinatesInEurope()
        console.log((await coordinates).latitude)
        console.log((await coordinates).longitude)
        console.log(`https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${(await coordinates).latitude},${(await coordinates).longitude}&aqi=no&lang=cs`)
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${(await coordinates).latitude},${(await coordinates).longitude}&aqi=no&lang=cs`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const addressData = await response.json();
        return addressData;
    } catch (error) {
        console.error(error);
        return {}; // return an empty object in case of error
    }
}

 app.get('/getAddress', async (req, res) => {
    try {
        const data = await getAddress();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
 
