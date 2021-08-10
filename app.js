"use strict";
const container = document.querySelector("#container");
let ctx;

// To make API call
const getJSON = async function (url) {
  try {
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

// To render error message
const renderError = function (
  message = "Data Not Found!!! Please Try Again..."
) {
  const html = `
  <div class="error">
    <p>${message}</p>
  </div>
  `;
  container.innerHTML = "";
  container.insertAdjacentHTML("beforeend", html);
};

// To render loading spinner
const renderSpinner = function () {
  const html = `
  <div class="load__container">
    <div class="loader"></div>
  </div>
  `;
  container.insertAdjacentHTML("beforeend", html);
};

// Getting data from API calls
// data is of Total Country Cases and Statewise data
// data1 is of Medicine Suppliers
// data2 is of Oxygen Suppliers
// data3 is of Ambulance Drivers
const getData = async function () {
  try {
    renderSpinner();

    const data = await getJSON(
      "https://api.rootnet.in/covid19-in/stats/latest"
    );

    render(data);
  } catch (err) {
    renderError();
  }
};
getData();

// Rendering data to user interface
const render = function (data) {
  const html = `
      <section id="info">
        <div class="stats">
          <h2 class="title">Coronavirus Cases:</h2>
          <h1 class="number-1 mb-1">${data.data.summary.total.toLocaleString(
            "en-IN"
          )}</h1>
        </div>
        <div class="stats">
          <h2 class="title">Deaths:</h2>
          <h1 class="number-2">${data.data.summary.deaths.toLocaleString(
            "en-IN"
          )}</h1>
        </div>
        <div class="stats">
          <h2 class="title">Recovered:</h2>
          <h1 class="number-3">${data.data.summary.discharged.toLocaleString(
            "en-IN"
          )}</h1>
        </div>
        <div class="chart">
          <canvas id="myChart"></canvas>
        </div>
      </section>
      <section id="info-1">
        <div class="left">
          <h3 class="title">ACTIVE CASES</h3>
          <h4 class="number-1">${(
            data.data.summary.total -
            data.data.summary.discharged -
            data.data.summary.deaths
          ).toLocaleString("en-IN")}</h4>
          <p>Currently Infected Patients</p>
        </div>
        <div class="right">
          <h3 class="title">CLOSED CASES</h3>
          <h4 class="number-3">${(
            data.data.summary.discharged + data.data.summary.deaths
          ).toLocaleString("en-IN")}</h4>
          <p>Cases which had an outcome</p>
        </div>
      </section>
      <section id="stateview">
      <h2>COVID-19 State-Wise Status</h2>
        <table>
          <tr>
            <th>State</th>
            <th>Total Cases</th>
            <th>Total Deaths</th>
            <th>Total Recovered</th>
          </tr>
        ${data.data.regional.map(stateTable).join("")}
        </table>
      </section>
  `;
  container.innerHTML = "";
  container.insertAdjacentHTML("beforeend", html);
  container.style.opacity = 1;
  ctx = document.getElementById("myChart").getContext("2d");
  renderChart(data);
};

// Statewise Data
const stateTable = function (state) {
  return `
  <tr>
    <td>${state.loc}</td>
    <td>${state.totalConfirmed.toLocaleString("en-IN")}</td>
    <td>${state.deaths.toLocaleString("en-IN")}</td>
    <td>${state.discharged.toLocaleString("en-IN")}</td>
  </tr>
  `;
};

// To render pie chart
const renderChart = function (data) {
  const myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Total Cases", "Recovered", "Deaths"],
      datasets: [
        {
          backgroundColor: ["#fca311", "#00f5d4", "#d00000"],
          data: [
            data.data.summary.total,
            data.data.summary.discharged,
            data.data.summary.deaths,
          ],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#ffffff",
          },
        },
      },
    },
  });
};
