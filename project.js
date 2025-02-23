// Selecting elements from the HTML
const postTaskBtn = document.getElementById('postTaskBtn');
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskList = document.getElementById('taskList');

// Function to add a new task
function addTask(title, description) {
    // Create a new list item for the task
    const li = document.createElement('li');

    // Set the inner HTML of the list item
    li.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        <button class="completeBtn">Mark as Complete</button>
    `;

    // Add the list item to the task list
    taskList.appendChild(li);

    // Add functionality to the 'Mark as Complete' button
    const completeBtn = li.querySelector('.completeBtn');
    completeBtn.addEventListener('click', function() {
        li.style.textDecoration = 'line-through';
        completeBtn.remove();  // Remove button after marking complete
    });
}

// Event listener for posting a task
postTaskBtn.addEventListener('click', function() {
    const title = taskTitleInput.value.trim();
    const description = taskDescriptionInput.value.trim();

    // Check if both fields are filled
    if (title && description) {
        addTask(title, description);  // Add the task to the list

        // Clear the input fields after adding the task
        taskTitleInput.value = '';
        taskDescriptionInput.value = '';
    } else {
        alert('Please fill in both the title and description!');
    }
});

const taskInput = document.querySelector('#taskInput');
// database.ref('tasks').on('value', (snapshot) => {
//     taskList.innerHTML = '';  // Clear the existing tasks before adding new ones

//     snapshot.forEach((childSnapshot) => {
//         const taskData = childSnapshot.val();
//         const taskId = childSnapshot.key;

//         const li = document.createElement('li');
//         li.textContent = taskData.text;

//         if (taskData.completed) {
//             li.style.textDecoration = 'line-through';
//         } else {
//             const completeBtn = document.createElement('button');
//             completeBtn.textContent = 'Complete';
//             completeBtn.classList.add('completeBtn');

//             completeBtn.addEventListener('click', function() {
//                 database.ref('tasks/' + taskId).update({ completed: true });
//             });

//             li.appendChild(completeBtn);
//         }

//         taskList.appendChild(li);
//     });
// });
const addTaskBtn = document.querySelector('#addTaskBtn');
addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();  // Get the text from input and remove extra spaces
    if (taskText) {  // Check if there's text (avoid empty tasks)
        const taskRef = database.ref('tasks').push();  // Create a new task in the 'tasks' section in Firebase
        taskRef.set({  // Save task data to Firebase
            text: taskText,
            completed: false  // Task starts as incomplete
        });
        taskInput.value = '';  // Clear the input field after saving
    }
});

//step 3.2
database.ref('tasks').on('value', (snapshot) => {
    taskList.innerHTML = '';  // Clear the task list before adding tasks from Firebase

    snapshot.forEach((childSnapshot) => {
        const taskData = childSnapshot.val();  // Get task data (text & completed status)
        const taskId = childSnapshot.key;  // Unique ID for each task in Firebase

        const li = document.createElement('li');  // Create a new list item
        li.textContent = taskData.text;  // Set the task text

        if (taskData.completed) {  // If the task is completed
            li.style.textDecoration = 'line-through';  // Strike through the task
        } else {  // If task is NOT completed
            const completeBtn = document.createElement('button');  // Create 'Complete' button
            completeBtn.textContent = 'Complete';
            completeBtn.classList.add('completeBtn');
            
            completeBtn.addEventListener('click', function() {
                database.ref('tasks/' + taskId).update({ completed: true });  // Mark task as complete in Firebase
            });

            li.appendChild(completeBtn);  // Add the button to the task
        }

        taskList.appendChild(li);  // Add the task to the task list on the screen
    });
});

addTaskBtn.addEventListener('click', function() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const taskRef = database.ref('tasks').push();
                taskRef.set({
                    text: taskText,
                    completed: false,
                    location: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                });
                taskInput.value = '';
            });
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }
});

const li = document.createElement('li');
li.textContent = `${taskData.text} 
    ${taskData.location ? 
    ` (Lat: ${taskData.location.latitude.toFixed(2)}, Lng: ${taskData.location.longitude.toFixed(2)})` : ''}`;