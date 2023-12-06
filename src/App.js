import React from "react";
import CalendarItem from "./components/CalendarItem";
import { fetchIntegralProblem } from "./api/problemFetcher";
import "./App.css";
import kvgsLogo from "./assets/kongsberg-vgs.svg";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			isLoggedIn: false,
			problems: {},
		};
	}

	componentDidMount() {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			this.setState(
				{ username: storedUsername, isLoggedIn: true },
				() => {
					this.loadProblems();
				}
			);
		} else {
			this.loadProblems();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.isLoggedIn &&
			this.state.username !== prevState.username
		) {
			this.loadProblems();
		}
	}

	loadProblems() {
		const today = new Date();
		if (this.state.isLoggedIn && today.getMonth() === 11) {
			const storedProblems = JSON.parse(
				localStorage.getItem(`problems_${this.state.username}`)
			);
			if (storedProblems) {
				this.setState({ problems: storedProblems });
			} else {
				for (let day = 1; day <= 24; day++) {
					fetchIntegralProblem().then((problem) => {
						if (problem) {
							this.setState((prevState) => {
								const updatedProblems = {
									...prevState.problems,
									[day]: problem,
								};
								localStorage.setItem(
									`problems_${this.state.username}`,
									JSON.stringify(updatedProblems)
								);
								return { problems: updatedProblems };
							});
						}
					});
				}
			}
		}
	}

	handleLogin = () => {
		if (this.state.username) {
			this.setState({ isLoggedIn: true });
			localStorage.setItem("username", this.state.username);
			document.location.reload();
			// Egentlig kan man bare fikse logikken med state management, fordi det er problemet, men dette er en OK fiks for en applikasjon som ble laget på under 48 timer.
		}
	};

	handleLogout = () => {
		localStorage.removeItem("username");
		this.setState({ username: "", isLoggedIn: false });
	};

	handleUsernameChange = (event) => {
		this.setState({ username: event.target.value });
	};

	render() {
		const isDecember = new Date().getMonth() === 11;
		if (!isDecember) {
			return (
				<div>
					<img className="logo" src={kvgsLogo} alt="kongsberg vgs" />
					<h1>Det er ikke desember enda! Gled deg!</h1>
				</div>
			);
		}

		if (!this.state.isLoggedIn) {
			return (
				<div>
					<img className="logo" src={kvgsLogo} alt="kongsberg vgs" />
					<div>
						<input
							type="text"
							placeholder="Enter Username"
							value={this.state.username}
							onChange={this.handleUsernameChange}
						/>
						<button onClick={this.handleLogin}>Logg inn</button>
					</div>
				</div>
			);
		}

		return (
			<div>
				<img className="logo" src={kvgsLogo} alt="kongsberg vgs" />
				<h1>
					Velkommen til Integralkalenderen, {this.state.username}!
				</h1>
				<div>
					<button onClick={this.handleLogout}>Logg ut</button>
				</div>
				<div className="calendar-container">
					{Object.keys(this.state.problems).map(
						(day) =>
							day <= new Date().getDate() && (
								<CalendarItem
									key={day}
									day={day}
									problem={this.state.problems[day]}
								/>
							)
					)}
				</div>
			</div>
		);
	}
}

export default App;
