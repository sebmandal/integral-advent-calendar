const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const { promisify } = require("util");

const app = express();
app.use(cors()); // Bypass Wolfram Alpha CORS

const headers = {
	"User-Agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
	Accept: "application/json, text/plain, */*",
	"Accept-Language": "en-US,en;q=0.5",
	"Accept-Encoding": "gzip, deflate, br",
	Origin: "https://www.wolframalpha.com/",
	Connection: "keep-alive",
	Referer: "https://www.wolframalpha.com/",
	Cookie: "WR_SID=32c60916.60bc2aba07c8a; pageWidth=1695; JSESSIONID=74804FEB8C329EF5F7B010068035242A; __cookie_consent=1",
	"Sec-Fetch-Dest": "empty",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Site": "same-site",
	"Access-Control-Allow-Origin": "*",
};

const finished = promisify(stream.finished);
async function downloadImage(url, filePath) {
	try {
		const response = await axios({
			method: "get",
			url: url,
			responseType: "stream", //binærdata
		});

		const writer = fs.createWriteStream(filePath);
		response.data.pipe(writer);
		await finished(writer);

		console.log(`Image downloaded and saved to ${filePath}`);
	} catch (error) {
		console.error(`Error downloading the image: ${error.message}`);
		throw error;
	}
}

function getRandomDifficulty() {
	const difficulties = ["Beginner", "Intermediate", "Advanced"];
	return difficulties[Math.floor(Math.random() * difficulties.length)];
}

app.use("/api/generate-problem", async (req, res) => {
	try {
		const difficulty = getRandomDifficulty();
		const response = await axios.get(
			`https://www6b3.wolframalpha.com/input/wpg/problem.jsp?count=1&difficulty=${difficulty}&load=1&s=1&sessionID=1&type=BasicIntegrate`,
			{ headers: headers }
		);

		const problem = response.data.problems[0];
		const filePath = path.resolve(
			__dirname,
			`./assets/problem_${problem.problem_id}.png`
		);
		await downloadImage(problem.problem_image, filePath);

		problem.problem_image = `http://localhost:3030/api/image/${problem.problem_id}`;
		res.header("Access-Control-Allow-Origin", "*");
		res.send(problem);
	} catch (error) {
		res.status(500).send("Error fetching problem");
	}
});

app.get("/api/image/:problemId", (req, res) => {
	const problemId = req.params.problemId;
	const filePath = path.resolve(
		__dirname,
		`./assets/problem_${problemId}.png`
	);

	if (fs.existsSync(filePath)) {
		res.sendFile(filePath);
	} else {
		res.status(404).send("Not found");
	}
});

app.listen(3030, () => console.log("Proxy running on port 3030"));
