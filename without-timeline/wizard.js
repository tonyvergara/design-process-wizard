const wizard = document.getElementById('wizard');
const steps = wizard.getElementsByClassName('step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');
let currentStep = 0;
let selectedOptions = {};

// Define steps directly in JavaScript
const processSteps = [
    {
        name: "Planning",
        description: "The Planning phase is crucial for setting the foundation of your project.",
        tasks: [
            "Define project goals and objectives",
            "Create project plan",
            "Identify key stakeholders",
            "Host a kickoff meeting"
        ]
    },
    {
        name: "Discovery",
        description: "The Discovery phase is about gathering information and insights. Discovery can and should happen at all phases of the product lifecycle, not just at the beginning of a project.",
        tasks: [
            "Conduct stakeholder interviews",
            "Analyze existing data",
            "Review desk research and other external sources",
            "Perform competitive analysis"
        ]
    },
    {
        name: "User Research",
        description: "<p>The User Research phase focuses on understanding your users in depth.</p><h4>Lorem</h4>",
        tasks: [
            "Conduct user interviews",
            "Create user personas",
            "Develop user journey maps"
        ]
    },
    {
        name: "Strategy",
        description: "The Strategy phase involves defining the direction and approach for the project.",
        tasks: [
            "Update project goals and objectives",
            "Draft SBARs for key product decisions",
            "Draft strategy deck to share findings out to wider team",
            "Develop content strategy",
            "Create user flows/service blueprints to visualize end-to-end process",
            "Draft information architecture",
        ]
    },
    {
        name: "Design",
        description: "The Design phase is where you bring your insights to life.",
        tasks: [
            "Host a co-design workshop to explore options",
            "[content framing]",
            "Create low-fidelity wireframes (either sketches or using a kit)",
            "Review layout and flow with wider team for feedback",
            "Develop high-fidelity mockups based on MDWDS",
            "Review visual design within Design CoP for alignment with MDWDS",
            "Design interactive prototypes",
            "Review prototypes with wider team to visualize end-to-end process, but in high-fidelity"
        ]
    },
    {
        name: "Concept Testing",
        description: "The Design phase is where you bring your insights to life.",
        tasks: [
            "Draft testing plan",
            "Build usability test & pilot internally",
            "Recruit & screen participants",
            "Conduct testing",
            "Analyze testing data",
            "Draft report with findings, insights, and recommendations",
            "Share recommendations with wider team for approval"
        ]
    },
    {
        name: "Design rd 2",
        description: "The Design phase is where you bring your insights to life.",
        tasks: [
            "Revise designs based on user feedback",
            "Update prototypes",
            "Conduct internal design reviews, srarting wi",
            "Finalize design specifications"
        ]
    },
];

function initializeWizard() {
    generateWizardSteps(processSteps);
    generateStepIndicator(processSteps);
    toggleStepIndicator(false);
    document.getElementById('start-page').style.display = 'block';
    updateButtons();
}

function generateWizardSteps(steps) {
    const wizard = document.getElementById('wizard');
    const summaryPage = document.getElementById('summary-page');
    steps.forEach((step, index) => {
        const stepElement = createStepElement(step, index + 1);
        wizard.insertBefore(stepElement, summaryPage);
    });
}

function createStepElement(step, stepNumber) {
  const stepElement = document.createElement('div');
  stepElement.className = 'step';
  stepElement.dataset.step = stepNumber;
  
  stepElement.innerHTML = `
    <h2>Step ${stepNumber}: ${step.name}</h2>
    <div class="step-content">
      <div class="step-description">
        ${step.description}
      </div>
      <div class="task-list">
        ${step.tasks.map(task => `
          <div class="usa-checkbox">
            <input class="usa-checkbox__input" id="task-${stepNumber}-${task}" type="checkbox" name="${step.name.toLowerCase()}" value="${task}">
            <label class="usa-checkbox__label" for="task-${stepNumber}-${task}">${task}</label>
          </div>
        `).join('')}
        <div id="custom-tasks-${stepNumber}"></div>
        <button class="usa-button" onclick="addCustomTask(${stepNumber})">Add new task/deliverable</button>
      </div>
    </div>
  `;
  
  return stepElement;
}


function generateStepIndicator(steps) {
    const stepIndicator = document.querySelector('.usa-step-indicator__segments');
    steps.forEach((step, index) => {
        const li = document.createElement('li');
        li.className = 'usa-step-indicator__segment';
        li.innerHTML = `<span class="usa-step-indicator__segment-label">${step.name}</span>`;
        stepIndicator.appendChild(li);
    });
}

function startWizard() {
    const initiative = document.getElementById('initiative').value;
    if (!initiative) {
        alert("Please enter an initiative name.");
        return;
    }
    document.getElementById('start-page').style.display = 'none';
    navigate(1);
    updateStepIndicator();
    toggleStepIndicator(true);
}

function navigate(direction) {
    if (direction > 0) {
        if (hasEmptyCheckedTasks(currentStep)) {
            alert("Please fill in all checked task/deliverable fields before proceeding.");
            return;
        }
    }
    
    toggleStepIndicator(true);
    if (currentStep >= 0) {
        steps[currentStep].style.display = 'none';
    }
    currentStep += direction;
    steps[currentStep].style.display = 'block';
    updateButtons();
    updateStepIndicator();
    if (currentStep === steps.length - 1) {
        showSummary();
    }
    if (currentStep == 0) {
        toggleStepIndicator(false);
    }
}

// function isStepValid(step) {
//     return selectedOptions[step] && selectedOptions[step].length > 0;
// }

function hasEmptyCheckedTasks(step) {
    const currentStepElement = steps[step];
    const checkedInputs = currentStepElement.querySelectorAll('input[type="checkbox"]:checked');
    
    for (let input of checkedInputs) {
        const textInput = input.closest('.usa-checkbox').querySelector('input[type="text"]');
        if (textInput && textInput.value.trim() === '') {
            return true; // Found an empty checked task
        }
    }
    
    return false; // No empty checked tasks found
}

function updateButtons() {
    buttonGroup.style.display = currentStep <= 0 ? 'none' : 'inline-block';
    nextBtn.textContent = currentStep === steps.length - 2 ? 'Finish' : 'Next';
    nextBtn.style.display = currentStep === steps.length - 1 ? 'none' : 'inline-block';
}

function updateStepIndicator() {
    const segments = document.querySelectorAll('.usa-step-indicator__segment');
    segments.forEach((segment, index) => {
        if (index < currentStep - 1) {
            segment.classList.add('usa-step-indicator__segment--complete');
            segment.classList.remove('usa-step-indicator__segment--current');
        } else if (index === currentStep - 1) {
            segment.classList.remove('usa-step-indicator__segment--complete');
            segment.classList.add('usa-step-indicator__segment--current');
        } else {
            segment.classList.remove('usa-step-indicator__segment--complete', 'usa-step-indicator__segment--current');
        }
    });
}

function toggleStepIndicator(show) {
    const stepIndicator = document.querySelector('.usa-step-indicator');
    stepIndicator.style.display = show ? 'block' : 'none';
}

function showSummary() {
    toggleStepIndicator(false);
    const summary = document.getElementById('summary');
    const initiative = document.getElementById('initiative').value;
    document.getElementById('initiative-title').textContent = `Initiative: ${initiative}`;
    summary.innerHTML = '';

    let hasSelectedTasks = false;
    for (const step in selectedOptions) {
        if (selectedOptions[step].length > 0) {
            hasSelectedTasks = true;
            const stepHeader = document.createElement('h3');
            stepHeader.textContent = processSteps[step - 1].name;
            summary.appendChild(stepHeader);
            const optionList = document.createElement('ul');
            selectedOptions[step].forEach(option => {
                const listItem = document.createElement('li');
                listItem.textContent = option;
                optionList.appendChild(listItem);
            });
            summary.appendChild(optionList);
            downloadBtn.classList.remove('hidden')
        }
    }

    if (!hasSelectedTasks) {
        const emptyState = document.createElement('div');
        emptyState.innerHTML = `
            <p>No tasks selected; try again!</p>
            <a href="#" onclick="restartWizard()">Start Over</a>
        `;
        summary.appendChild(emptyState);
    }
}

function restartWizard() {
    currentStep = 0;
    selectedOptions = {};
    document.getElementById('start-page').style.display = 'block';
    document.getElementById('initiative').value = '';
    toggleStepIndicator(false);
    for (let i = 1; i < steps.length; i++) {
        steps[i].style.display = 'none';
    }
    updateButtons();
}

function addCustomTask(step) {
    const customTasksContainer = document.getElementById(`custom-tasks-${step}`);
    const newTaskId = `custom-task-${step}-${customTasksContainer.children.length + 1}`;
    const newTaskHtml = `
        <div class="usa-checkbox custom-task">
            <input class="usa-checkbox__input" id="${newTaskId}" type="checkbox" name="custom-task" value="" checked>
            <label class="usa-checkbox__label" for="${newTaskId}">
                <input type="text" class="usa-input" onchange="updateCustomTaskValue(this)" placeholder="Enter task/deliverable">
            </label>
        </div>
    `;
    customTasksContainer.insertAdjacentHTML('beforeend', newTaskHtml);
}

function updateCustomTaskValue(input) {
    const checkbox = input.closest('.usa-checkbox').querySelector('input[type="checkbox"]');
    checkbox.value = input.value;
    updateSelectedOptions(checkbox);
}

function updateSelectedOptions(checkbox) {
    const stepNumber = checkbox.closest('.step').dataset.step;
    if (!selectedOptions[stepNumber]) {
        selectedOptions[stepNumber] = [];
    }
    if (checkbox.checked && checkbox.value.trim()) {
        if (!selectedOptions[stepNumber].includes(checkbox.value)) {
            selectedOptions[stepNumber].push(checkbox.value);
        }
    } else {
        const index = selectedOptions[stepNumber].indexOf(checkbox.value);
        if (index > -1) {
            selectedOptions[stepNumber].splice(index, 1);
        }
    }
}

wizard.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        updateSelectedOptions(event.target);
    }
});

function exportToCSV() {
    const initiative = document.getElementById('initiative').value;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Initiative,Phase,Task\n";
    
    for (const step in selectedOptions) {
        if (selectedOptions[step].length > 0) {
            selectedOptions[step].forEach(option => {
                csvContent += `${initiative},${processSteps[step - 1].name},${option}\n`;
            });
        }
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "design_process_tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Initialize the wizard
document.addEventListener('DOMContentLoaded', initializeWizard);