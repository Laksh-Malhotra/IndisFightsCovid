"use strict";
const container = document.querySelector("#container");

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
    const data1 = await getJSON(
      "https://life-api.coronasafe.network/data/medicine_verified.json"
    );
    const data2 = await getJSON(
      "https://life-api.coronasafe.network/data/oxygen_verified.json"
    );
    const data3 = await getJSON(
      "https://life-api.coronasafe.network/data/ambulance_verified.json"
    );

    render(data, data1, data2, data3);
  } catch (err) {
    renderError();
  }
};
getData();

// Rendering data to user interface
const render = function (data, data1, data2, data3) {
  const html = `
      <section id="info">
        <div class="stats">
          <h2 class="title">Coronavirus Cases:</h2>
          <h1 class="number-1 mb-1">${data.data.summary.total.toLocaleString(
            "en-IN"
          )}</h1>
          <div class="button">
            <a class="btn btn-1" href="#stateview">State-Wise Status</a>
            <a class="btn btn-2" href="#medicine">Medicine</a>
            <a class="btn btn-3" href="#oxygen">Oxygen</a>
            <a class="btn btn-4" href="#ambulance">Ambulance</a>
          </div>
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
      <section id="medicine">
      <h2>Medicine</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>State</th>
            <th>Phone Number</th>
            <th>Address</th>
          </tr>
        ${data1.data.map(mediTable).join("")}
        </table>
      </section>
      <section id="oxygen">
      <h2>Oxygen</h2>
        <table>
          <tr>
            <th>State</th>
            <th>District</th>
            <th>Company Name</th>
            <th>Name</th>
            <th>Phone Number</th>
          </tr>
        ${data2.data.map(o2Table).join("")}
        </table>
      </section>
      <section id="ambulance">
      <h2>Ambulance</h2>
        <table>
          <tr>
            <th>State</th>
            <th>District</th>
            <th>Phone Number</th>
          </tr>
        ${data3.data.map(vehicleTable).join("")}
        </table>
      </section>
  `;
  container.innerHTML = "";
  container.insertAdjacentHTML("beforeend", html);
  container.style.opacity = 1;
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

// Medicine Suppliers
const mediTable = function (info) {
  return `
  <tr>
    <td>${info.state}</td>
    <td>${info.district}</td>
    <td>${info.phone1 ? info.phone1 : "Invailid"}</td>
    <td>${info.address}</td>
  </tr>
  `;
};

// Oxygen Suppliers
const o2Table = function (info) {
  return `
  <tr>
    <td>${info.state}</td>
    <td>${info.district}</td>
    <td>${info.companyName ? info.companyName : "xyz"}</td>
    <td>${info.name ? info.name : "xyz"}</td>
    <td>${info.phone1 ? info.phone1 : "Invailid"}</td>
  </tr>
  `;
};

// Ambulance Drivers
const vehicleTable = function (info) {
  return `
  <tr>
    <td>${info.state}</td>
    <td>${info.district}</td>
    <td>${info.phone1 ? info.phone1 : "Invailid"}</td>
  </tr>
  `;
};
