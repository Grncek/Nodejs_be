const express = require('express');
const app = express();
const port = 3000;
const APIKEY_WEATHER = '7b674925742140a6a95130205233006';
const APIKEY_WEBCAM = 'zhghS00P2rYGG49RED2hVwENqxQl2y7I'


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


function getRandomCoordinatesInEurope() {
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

async function GetWebcamID(results, rad, APIKEY_WEBCAM){
    const coordinates = getRandomCoordinatesInEurope()
    console.log((await coordinates).latitude)
    console.log((await coordinates).longitude)
    try{
      const response = await fetch(`https://api.windy.com/webcams/api/v3/webcams?lang=en&limit=${results}&offset=0&nearby=${(await coordinates).latitude}%2C${(await coordinates).longitude}%2C${rad}`, {
        headers: {
            "x-windy-api-key": APIKEY_WEBCAM
        }
    });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const webcamdata = await response.json();
      console.log(webcamdata)
      console.log("webcamID je:", webcamdata.webcams[0].webcamId)
      //Zjisti Latitude a longitude dané webcam
        const realCoordinates = await getAddress(webcamdata.webcams[0].webcamId)
      //Zjisti teplotu od daných latitude a longitude
      console.log("Real Latitude je: ",realCoordinates.latitude,"Real Longitude je: ",realCoordinates.longitude)
        const temp = await getTemperature(realCoordinates.latitude,realCoordinates.longitude)
      //Tady vrátím všechno (akrotá že vubec)
      return { webcamId: webcamdata.webcams[0].webcamId, temperature: parseFloat(temp.temperature) }
    } catch (error) {
      console.error(error);
      return null;
    }
  }


async function getAddress(ID) {
  try{
    console.log("Jsem funkce getAddress a moje ID webky je: ", ID)
    const response = await fetch(`https://api.windy.com/webcams/api/v3/webcams/${ID}?lang=en&include=location`, {
      headers: {
          "x-windy-api-key": APIKEY_WEBCAM
      }
  });
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    const webcamdata = await response.json();
    console.log(webcamdata)
    return {
      latitude: webcamdata.location.latitude,
      longitude: webcamdata.location.longitude
  }
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getTemperature(latitude, longitude) {
    try {
        console.log(`https://api.weatherapi.com/v1/current.json?key=${APIKEY_WEATHER}&q=${latitude},${longitude}&aqi=no&lang=cs`)
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKEY_WEATHER}&q=${latitude},${longitude}&aqi=no&lang=cs`);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const temperatureData = await response.json();
        return {temperature: temperatureData.current.temp_c };
    } catch (error) {
        console.error(error);
        return {}; // return an empty object in case of error
    }
}

 app.get('/getTemperature', async (req, res) => {
    try {
        const data = await getTemperature("40.5499", "34.95377");
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/getAddress', async (req, res) => {
  try {
      const data = await getAddress(1616822283);
      res.json(data);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
})

app.get('/GetWebcamID', async (req, res) => {
    try {
        const data = await GetWebcamID(1,250,APIKEY_WEBCAM);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});