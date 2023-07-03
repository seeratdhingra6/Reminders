let toDoListing = document.getElementById("toDoListing");

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
const MONTH_NAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/**
 * @description tis function fetches the data from api
 */
const fetchData = async () => {
  const response = await fetch(
    "https://dapper-figolla-30ac1d.netlify.app/.netlify/functions/api/todo"
  );
  return await response.json();
};

/**
 * @description this function adds new todos in API
 * @param newTodo - Todo which we have to add into our API
 */
const pushData = async (newTodo) => {
  const response = await fetch(
    "https://dapper-figolla-30ac1d.netlify.app/.netlify/functions/api/todo",
    {
      method: "POST",
      body: JSON.stringify(newTodo),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  return await response.json();
};
const deleteData = async (id) => {
  const response = await fetch(
    `https://dapper-figolla-30ac1d.netlify.app/.netlify/functions/api/todo/${id}`,
    {
      method: "DELETE",
    }
  );
  return await response.json();
};
/**
 * @description This function takes a response and then iterate on that response and render all the todos on DOM
 * which are present in the response.
 * @param response - which comes from get request of todo API
 */
const renderToDo = (response) => {
  toDoListing.innerHTML = "";
  let taskNumbers = response.length;
  document.getElementsByClassName("numberOfTasks")[0].innerHTML = taskNumbers;
  response.forEach((todo) => {
    toDoListing.innerHTML += `<li class="toDoItems">
        <input type="checkbox" class="checkbox" onclick="toggleLineThrough(event, '${todo._id}')"/> 
        <span id="${todo._id}" class="toDoValue">${todo.title}</span>
        <div id="titleFunction">
          <button onclick="removeToDo('${todo._id}')" class="removeToDo"><img src="./assets/trash.svg"></button>
        </div>
      </li>`;
  });
};
const newTodo = {
  title: "",
  userId: 1,
  completed: false,
};
/**
 * @description this function runs on Add button which picks the todo value entered by user and creates a newtodo and then pushes to api
 */
const AddToDo = () => {
  let textField = document.getElementsByClassName("textField")[0].value;
  newTodo.title = textField;
  pushData(newTodo).then((response) => {
    fetchData()
      .then((response) => {
        renderToDo(response);
      })
      .catch(console.error());
  });
};
/**
 * @description This function removes todo from API
 */
const removeToDo = (id) => {
  deleteData(id)
    .then((response) => {
      fetchData()
        .then((response) => {
          renderToDo(response);
        })
        .catch(console.error());
    })
    .catch((error) => console.log("DEBUG error", error));
};
/**
 * @description this function will display current time according to IST.
 */
const currentTime = () => {
  let currentDate = new Date();
  let day = currentDate.getDay();
  let month = currentDate.getMonth();
  let date = currentDate.getDate();
  document.getElementsByClassName("day")[0].innerHTML = WEEK_DAYS[day] + ",";
  document.getElementsByClassName("month")[0].innerHTML = MONTH_NAMES[month];
  document.getElementsByClassName("date")[0].innerHTML = date;
};

// This function set current time and date
currentTime();
/**
 * @description This function add line through when clicked checkbox and removes line through if again click on checkbox
 */
const toggleLineThrough = (event, id) => {
  const text = document.getElementById(id);
  if (event.target.checked) {
    text.style.textDecoration = "line-through";
  } else {
    text.style.textDecoration = none;
  }
};
// Getting all todos from API and render them on UI
fetchData()
  .then((response) => {
    renderToDo(response);
  })
  .catch(console.error());
