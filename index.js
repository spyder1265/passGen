const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();

const generatePassword = (len) => {
  const length = len || 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

app.get('/', (req, res) => {
  const htmlResponse = `
    <html lang="">
      <head>
        <title>Password Generator</title>
        <style>
        body{
         background: #eef2fd;
        }
          h1 {
            color: #333;
            text-align: center;
          }
          h2 {
            color: #555;
          }
        .copyright {
            color: #999;
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
        }
        footer{
            position: fixed;
            bottom: 0; 
            width:100vw;
        }
        .usage{
            display: flex;
            flex-direction: row;
            padding:.7em .7em;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 10px 0 10px 0;
            background: #fff;
            box-shadow: 0 0 5px #ccc;
            font-size: 14px;
            font-family: monospace;
            color: #333;
            word-break: break-all;
            word-wrap: break-word;
        }

        .usage p {
            padding : .6em;
        }

        .warning{
            color: red;
            padding: 1.6em;
        }


        h1{
            border-bottom: solid thin black;
            line-height: normal;
            padding-bottom: 10px;
        }
        .copyright{
            font-size: small;
            color: #999;
            text-align: center;
            margin-top: 20px;
        }
        .Thanks{
            text-align: center;
            color: #999;
            font-size: 12px;
        }
        .success{
            color: green;
        }

        </style>
      </head>
      <body>
        <h1>Welcome to Password Generator API</h1>
        <br>

        <div class="usage">
            <h2>Usage:</h2><p>http://passgen/gen/{length}</p><span class="warning"> Note: It can only be called through POST.</span>
        </div>



        <div class="usage">
            <h2 class="success">Results:</h2><p>{ "Password": password, "Length": password.length }</p>
        </div>

        <br>
        <br>
        <p class="Thanks">Thank You</p>
        <footer>
            <div class="copyright">
                &copy; 2023 Spyder Hydra. All rights reserved.
            </div>
        </footer>
      </body>
    </html>
  `;
  res.send(htmlResponse);
});

app.post('/gen/:length', (req, res) => {
  const length = Number(req.params.length);

  if (isNaN(length) || length < 8) {
    res.status(400).send({error: "Length should be a number greater than or equal to 8" });
  } else {
    const password = generatePassword(length);
    res.status(200).send({ "Password": password, "Length": password.length });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
