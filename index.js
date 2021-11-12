const PORT = process.env.PORT || 8000;
const express = require("express");
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");
const bodyParser = require("body-parser");

const app = express();

//configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(PORT, () => console.log(`server running on port: ${PORT}`));

app.post("/", async (req, res) => {
	let token_name = req.body.name || "DEXF";
	let logo =
		req.body.logo ||
		"https://tools.dexfolio.org/crypto-calculator/img/favicon.svg";
	let status_string = req.body.msg || "DEXF is the best!!";
	let token_name_color = req.body.tnc || "#58D48C";
	let logo_image_background = req.body.lib || "#212D3A";

	const image = await nodeHtmlToImage({
		output: "./image.png",
		html: `<head> 
        <style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'); *{font-family: 'Inter'; box-sizing: border-box; margin: 0; padding: 0;}body{width: 1049px; height: 586px;}.twitter-image{position: absolute; width: 1048.59px; height: 586.41px; left: 0px; top: 0px; background: #212D3A; background-image: url('{{bg_image}}'); background-position: center; background-size: cover;}h1{margin: 0; position: absolute; width: 757.75px; height: 174.07px; left: 39.31px; top: 53.71px; font-style: normal; font-weight: bold; font-size: 103.612px; line-height: 87px; letter-spacing: -0.045em; color: #FFFFFF;} h1 span{color:{{token_name_color}} }h2{margin: 0; position: absolute; width: 794.52px; height: 39.37px; left: 46.37px; top: 251.06px; font-style: normal; font-weight: bold; font-size: 46.6253px; line-height: 83.52%; letter-spacing: -0.045em; color: #FFFFFF;}.coin-meta{position: absolute; max-width: 572.18px; min-width: 660.18px; height: 120.46px; left: 39.31px; top: 348.15px; /* background: #505064; */ border-radius: 14.0535px; display: flex; align-items: center;}.coin-meta .token-icon{border-radius: 100%; padding-top: 65px; padding-left: 65px; margin-left: 22px; background: {{logo_image_background}}; background-image: url({{logo_image_url}}); background-size: contain; background-repeat: no-repeat; background-position: center; flex-basis: min-content;}.coin-meta .text{margin-left: 18px; width: 408.56px; height: 21.08px; font-style: normal; font-weight: bold; font-size: 25.0955px; line-height: 83.52%; letter-spacing: -0.045em; color: #fff;}</style>
        </head>
            <body> 
                <div class='twitter-image'> 
                    <h1> Track <span class='symbol'>{{token_name}}</span> 
                    <br>
                    with Dexfolio. 
                    </h1> <h2>Intelligent alerts. Free forever.</h2> 
                    <div class='coin-meta'> 
                        <div class='token-icon'></div>
                        <div class='text'>{{status_string}}</div>
                    </div>
                </div>
            </body>
        </html>
        `,
		content: {
			bg_image: get_image_uri("./images/clean_bg.png"),
			logo_image_url: logo,
			logo_image_background: logo_image_background,
			token_name: token_name,
			token_name_color: token_name_color,
			status_string: status_string,
		},
	})
		.then(() => console.log("The images were created successfully!"))
		.catch((error) => {
			console.log(error);
		});

	res.writeHead(200, { "Content-Type": "image/png" });
	res.end(image, "binary");
});

function get_image_uri(local_url) {
	const image = fs.readFileSync(local_url);
	const base64Image = new Buffer.from(image).toString("base64");
	const dataURI = "data:image/jpeg;base64," + base64Image;
	return dataURI;
}
