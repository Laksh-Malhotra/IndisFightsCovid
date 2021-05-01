"use strict";
const container = document.querySelector("#container");
// const ctx = document.getElementById("myChart").getContext("2d");

const getJSON = async function (url) {
  try {
    const res = await fetch(url);

    const data = await res.json();

    if (!res.ok) throw Error("Data not found!!!");
    return data;
  } catch (err) {
    console.log(err);
  }
};

const getData = async function () {
  const data = await getJSON("https://corona.blloc.com/current?country=India");

  render(data);

  // renderGraph(data);
};
getData();

const render = function (data) {
  const html = `
  <h3 class="head">
    COVID-19 CORONAVIRUS PANDEMIC
      <span
      ><a
        target="_blank"
        href="https://www.who.int/health-topics/coronavirus#tab=tab_1"
        >Know More</a
      ></span
      >
  </h3>
  <section id="info">
        <div class="stats">
          <h2 class="title">Coronavirus Cases:</h2>
          <h1 class="number-1 mb-1">${data.confirmed.toLocaleString(
            "en-IN"
          )}</h1>
          <a class="btn" href="#stateview">View By States</a>
        </div>
        <div class="stats">
          <h2 class="title">Deaths:</h2>
          <h1 class="number-2">${data.deaths.toLocaleString("en-IN")}</h1>
        </div>
        <div class="stats">
          <h2 class="title">Recovered:</h2>
          <h1 class="number-3">${data.recovered.toLocaleString("en-IN")}</h1>
        </div>
      </section>
      <section id="info-1">
        <div class="left">
          <h3 class="title">ACTIVE CASES</h3>
          <h4 class="number-1">${(
            data.confirmed -
            data.recovered -
            data.deaths
          ).toLocaleString("en-IN")}</h4>
          <p>Currently Infected Patients</p>
        </div>
        <div class="right">
          <h3 class="title">CLOSED CASES</h3>
          <h4 class="number-3">${(data.recovered + data.deaths).toLocaleString(
            "en-IN"
          )}</h4>
          <p>Cases which had an outcome</p>
        </div>
      </section>
      <section id="stateview">
        <table>
          <tr>
            <th>State</th>
            <th>Total Cases</th>
            <th>Total Deaths</th>
            <th>Total Recovered</th>
          </tr>
        ${data.statesData.map(table).join("")}
        </table>
      </section>
  `;
  container.insertAdjacentHTML("beforeend", html);
  container.style.opacity = 1;
};

const table = function (state) {
  return `
  <tr>
    <td>${state.label}</td>
    <td>${state.confirmed.toLocaleString("en-IN")}</td>
    <td>${state.deaths.toLocaleString("en-IN")}</td>
    <td>${state.recovered.toLocaleString("en-IN")}</td>
  </tr>
  `;
};

// const renderGraph = function (data) {
//   const myChart = new Chart(ctx, {
//     type: "doughnut",
//     data: {
//       labels: ["Total Cases", "Deaths", "Recovered"],
//       color: ["#fff"],
//       datasets: [
//         {
//           label: "# of Votes",
//           data: [data.confirmed, data.deaths, data.recovered],
//           backgroundColor: ["#fca311", "#d00000", "#00f5d4"],
//         },
//       ],
//     },
//     options: {
//       legend: {
//         labels: {
//           fontColor: "white",
//         },
//       },
//     },
//   });
// };
