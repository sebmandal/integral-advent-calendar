import React from "react";
import Modal from "./Modal";

class CalendarItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isModalOpen: false,
		};
	}

	toggleModal = () => {
		this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }));
	};

	render() {
		const { day, problem } = this.props;
		const { isModalOpen } = this.state;

		return (
			<div
				className="calendar-item"
				onClick={() => !isModalOpen && this.toggleModal()}
			>
				<h3>Dag {day}</h3>
				{isModalOpen && (
					<Modal onClose={this.toggleModal}>
						<h3>Oppgave for dag {day}</h3>
						<img src={problem.problem_image} alt="oppgavebilde" />
						<p>
							<strong>Oppgave:</strong> {problem.string_question}
						</p>
					</Modal>
				)}
			</div>
		);
	}
}

export default CalendarItem;
