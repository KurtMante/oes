let jobs = [];  

function addJob() {
  const name = document.getElementById('job-name').value;
  const arrivalTime = parseInt(document.getElementById('arrival-time').value);
  const burstTime = parseInt(document.getElementById('burst-time').value);
  
  if (name && !isNaN(arrivalTime) && !isNaN(burstTime)) {

    jobs.push({ name, arrivalTime, burstTime });

    const jobList = document.getElementById('job-list');
    const jobItem = document.createElement('li');
    jobItem.textContent = `${name} - Arrival: ${arrivalTime}, Burst: ${burstTime}`;
    jobList.appendChild(jobItem);

    document.getElementById('job-name').value = '';
    document.getElementById('arrival-time').value = '';
    document.getElementById('burst-time').value = '';
  } else {
    alert("Please enter valid job details.");
  }
}

function scheduleJobs() {
  if (jobs.length === 0) {
    alert("Please add some jobs first!");
    return;
  }

  jobs.sort((a, b) => a.arrivalTime - b.arrivalTime || a.burstTime - b.burstTime);

  let currentTime = 0;
  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  let tableRows = '';
  let ganttChartHTML = '';

  jobs.forEach(job => {

    currentTime = Math.max(currentTime, job.arrivalTime);

    const startTime = currentTime;
    const callTime = startTime + job.burstTime;
    const waitingTime = startTime - job.arrivalTime;
    const turnaroundTime = callTime - job.arrivalTime;

    totalWaitingTime += waitingTime;
    totalTurnaroundTime += turnaroundTime;

    tableRows += `
      <tr>
        <td>${job.name}</td>
        <td>${job.arrivalTime}</td>
        <td>${job.burstTime}</td>
        <td>${callTime}</td>
        <td>${turnaroundTime}</td>
        <td>${waitingTime}</td>
        
      </tr>
    `;
    ganttChartHTML += `
      <div class="gantt-bar" style="left: ${startTime * 40}px; width: ${job.burstTime * 40}px;">
        <span>${job.name}</span>
      </div>
    `;

    currentTime = callTime;
  });

  const avgWaitingTime = totalWaitingTime / jobs.length;
  const avgTurnaroundTime = totalTurnaroundTime / jobs.length;

  const tableBody = document.querySelector('#output-table tbody');
  tableBody.innerHTML = tableRows;

  const avgRow = `
    <tr>
      <td colspan="3"><strong>Average</strong></td>
      <td></td>
      <td>${avgWaitingTime.toFixed(2)}</td>
      <td>${avgTurnaroundTime.toFixed(2)}</td>
    </tr>
  `;
  tableBody.innerHTML += avgRow;

  // Show the table and Gantt chart
  document.getElementById('output-table').style.display = 'table';
  document.getElementById('gantt-container').innerHTML = ganttChartHTML;
}s