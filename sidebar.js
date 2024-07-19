// sidebar.js

function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.transform === 'translateX(0px)') {
      sidebar.style.transform = 'translateX(-100%)';
    } else {
      sidebar.style.transform = 'translateX(0px)';
    }
  }
  
  function showSection(sectionId) {
    const sections = ['task-list', 'add-task'];
    sections.forEach(section => {
      document.getElementById(section).style.display = 'none';
    });
  
    document.getElementById(sectionId).style.display = 'block';
  }
  
  function toggleAddTaskForm() {
    const addTaskForm = document.getElementById('add-task');
    if (addTaskForm.style.display === 'none' || addTaskForm.style.display === '') {
      addTaskForm.style.display = 'block';
    } else {
      addTaskForm.style.display = 'none';
    }
  }
