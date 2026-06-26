//This version of the app uses base64 encoded inline images to simplify the app and K8s
//config for compatibility across as many K8s and Gateway implementations as possible.
//If I used a PNG for the badge I'd need to configure session persistence so that GET
// requests for the HTML and badge don't get separately load-balanced. However, not all
// Gateway API implementations currently support session persistence.
const express = require('express');
const os = require('os');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 8080;

// Read and encode the image at startup
const imageBase64 = fs.readFileSync(path.join(__dirname, 'badge.png'), 'base64');
const imageMimeType = 'image/png'; // or image/jpeg, etc.

app.get('/shield', (req, res) => {
    const hostname = os.hostname();
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAFC</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            height: 100vh;
            overflow: hidden;
        }
        
        .top-section {
            background-color: black;
            height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 15%;
            overflow: hidden;
        }
        
        .bottom-section {
            background-color: white;
            height: 40vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 2vh 5%;
        }
        
        .badge-image {
            max-width: 90%;
            max-height: 50vh;
            width: auto;
            height: auto;
            object-fit: contain;
        }
        
        .large-text {
            font-family: 'PS TT Commons Bold', 'Arial Black', sans-serif;
            font-weight: bold;
            color: black;
            font-size: clamp(1rem, 4.5vw, 10rem);
            text-align: center;
            line-height: 1.2;
            width: 100%;
            white-space: nowrap;
        }
          
        .small-text {
            font-family: 'PS TT Commons DemiBold', 'Arial', sans-serif;
            font-weight: 600;
            font-size: 2.67vw;
            text-align: center;
            margin-bottom: 4vh;
        }

        .hostname-text {
            color: black;
        }

        .hostname-container {
            position: absolute;
            bottom: 2vh;
            color: white;
            text-align: center;
            display: flex;
            align-items: center;
            gap: 0.5em;
            font-size: 1.5vw;
        }
        
        .hostname-label {
            background-color: black;
            padding: 0.3em 0.6em;
            border-radius: 0.5em;
        }
        
        @media (max-width: 768px) {
            .green-text {
                font-size: 5vw;
            }
            
            .black-text {
                font-size: 4vw;
            }
            
            .hostname-container {
                font-size: 2.5vw;
            }
            
            .badge-image {
                max-width: 95%;
            }
        }
    </style>
</head>
<body>
    <div class="top-section">
        <img src="data:${imageMimeType};base64,${imageBase64}" alt="SHIELD" class="badge-image">
    </div>
    <div class="bottom-section">
        <div class="black-text"> 
            <span class="large-text">S.H.I.E.L.D</span>
        </div>
        <div class="hostname-container">
            <div class="hostname-label">Served by container</div>
            <div class="hostname hostname-text">${hostname}</div>
        </div>
    </div>
</body>
</html>
    `;
    
    res.send(html);
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server starting on http://0.0.0.0:${port}`);
});