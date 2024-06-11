import onChange from 'on-change';

const renderTasks = (state, elements) => {
  const taskContaier = document.querySelector('.tasks');
  taskContaier.innerHTML = '';
  document.querySelector(`.filter-count-all`).textContent = state.tasks.length;
  document.querySelector(`.filter-count-completed`).textContent = state.completedTasks.length;
  document.querySelector(`.filter-count-uncompleted`).textContent = state.tasks.length - state.completedTasks.length;

  const validTasks = state.tasks.filter((task) => {
    if (state.filter == 'completed' && state.completedTasks.includes(task.id)) {
      return task
    } else if (state.filter == 'uncompleted' && !state.completedTasks.includes(task.id)) {
      return task
    } else if (state.filter == 'all') {
      return task;
    }
  })
  validTasks.forEach((task) => {
    const taskEl = document.createElement('li');
    taskEl.classList = 'class="task list-group-item d-flex justify-content-between align-items-center border-start-0 border-top border-end-0 border-bottom-0 rounded-0'
    taskEl.setAttribute('id', task.id);
    const completed = state.completedTasks.includes(task.id);
    taskEl.innerHTML = `
    <div class="d-flex flex-column ${completed ? 'opacity-50' : ''}">
      <div class="d-flex align-items-center">
        <input class="form-check-input me-3 ${task.priority} ${completed ? 'completedCheckbox' : ''} " type="checkbox" value="" aria-label="..." ${completed ? 'checked' : ''}/>
        <div> 
          <div class="taskName ${completed ? 'text-decoration-line-through' : ''}">${task.name}</div>
          <div class="taskDescription text-muted small">
            ${task.description}
          </div>
        </div>
      </div>
    </div>
    <div class="actionsBlock d-flex align-items-center">
      <a href="#!" data-mdb-tooltip-init class="deleteBtn ms-2">
        <i class="bi bi-x-lg"></i>
      </a>
    </div>`
    taskContaier.prepend(taskEl);
    localStorage.setItem("todos", JSON.stringify(state.tasks)); //Converts object to string and stores in local storage

  })
}

const toggleVisability = (element) => {
  element.classList.toggle('hide');
  element.classList.toggle('shown');
}
export default (state, elements) => {
  const view = onChange(state, (path, value) => {
    switch (path) {
      case ('tasks'):
      case ('completedTasks'):
        renderTasks(state, elements)
        break;
      case ('addTaskForm.shown'):
        toggleVisability(document.querySelector('#addTaskForm'));
        toggleVisability(document.querySelector('#addTaskBtn'));
        break;
      case ('addTaskForm.hasMistakes.wholeForm'):
        elements.taskEditorSubmit.disabled = state.addTaskForm.hasMistakes.wholeForm
        break;
      case ('filter'):
        renderTasks(state, elements)
        elements.listHeader.textContent = state.filter[0].toUpperCase() + state.filter.slice(1) + ' tasks';
        break;
    }

  })
  return view;
}