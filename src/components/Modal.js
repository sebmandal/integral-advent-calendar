import React from "react";
import ReactDOM from "react-dom";

class Modal extends React.Component {
	constructor(props) {
		super(props);
		this.children = props.children;
		this.onClose = props.onClose;
	}

	componentDidMount() {
		document.addEventListener("click", this.handleClickOutside, true);
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.handleClickOutside, true);
	}

	handleClickOutside = (event) => {
		const domNode = ReactDOM.findDOMNode(this);

		if (!domNode || !domNode.contains(event.target)) {
			this.onClose();
		}
	};

	render() {
		return (
			<div className="modal">
				<button onClick={this.onClose}>X</button>
				{this.children}
			</div>
		);
	}
}

export default Modal;
