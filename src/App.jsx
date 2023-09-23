import React, { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);

  // useEffect(() => {
  //   if (localStorage.getItem("tasks") !== undefined || null) {
  //     const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  //     if (storedTasks) setTasks(storedTasks);
  //   }
  // }, []);

  const updateTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    // localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const handleAddTask = (taskText, day) => {
    if(taskText==="")return;
    const currentDate = new Date().toLocaleDateString();
    const newTask = {
      day: currentDate,
      weekday: new Date().toLocaleDateString("en-US", { weekday: "long" }),
      weekdayTasks: [
        {
          time: new Date().toLocaleTimeString(),
          text: taskText,
          taskId: (Math.random() * 1000).toString(),
          isEditable: false,
          strike: false,
        },
      ],
    };

    const updatedTasks = tasks.map((task) => {
      if (task.day === currentDate) {
        task.weekdayTasks.push(newTask.weekdayTasks[0]);
        return task;
      }
      return task;
    });

    if (!updatedTasks.some((task) => task.day === currentDate)) {
      updatedTasks.push(newTask);
    }

    updateTasks(updatedTasks);
  };

  return (
    <div>
      <Header />
      <Time />
      <div className="task-container">
        <TextArea onAddTask={handleAddTask} />
        <DayTasks tasks={tasks} updateTasks={updateTasks} />
      </div>
    </div>
  );
}

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
  const [inpVal, setInpVal] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddTask(inpVal);
    setInpVal("");
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="add-list">
        <input
          type="text"
          name="text-row"
          id="txt"
          placeholder="Enter your Task"
          className="list"
          onChange={(event) => setInpVal(event.target.value)}
          autoFocus={true}
          value={inpVal}
        />
        <button type="submit" value="Add +" id="addbtn">
          Add+
        </button>
      </div>
    </form>
  );
}

function DayTasks({ tasks, updateTasks }) {
  return (
    <>
      {tasks.map((task) => (
        <div className="newdate" key={task.day}>
          <h2>{task.weekday}</h2>
          <span>{task.day}</span>
          <div className="inner-newdate-lists">
            <ul>
              {task.weekdayTasks.map((weekdayTask) => (
                <TaskLists
                  key={weekdayTask.taskId}
                  task={weekdayTask}
                  allTasks={task}
                  updateTasks={updateTasks}
                />
              ))}
            </ul>
          </div>
        </div>
      ))}
    </>
  );
}

function TaskLists({ task, allTasks, updateTasks }) {
  const handleToggleStrike = () => {
    const updatedTask = { ...task, strike: !task.strike };
    updateTask(updatedTask);
  };

  const handleEditableClick = () => {
    const updatedTask = { ...task, isEditable: true };
    updateTask(updatedTask);
  };

  const handleCancelEdit = () => {
    const updatedTask = { ...task, isEditable: false };
    updateTask(updatedTask);
  };

  const handleSaveEdit = () => {
    const updatedTask = { ...task, isEditable: false };
    updateTask(updatedTask);
  };

  const handleTextChange = (event) => {
    const updatedTask = { ...task, text: event.target.value };
    updateTask(updatedTask);
  };

  const handleDeleteClick = () => {
    const updatedTasks = allTasks.weekdayTasks.filter(
      (weekdayTask) => weekdayTask.taskId !== task.taskId
    );
    if (updatedTasks.length === 0) {
      // Remove the whole parent task
      updateTasks((prevTasks) =>
        prevTasks.filter((prevTask) => prevTask.day !== allTasks.day)
      );
    } else {
      const updatedParentTask = { ...allTasks, weekdayTasks: updatedTasks };
      updateTasks((prevTasks) =>
        prevTasks.map((prevTask) =>
          prevTask.day === allTasks.day ? updatedParentTask : prevTask
        )
      );
    }
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = allTasks.weekdayTasks.map((weekdayTask) =>
      weekdayTask.taskId === task.taskId ? updatedTask : weekdayTask
    );
    const updatedParentTask = { ...allTasks, weekdayTasks: updatedTasks };
    updateTasks((prevTasks) =>
      prevTasks.map((prevTask) =>
        prevTask.day === allTasks.day ? updatedParentTask : prevTask
      )
    );
  };

  return (
    <li>
      <div className="radio-parent">
        <div
          className={`radio-btns ${task.strike ? "radio-btns-glow" : ""}`}
          onClick={handleToggleStrike}
        ></div>
        <div>{task.time}</div>
      </div>
      <div className="added-list">
        {!task.isEditable ? (
          <div className="centerText">
            <p className={`added ${task.strike ? "strike-through" : ""}`}>{task.text} </p>
          </div>
        ) : (
          <div className="centerText">
            <textarea
              className="added editable"
              value={task.text}
              onChange={handleTextChange}
            />
          </div>
        )}
        <div className="popup">
          {!task.isEditable ? (
            <>
              <i
                className="ri-delete-bin-2-line"
                id="deletebtn"
                onClick={handleDeleteClick}
              ></i>
              <i className="ri-edit-fill" id="editbtn" onClick={handleEditableClick}></i>
            </>
          ) : (
            <>
              <i className="ri-check-line" id="saveeditbtn" onClick={handleSaveEdit}></i>
              <i className="ri-close-circle-fill" id="canceleditbtn" onClick={handleCancelEdit}></i>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export default App;
