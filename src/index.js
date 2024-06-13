import _ from 'lodash';
import './style.css';
import render from './render.js'
import { string } from 'yup';

const state = {
  tasks: [],
  completedTasks: [],
  filter: 'all',
  addTaskForm: {
    name: '',
    description: '',
    priority: '',
    hasMistakes: {
      name: true,
      description: false,
      wholeForm: true,
    },
    shown: false
  }
}
const elements = {
  addTaskForm: document.querySelector('#addTaskForm'),
  addTaskBtn: document.querySelector('#addTaskBtn'),
  taskEditorSubmit: document.querySelector('#taskEditorSubmit'),
  listHeader: document.querySelector('#listHeader'),
  priorityButton: document.getElementById('priority-button'),
  dropdownItems: document.querySelectorAll('.dropdown-item'),
  tasks: document.querySelector('.tasks'),
  filterMenu: document.querySelector('.filterMenu'),
  cancelForm: document.querySelector('#cancelForm')
}
const schemas = {
  name: string().required().min(1).max(50),
  description: string().required().max(80)
}

const view = render(state, elements)

view.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
view.completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

elements.addTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask();
  view.addTaskForm.hasMistakes.wholeForm = true;
})
elements.cancelForm.addEventListener('click', (e) => {
  view.addTaskForm.shown = false

})
const generateNewId = () => {
  var id = _.uniqueId();
  var existingId = view.tasks.map((task)=>task.id)
  while (existingId.includes(id)){
    id = _.uniqueId();
  }
  return id;
}
const addTask = () => {
  let formData = new FormData(elements.addTaskForm);
  elements.addTaskForm.reset()
  const name = formData.get('name');
  const description = formData.get('description')
  const priority = formData.get('priority')
  const task = {
    id: generateNewId(),
    name,
    description,
    priority
  }

  view.tasks.push(task);
}

elements.addTaskBtn.addEventListener('click', () => {
  view.addTaskForm.shown = !view.addTaskForm.shown
})

elements.dropdownItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const tab = e.target.closest('li')
    elements.dropdownItems.forEach((i) => {
      i.classList.remove('active');
    });
    tab.classList.add('active');
    const selectedIcon = tab.querySelector('.priority_picker_item_priority_icon svg');
    const selectedText = item.dataset.value ? item.dataset.value : 'Priority';
    elements.priorityButton.innerHTML = '';
    document.querySelector('#priorityInput').value = item.dataset.value
    const clonedIcon = selectedIcon.cloneNode(true);
    elements.priorityButton.appendChild(clonedIcon);
    elements.priorityButton.appendChild(document.createTextNode(selectedText));
  });
});

elements.addTaskForm.addEventListener('input', (e) => {
  e.preventDefault();
  const targetName = e.target.name;
  const targetData = new FormData(elements.addTaskForm).get(targetName);
  if (schemas[targetName].isValidSync(targetData)) {
    view.addTaskForm[targetName] = targetData;
    view.addTaskForm.hasMistakes[targetName] = false
  } else {
    view.addTaskForm.hasMistakes[targetName] = true
  }
  view.addTaskForm.hasMistakes.wholeForm =
    view.addTaskForm.hasMistakes.name ?? view.addTaskForm.hasMistakes.description

});

const addOrRemove = (array, item) => {
  const exists = array.includes(item)
  if (exists) {
    return array.filter((c) => { return c !== item })
  } else {
    const result = array
    result.push(item)
    return result
  }
}
const deleteTask = (id) => {
  const updatedTasks = view.tasks.filter((task) => task.id !== id)
  view.tasks = updatedTasks
  const completedDeletedTasks = view.completedTasks.filter((task_id)=> task_id !== id)
  view.completedTasks = completedDeletedTasks

  localStorage.setItem("tasks", JSON.stringify(view.tasks)); //Converts object to string and stores in local storage
  localStorage.setItem("completedTasks", JSON.stringify(view.completedTasks));
}

elements.tasks.addEventListener('click', (e) => {
  if (e.target.classList.contains('bi-x-lg')) {
    const taskEl = e.target.closest('li');
    return deleteTask(taskEl.id)
  }
  const taskEl = e.target.closest('li');
  const checkBox = taskEl.querySelector('input');
  checkBox.checked = !checkBox.checked;
  view.completedTasks = addOrRemove(view.completedTasks, taskEl.id)
  localStorage.setItem("completedTasks", JSON.stringify(view.completedTasks));
})

elements.filterMenu.addEventListener('click', (e) => {
  const filterOption = e.target.closest('.filterOption');
  const currentFilter = filterOption.dataset.value;
  view.filter = currentFilter;
})






