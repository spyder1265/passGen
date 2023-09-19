const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();

const generatePassword = (len) => {
  const length = len || 12; // Default to a length of 12 characters
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digitChars = "0123456789";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  // Define character sets for each constraint
  const constraints = [
    lowercaseChars,
    uppercaseChars,
    digitChars,
    specialChars,
  ];

  // Initialize an array to store characters from each constraint
  const passwordArray = constraints.map((charset) => {
    const randomIndex = Math.floor(Math.random() * charset.length);
    return charset.charAt(randomIndex);
  });

  // Generate the remaining characters
  const remainingLength = length - passwordArray.length;
  for (let i = 0; i < remainingLength; i++) {
    const constraintIndex = Math.floor(Math.random() * constraints.length);
    const charset = constraints[constraintIndex];
    const randomIndex = Math.floor(Math.random() * charset.length);
    passwordArray.push(charset.charAt(randomIndex));
  }

  // Shuffle the password to randomize character positions
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Generator</title>
        <style>
                         body {
            background: #eef2fd;
        }

        h1 {
            color: #333;
            text-align: center;
            border-bottom: solid thin black;
            line-height: normal;
            padding-bottom: 10px;
        }

        h2 {
            color: #555;
        }

        .copyright {
            font-size: small;
            color: #999;
            text-align: center;
            margin-top: 20px;
        }

        .Thanks {
            text-align: center;
            color: #999;
            font-size: 12px;
        }

        .success {
            color: green;
        }

        .usage {
            display: flex;
            flex-direction: column;
            padding: .7em .7em;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 10px 0;
            background: #fff;
            box-shadow: 0 0 5px #ccc;
            font-size: 14px;
            font-family: monospace;
            color: #333;
            word-break: break-all;
            word-wrap: break-word;
        }

        .gen {
            display: flex;
            flex-direction: row;
            padding: .7em .7em;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 10px 0;
            background: #fff;
            box-shadow: 0 0 5px #ccc;
            align-items: center;
        }

        .gen input {
            width: 400px;
            height: 30px;
        }

        .gen button {
            width: 100px;
            height: 30px;
            margin-left: 10px;
            border-radius: 5px;
            border: none;
            background: #333;
            color: #fff;
            cursor: pointer;
        }

        .gen button:hover {
            opacity: 0.7;
        }

        .warning {
            color: red;
            padding: 1.6em;
        }

        
#passwordResult {
    width: 400px;
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    margin-top: 10px;
    font-family: monospace;
}

.copy-button {
    width: 100px;
    height: 30px;
    margin-left: 10px;
    border-radius: 5px;
    border: none;
    background: #333;
    color: #fff;
    cursor: pointer;
}

.copy-button:hover {
    opacity: 0.7;
}

.passwordgen{
    display: flex;
    flex-direction: row;
    align-items: center;
}
        </style>
    </head>
    <body>
    <h1>Welcome to Password Generator API</h1>
    <br>

    <div class="usage">
        <h2>Usage:</h2>
        <p>http://passgen/gen/{length}</p>
        <span class="warning"> Note: It can only be called through POST.</span>
    </div>

    <div class="usage">
        <h2 class="success">Results:</h2>

        <h4 class="success">Api response structure:</h4>
        <p>{ "Password": password, "Length": password.length }</p>
    </div>

    <div class="gen">
        <form>
            <input type="number" min="12" value="12" class="input" id="passwordLengthInput" placeholder="Enter password length"/>
            <button type="button" onclick="generatePassword()">Generate</button>
            <p>generated password</p>
                    <div class="passwordgen">
        <input type="text" class="input" id="passwordResult" readonly/>
        <button type="button" class="copy-button" onclick="copyPassword()">Copy</button>
        </div>
        </form>
    </div>

    <br>
    <br>
    <p class="Thanks">Thank You</p>
    <footer>
        <div class="copyright">
            &copy; 2023 Spyder Hydra. All rights reserved.
        </div>
    </footer>

    <script type="text/javascript">
        function generatePassword() {
            var passwordLengthInput = document.getElementById("passwordLengthInput");
            var length = parseInt(passwordLengthInput.value);

            if (isNaN(length) || length <= 0) {
                alert("Please enter a valid password length.");
                return;
            }

            var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var password = "";
            for (var i = 0; i < length; i++) {
                var randomIndex = Math.floor(Math.random() * charset.length);
                password += charset.charAt(randomIndex);
            }

            var passwordResult = document.getElementById("passwordResult");
            passwordResult.value = password;
        }

        function copyPassword() {
            var passwordResult = document.getElementById("passwordResult");
            passwordResult.select();
            document.execCommand("copy");
            alert("Password copied to clipboard: " + passwordResult.value);
        }
    </script>
    </body>
    </html>
  `;
  res.send(htmlResponse);
});

app.post("/gen/:length", (req, res) => {
  const length = Number(req.params.length);

  if (isNaN(length) || length < 8) {
    res
      .status(400)
      .send({ error: "Length should be a number greater than or equal to 8" });
  } else {
    const password = generatePassword(length);
    res.status(200).send({ Password: password, Length: password.length });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
