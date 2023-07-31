/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function App() {
	const [tasks, setTasks] = useState([]);

	const handleAddTask = (taskText, day) => {
		const currentDate = new Date().toLocaleDateString();
		const minitask = {
			time: new Date().toLocaleTimeString(),
			text: taskText,
			taskId: (Math.random() + 1000).toString(),
		};
		if (currentDate === day && tasks.length !== 0) {
			setTasks((prevTasks) => {
				const newTasks = [...prevTasks];
				newTasks.forEach((task) => {
					if (task.day === currentDate) {
						task.weekdayTasks.push(minitask);
					}
				});
				return newTasks;
			});
		} else {
			const newTask = {
				day: new Date().toLocaleDateString(),
				weekday: new Date().toLocaleDateString("en-US", { weekday: "long" }),
				weekdayTasks: [minitask],
			};

			setTasks((prevTasks) => [...prevTasks, newTask]);
		}
	};

	return (
		<div>
			<Header />
			<Time />
			<div className="task-container">
				<TextArea onAddTask={handleAddTask} />
				<DayTasks tasks={tasks} />
			</div>
		</div>
	);
}

//no changes
function Header() {
	return (
		<div>
			<h1>Simple To-Do-List</h1>
			<h2>
				-by <a href="https://riteshp2001.github.io/Personal-Portfolio/">Ritesh Pandit</a>{" "}
			</h2>
		</div>
	);
}

//no changes
function Time() {
	const [time, setTime] = useState(new Date().toLocaleTimeString());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return (
		<div>
			<h3>{time}</h3>
		</div>
	);
}

function TextArea({ onAddTask }) {
	const handleButtonClick = () => {
		let taskInput = document.getElementById("txt");
		const taskText = taskInput.value.trim();
		const day = new Date().toLocaleDateString();

		if (taskText !== "") {
			console.log("task added");
			onAddTask(taskText, day);
			taskInput.value = "";
		}
	};

	return (
		<div className="add-list">
			<input type="text" name="text-row" id="txt" placeholder="Enter your Task" className="list" />
			<button type="button" value="Add +" id="addbtn" onClick={handleButtonClick}>
				Add+
			</button>
		</div>
	);
}

function DayTasks({ tasks }) {
	return (
		<div key={tasks.id}>
			{tasks.map((task) => (
				<div className="newdate" key={task.date}>
					<h2>{task.weekday}</h2>
					<span>{task.day}</span>
					<div className="inner-newdate-lists">
						<ul>
							{task.weekdayTasks.map((weekdayTask) => (
								<TaskLists key={weekdayTask.taskId} task={weekdayTask} />
							))}
						</ul>
					</div>
				</div>
			))}
		</div>
	);
}

function TaskLists({ task }) {
	let [text, setText] = useState(task.text);
	let [isEditable, setIsEditable] = useState(false);
	let strike = false;
	let textVal = "";
	function toggleStrikeThrough() {
		strike = !strike;
	}

	function handleEditableClick() {
		setIsEditable(true);
	}

	function cancelEdit() {
		setText(task.text);
		setIsEditable(false);
	}

	function saveEdit() {
		const updatedTask = { ...task, text: textVal };

		setIsEditable(false);

		setText(updatedTask.text);
	}

	function handleTextChange(event) {
		textVal = event.target.value;
		setText(textVal);
	}

	return (
		<li>
			<div className="radio-parent">
				<div className="radio-btns" onClick={toggleStrikeThrough}></div>
				<div>{task.time}</div>
			</div>
			<div className="added-list">
				{!isEditable ? (
					<div className="centerText">
						<p className={`added ${strike ? "strike-through" : ""}`}>{task.text}</p>
					</div>
				) : (
					<div className="centerText">
						<textarea className="added editable" value={text} onChange={handleTextChange} />
					</div>
				)}
				<div className="popup">
					{!isEditable && (
						<>
							<i className="ri-delete-bin-2-line"></i>
							<i className="ri-edit-fill" id="editbtn" onClick={handleEditableClick}></i>
						</>
					)}
					{isEditable && (
						<>
							<i className="ri-check-line" id="saveeditbtn" onClick={saveEdit}></i>
							<i className="ri-close-circle-fill" id="canceleditbtn" onClick={cancelEdit}></i>
						</>
					)}
				</div>
			</div>
		</li>
	);
}

export default App;
