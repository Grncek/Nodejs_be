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


async function getAddress() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=50.0793344,14.4572416&aqi=no&lang=cs`);
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
 
