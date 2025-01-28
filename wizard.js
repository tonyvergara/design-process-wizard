document.addEventListener('DOMContentLoaded', initializeWizard);

function initializeWizard() {
    generateWizardSteps(processSteps);
    generateStepIndicator(processSteps);
    toggleStepIndicator(false);
    document.getElementById('start-page').style.display = 'block';
    updateButtons();
}

// Show/hide date inputs when tasks are selected
wizard.addEventListener('change', function(event) {
    if (event.target.type === 'checkbox') {
        const dateInputs = event.target.closest('.usa-checkbox').querySelector('.date-inputs');
        dateInputs.classList.toggle('hidden', !event.target.checked);
    }
});

// Collect selected tasks with dates
function updateSelectedOptions(checkbox) {
    const stepNumber = checkbox.closest('.step').dataset.step;
    if (!selectedOptions[stepNumber]) {
        selectedOptions[stepNumber] = [];
    }

    const task = checkbox.value;
    const startDate = checkbox.closest('.usa-checkbox').querySelector('.start-date')?.value || null;
    const endDate = checkbox.closest('.usa-checkbox').querySelector('.end-date')?.value || null;

    if (checkbox.checked) {
        selectedOptions[stepNumber].push({ task, startDate, endDate });
    } else {
        selectedOptions[stepNumber] = selectedOptions[stepNumber].filter(item => item.task !== task);
    }
}

// Update summary page with tasks and dates
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
                listItem.textContent = `${option.task} (Start: ${option.startDate || 'N/A'}, End: ${option.endDate || 'N/A'})`;
                optionList.appendChild(listItem);
            });
            summary.appendChild(optionList);
        }
    }

    if (!hasSelectedTasks) {
        const emptyState = document.createElement('div');
        emptyState.innerHTML = `<p>No tasks selected; try again!</p><a href="#" onclick="restartWizard()">Start Over</a>`;
        summary.appendChild(emptyState);
    } else {
        document.getElementById('downloadBtn').classList.remove('hidden');
        document.getElementById('timelineBtn').classList.remove('hidden');
    }
}

// Export tasks with dates to CSV
function exportToCSV() {
    const initiative = document.getElementById('initiative').value;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Initiative,Phase,Task,Start Date,End Date\n";

    for (const step in selectedOptions) {
        selectedOptions[step].forEach(option => {
            csvContent += `${initiative},${processSteps[step - 1].name},${option.task},${option.startDate || ''},${option.endDate || ''}\n`;
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "design_process_tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Render timeline view
function showTimeline() {
    const timelineView = document.getElementById('timeline-view');
    const summaryPage = document.getElementById('summary-page');
    
    // Prepare data for the timeline
    const timelineData = [];
    for (const step in selectedOptions) {
        selectedOptions[step].forEach(option => {
            if (option.startDate && option.endDate) {
                timelineData.push({
                    id: `${step}-${option.task}`,
                    content: option.task,
                    start: option.startDate,
                    end: option.endDate,
                });
            }
        });
    }

    // Render timeline using vis.js
    const container = document.getElementById('timeline-container');
    container.innerHTML = ''; // Clear previous timeline
    const items = new vis.DataSet(timelineData);
    
    new vis.Timeline(container, items, {});
    
    summaryPage.classList.add('hidden');
    timelineView.classList.remove('hidden');
}

function hideTimeline() {
    const timelineView = document.getElementById('timeline-view');
    const summaryPage = document.getElementById('summary-page');
    
    timelineView.classList.add('hidden');
    summaryPage.classList.remove('hidden');
}
