"use strict";
const container = document.querySelector("#container");

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
  console.log(data);

  render(data);
};
getData();

const render = function (data) {
  const html = `
  <section id="info">
        <div class="stats">
          <h2 class="title">Coronavirus Cases:</h2>
          <h1 class="number-1 mb-1">${data.confirmed}</h1>
          <a class="btn" href="#stateview">View By States</a>
        </div>
        <div class="stats">
          <h2 class="title">Deaths:</h2>
          <h1 class="number-2">${data.deaths}</h1>
        </div>
        <div class="stats">
          <h2 class="title">Recovered:</h2>
          <h1 class="number-3">${data.recovered}</h1>
        </div>
      </section>
      <section id="info-1">
        <div class="left">
          <h3 class="title">ACTIVE CASES</h3>
          <h4 class="number-1">${
            data.confirmed - data.recovered - data.deaths
          }</h4>
          <p>Currently Infected Patients</p>
        </div>
        <div class="right">
          <h3 class="title">CLOSED CASES</h3>
          <h4 class="number-3">${data.recovered + data.deaths}</h4>
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
};

const table = function (state) {
  return `
  <tr>
    <td>${state.label}</td>
    <td>${state.confirmed}</td>
    <td>${state.deaths}</td>
    <td>${state.recovered}</td>
  </tr>
  `;
};
// getJSON("https://covid-19india-api.herokuapp.com/v2.0/state_data");