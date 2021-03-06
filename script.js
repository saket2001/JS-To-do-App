"use strict";
({
  plugins: ["jsdom-quokka-plugin"],
});

const AddBtn = document.querySelector(".Add-task-btn");
const taskCompletedBtn = document.querySelector(".small-circle-box");
const cutTaskBtn = document.querySelector(".endTask");
const AddTaskInput = document.querySelector("#Add-task-input");

const dateLabel = document.querySelector(".main_date");
const todaySection = document.querySelector(".today-section");
const tmrSection = document.querySelector(".tmr-section");
const dueSection = document.querySelector(".due-section");
const somedaySection = document.querySelector(".someday-section");

/////////////////////////////////
let taskArray = [];
let prevTaskArray = [];
//functions
// date
const now = new Date();
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-GB").format(date);
};
dateLabel.textContent = formatDate(now);

// this compares the dates
const compareDate = (d) => {
  const date = d.getDate();
  const month = d.getMonth();
  // console.log(date);
  // for today
  if (date == now.getDate()) return 0;
  // for tmr
  if (date == now.getDate() + 1) return 1;
  // for someday
  if (date > now.getDate() + 1 || month > now.getMonth()) return 2;
  // for due
  if (date < now.getDate()) return 3;
};

const saveData = function () {
  if (taskArray.length >= 0) {
    const obj = JSON.stringify(taskArray);
    localStorage.setItem("TaskArray", obj);
  }
};

const createDiv = function (...arr) {
  if (arr) {
    // creating the div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("task-row");
    // creating the checked btn
    const checkBtn = document.createElement("button");
    checkBtn.innerHTML = '<i class="fas fa-check"> </i>';
    checkBtn.classList.add("small-circle-box");
    todoDiv.appendChild(checkBtn);
    // creating the text
    const taskText = document.createElement("p");
    taskText.innerHTML = arr[0];
    taskText.classList.add("text");
    todoDiv.appendChild(taskText);
    // creating span
    const spanText = document.createElement("span");
    spanText.innerHTML = formatDate(arr[1]);
    spanText.classList.add("task_timer");
    todoDiv.appendChild(spanText);
    // creating the cut task btn
    const cutBtn = document.createElement("button");
    cutBtn.innerHTML = '<i class="fa fa-trash" aria-hidden="true"></i>';
    cutBtn.classList.add("endTask");
    todoDiv.appendChild(cutBtn);

    todaySection.appendChild(todoDiv);
    const sectionToAdd = compareDate(arr[1]);

    // saving on the local storage
    taskArray.push([arr[0], arr[1]]);
    saveData();

    // this section adds acc to date
    if (sectionToAdd === 0) {
      todaySection.appendChild(todoDiv);
      todoDiv.style.color = "#1F1F1F";
      cutBtn.style.color = "#1F1F1F";
      checkBtn.style.color = "#1F1F1F";
      todoDiv.style.background = "lightcyan";
    }
    if (sectionToAdd === 1) {
      tmrSection.appendChild(todoDiv);
      todoDiv.style.background = "rgb(61, 12, 117)";
    }
    if (sectionToAdd === 2) {
      somedaySection.appendChild(todoDiv);
    }
    if (sectionToAdd === 3) {
      dueSection.appendChild(todoDiv);
      // to make date different color
      todoDiv.style.color = "white";
      taskText.style.fontWeight = "bolder";
      todoDiv.style.background = "rgb(129, 231, 13)";
    }
    AddTaskInput.value = "";
    document.querySelector("#task-date").value = "";
  } else alert(`Please enter a task !!`);
};

// when page loads every time all previous task will load
const loadTasks = function () {
  let value = JSON.parse(localStorage.getItem("TaskArray"));

  if (!value) return;

  for (let i = 0; i < value.length; i++) {
    const val = value[i];
    prevTaskArray.push(val);
    createDiv(val[0], new Date(val[1]));
  }
};
loadTasks();

// event listeners
// this adds the task to the list
AddBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const task = AddTaskInput.value || "Empty task";
  const userDate = document.querySelector("#task-date").value || now;
  const date = new Date(userDate);
  createDiv(task, date);
});

// this adds a line through task text
// this deletes the task from the list
dueSection.addEventListener("click", deleteTask);
todaySection.addEventListener("click", deleteTask);
tmrSection.addEventListener("click", deleteTask);
somedaySection.addEventListener("click", deleteTask);

// functions
function deleteTask(e) {
  const item = e.target;
  // this removes task
  if (item.classList[0] === "endTask") {
    const todo = item.parentElement;
    const children = item.parentElement.childNodes;
    const taskText = children[1].textContent;
    // search the task to be deleted
    const set = new Set([...taskArray]);
    console.log(set);
    set.forEach((cur) => {
      if (cur[0] === taskText) {
        console.log(cur);
        set.delete(cur);
      }
    });

    //
    taskArray = [];
    taskArray.push(...set);
    console.log(taskArray);
    saveData();

    todo.classList.add("fall");
    // this waits for animation to end first
    todo.addEventListener("transitionend", () => {
      todo.remove();
    });
  }
  // this checks the task
  if (item.classList[0] === "small-circle-box") {
    const todo = item.parentElement;
    todo.classList.toggle("work-completed");
  }
}

// localStorage.clear();
