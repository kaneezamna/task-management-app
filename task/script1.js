document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskAssigneeInput = document.getElementById('taskAssignee');
    const taskDueDateInput = document.getElementById('taskDueDate');
    
    const todoTasksContainer = document.getElementById('todo-tasks');
    const inprogressTasksContainer = document.getElementById('inprogress-tasks');
    const doneTasksContainer = document.getElementById('done-tasks');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render all tasks
    renderAllTasks();
    
    // Add new task
    addTaskBtn.addEventListener('click', addNewTask);
    
    function addNewTask() {
        const title = taskTitleInput.value.trim();
        const description = taskDescriptionInput.value.trim();
        const assignee = taskAssigneeInput.value.trim();
        const dueDate = taskDueDateInput.value;
        
        if (!title) {
            alert('Task title is required!');
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            assignee,
            dueDate,
            status: 'todo',
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        
        // Clear inputs
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
        taskAssigneeInput.value = '';
        taskDueDateInput.value = '';
    }
    
    function renderAllTasks() {
        // Clear all containers first
        todoTasksContainer.innerHTML = '';
        inprogressTasksContainer.innerHTML = '';
        doneTasksContainer.innerHTML = '';
        
        // if (tasks.length === 0) {
        //     todoTasksContainer.innerHTML = '<div class="empty-state">No tasks yet. Add a new task to get started!</div>';
        //     return;
        // }
        
        // Render each task in the appropriate column
        tasks.forEach(task => {
            renderTask(task);
        });
    }
    
    function renderTask(task) {
        const taskElement = createTaskElement(task);
        
        switch(task.status) {
            case 'todo':
                todoTasksContainer.appendChild(taskElement);
                break;
            case 'inprogress':
                inprogressTasksContainer.appendChild(taskElement);
                break;
            case 'done':
                doneTasksContainer.appendChild(taskElement);
                break;
        }
        
        // Update empty states
        updateEmptyStates();
    }
    
    function createTaskElement(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.status}`;
        taskElement.dataset.id = task.id;
        
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        
        taskElement.innerHTML = `
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <p class="task-description">${task.description || 'No description'}</p>
                <div class="task-meta">
                    <span>Assigned to: ${task.assignee || 'Unassigned'}</span>
                    <span>Due: ${dueDate}</span>
                </div>
            </div>
            <form class="task-form">
                <input type="text" class="edit-title" value="${task.title}" required>
                <textarea class="edit-description">${task.description || ''}</textarea>
                <input type="text" class="edit-assignee" value="${task.assignee || ''}" placeholder="Assign To">
                <input type="date" class="edit-due-date" value="${task.dueDate || ''}">
            </form>
            <div class="task-actions">
                <button class="task-btn edit-btn"><i class="fas fa-edit"></i> Edit</button>
                <button class="task-btn save-btn"><i class="fas fa-save"></i> Save</button>
                <button class="task-btn delete-btn"><i class="fas fa-trash"></i> Delete</button>
                ${task.status !== 'done' ? 
                    `<button class="task-btn move-btn">
                        <i class="fas fa-arrow-right"></i> 
                        ${task.status === 'todo' ? 'Start Progress' : 'Mark Done'}
                    </button>` : ''
                }
            </div>
        `;
        
        // Add event listeners
        const editBtn = taskElement.querySelector('.edit-btn');
        const saveBtn = taskElement.querySelector('.save-btn');
        const deleteBtn = taskElement.querySelector('.delete-btn');
        const moveBtn = taskElement.querySelector('.move-btn');
        const taskForm = taskElement.querySelector('.task-form');
        const taskContent = taskElement.querySelector('.task-content');
        
        editBtn.addEventListener('click', () => {
            taskContent.style.display = 'none';
            taskForm.style.display = 'flex';
            editBtn.style.display = 'none';
            saveBtn.style.display = 'flex';
            if (moveBtn) moveBtn.style.display = 'none';
        });
        
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const editedTitle = taskElement.querySelector('.edit-title').value.trim();
            const editedDescription = taskElement.querySelector('.edit-description').value.trim();
            const editedAssignee = taskElement.querySelector('.edit-assignee').value.trim();
            const editedDueDate = taskElement.querySelector('.edit-due-date').value;
            
            if (!editedTitle) {
                alert('Task title is required!');
                return;
            }
            
            // Update task in array
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                tasks[taskIndex] = {
                    ...tasks[taskIndex],
                    title: editedTitle,
                    description: editedDescription,
                    assignee: editedAssignee,
                    dueDate: editedDueDate
                };
                
                saveTasks();
                
                // Update displayed content
                taskElement.querySelector('.task-title').textContent = editedTitle;
                taskElement.querySelector('.task-description').textContent = editedDescription || 'No description';
                taskElement.querySelector('.task-meta span:first-child').textContent = `Assigned to: ${editedAssignee || 'Unassigned'}`;
                
                const formattedDueDate = editedDueDate ? new Date(editedDueDate).toLocaleDateString() : 'No due date';
                taskElement.querySelector('.task-meta span:last-child').textContent = `Due: ${formattedDueDate}`;
            }
            
            // Hide form and show content
            taskContent.style.display = 'block';
            taskForm.style.display = 'none';
            editBtn.style.display = 'flex';
            saveBtn.style.display = 'none';
            if (moveBtn) moveBtn.style.display = 'flex';
        });
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                taskElement.remove();
                updateEmptyStates();
            }
        });
        
        if (moveBtn) {
            moveBtn.addEventListener('click', () => {
                const taskIndex = tasks.findIndex(t => t.id === task.id);
                if (taskIndex !== -1) {
                    if (tasks[taskIndex].status === 'todo') {
                        tasks[taskIndex].status = 'inprogress';
                    } else if (tasks[taskIndex].status === 'inprogress') {
                        tasks[taskIndex].status = 'done';
                    }
                    
                    saveTasks();
                    taskElement.remove();
                    renderTask(tasks[taskIndex]);
                    updateEmptyStates();
                }
            });
        }
        
        return taskElement;
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function updateEmptyStates() {
        const columns = [
            { container: todoTasksContainer, status: 'todo' },
            { container: inprogressTasksContainer, status: 'inprogress' },
            { container: doneTasksContainer, status: 'done' }
        ];
        
        columns.forEach(column => {
            const hasTasks = tasks.some(task => task.status === column.status);
            
            // if (!hasTasks) {
            //     let message = '';
            //     if (column.status === 'todo') message = 'No tasks to do. Add a new task!';
            //     else if (column.status === 'inprogress') message = 'No tasks in progress.';
            //     else message = 'No tasks completed yet.';
                
            //     column.container.innerHTML = `<div class="empty-state">${message}</div>`;
            // }
        });
    }
    
    // Set default due date to today
    const today = new Date().toISOString().split('T')[0];
    taskDueDateInput.value = today;
});





    
    // Rest of your existing task management code...
    // [Your existing task management JavaScript goes here]
;
 