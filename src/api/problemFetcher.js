import axios from "axios";

export const fetchIntegralProblem = async () => {
	const url = "http://localhost:3030/api/generate-problem";
	try {
		const response = await axios.get(url);
		const data = response.data;
		const problem = data;
		return problem;
	} catch (error) {
		console.error(`Error fetching problem: ${error}`);
		return null;
	}
};
