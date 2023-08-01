/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

function App() {
	const [tasks, setTasks] = useState([]);

	useEffect(() => {
		setTasks(JSON.parse(localStorage.getItem("tasks")));
	}, []);

	const handleAddTask = (taskText, day) => {
		const currentDate = new Date().toLocaleDateString();
		const minitask = {
			time: new Date().toLocaleTimeString(),
			text: taskText,
			taskId: (Math.random() + 1000).toString(),
			isEditable: false,
			strike: false,
		};

		if (currentDate === day && tasks.length !== 0) {
			setTasks((prevTasks) => {
				const newTasks = prevTasks.map((task) => {
					if (task.day === currentDate) {
						return {
							...task,
							weekdayTasks: [...task.weekdayTasks, minitask],
						};
					}
					return task;
				});

				localStorage.setItem("tasks", JSON.stringify(newTasks));
				return newTasks;
			});
		} else {
			const newTask = {
				day: new Date().toLocaleDateString(),
				weekday: new Date().toLocaleDateString("en-US", { weekday: "long" }),
				weekdayTasks: [minitask],
			};

			localStorage.setItem("tasks", JSON.stringify(newTask));
			setTasks((prevTasks) => [...prevTasks, newTask]);
		}
	};

	return (
		<div>
			<Header />
			<Time />
			<div className="task-container">
				<TextArea onAddTask={handleAddTask} />
				<DayTasks tasks={tasks} setTasks={setTasks} />
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
	let [inpVal, setInpVal] = useState("");

	function handleSubmit(event) {
		event.preventDefault();
		onAddTask(inpVal, new Date().toLocaleDateString());
		setInpVal("");
	}

	function setVal(event) {
		setInpVal((inpVal) => {
			inpVal = event.target.value;
			return inpVal;
		});
	}

	return (
		<form action="" onSubmit={handleSubmit}>
			<div className="add-list">
				<input
					type="text"
					name="text-row"
					id="txt"
					placeholder="Enter your Task"
					className="list"
					onChange={setVal}
					autoFocus={true}
					value={inpVal}
				/>
				<button type="button" value="Add +" id="addbtn" onClick={handleSubmit}>
					Add+
				</button>
			</div>
		</form>
	);
}

function DayTasks({ tasks, setTasks }) {
	return (
		<>
			{tasks.map((task) => (
				<div className="newdate" key={task.date}>
					<h2>{task.weekday}</h2>
					<span>{task.day}</span>
					<div className="inner-newdate-lists">
						<ul>
							{task.weekdayTasks.map((weekdayTask) => (
								<TaskLists key={weekdayTask.taskId} task={weekdayTask} setAllTasks={setTasks} />
							))}
						</ul>
					</div>
				</div>
			))}
		</>
	);
}

function TaskLists({ task, setAllTasks }) {
	let [text, setText] = useState(task.text);
	let [isEditable, setIsEditable] = useState(task.isEditable);
	let [strike, setStrike] = useState(task.strike);
	let ogText = task.text;
	let changabletext = text;
	let textVal = "";

	function toggleStrikeThrough() {
		setStrike(!strike);
	}

	function handleEditableClick() {
		setIsEditable(true);
	}

	function cancelEdit() {
		setText((text) => {
			text = ogText;
			return text;
		});
		setIsEditable(false);
	}

	function saveEdit() {
		setText((text) => {
			text = changabletext;
			task.text = changabletext;
			return text;
		});
		setIsEditable(false);
	}

	function handleTextChange(event) {
		textVal += event.target.value;
		console.log(textVal);
		setText((text) => {
			text = textVal;
			return text;
		});
	}

	function handleDeleteClick() {
		setAllTasks(() => {
			let tempTaskArr = JSON.parse(localStorage.getItem("tasks"));
			tempTaskArr = tempTaskArr.map((singletask) => {
				if (singletask.id === task.id) {
					if (singletask.weekdayTasks.length === 0) {
						return null;
					} else {
						return {
							...singletask,
							weekdayTasks: singletask.weekdayTasks.filter((weekdayTask) => {
								return weekdayTask.taskId !== task.taskId;
							}),
						};
					}
				}
				return singletask;
			});
			localStorage.setItem("tasks", JSON.stringify(tempTaskArr));
			return tempTaskArr;
		});
	}

	return (
		<li>
			<div className="radio-parent">
				<div className={`radio-btns ${strike ? "radio-btns-glow" : ""}`} onClick={toggleStrikeThrough}></div>
				<div>{task.time}</div>
			</div>
			<div className="added-list">
				{!isEditable ? (
					<div className="centerText">
						<p className={`added ${strike ? "strike-through" : ""}`}>{text}</p>
					</div>
				) : (
					<div className="centerText">
						<textarea className="added editable" onInput={handleTextChange}>
							{text}
						</textarea>
					</div>
				)}
				<div className="popup">
					{!isEditable && (
						<>
							<i className="ri-delete-bin-2-line" id="deletebtn" onClick={handleDeleteClick}></i>
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
