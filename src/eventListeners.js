//
// eventListeners.js
// 
// Provides the event listeenrs for the main app that don't belong anywhere else.
//
// Sections of code that are created dynamically are loaded in their respective
// window.load event listeners after the HTML elements have been created
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', async (event) => {   // Needs to be async while we have the dodgy fudge at the end to bypass site plant etc selection

  // Event listeners for top menu

  //
  //-------------------------------------------------------------------------
  // Perform an instantaneous calculation
  //
  el('btnInstantCalc').addEventListener('click', (event) => {
    el("instantaneousInput").style.display = '';
    el("instantaneousOutput").style.display = '';
    hide("rideInputBlock");
    hide("SR4");    hide("SR5");
    hide("SR7");    hide("SR8");
    hide("SR10");
    hide("SR11");
    hide("rideOutputBlock");
    hide("detailedOutput");
    return;
  }); // el('btnInstantCalc').addEventListener('click', (event) => {
  //
  //-------------------------------------------------------------------------
  // Perform calculations for a ride
  el('btnRideCalc').addEventListener('click', (event) => {
    hide("instantaneousInput");
    hide("instantaneousOutput");
    el("rideInputBlock").style.display = '';
    el("SR4").style.display = '';    el("SR5").style.display = '';
    el("SR7").style.display = '';    el("SR8").style.display = '';
    el("SR10").style.display = '';
    el("SR11").style.display = '';
    el("rideOutputBlock").style.display = '';
    hide("detailedOutput");
    showStage("5");
    doRideCalcs();
    return;
  }); // el('btnRideCalc').addEventListener('click', (event) => {

  el('btnInstantCalc').click();

  //-------------------------------------------------------------------------
  // Analyse a Garmin or Strava .GPX or .TCX file
  //
  el('btnImportGPXTCX').addEventListener('click', (event) => {
    // Trigger the file upload
    el('gpxtcxInput').value = ''; // Allows reload of the same file in succession
    el('gpxtcxInput').click();    // Trigger the hidden file selection button
  }); // el('btnImportGPXTCX').addEventListener('click', (event) => {
  //
  //-------------------------------------------------------------------------
  //
  el('gpxtcxInput').addEventListener('change', (event) => {
    //-----------------------------------------------------------------------
    //
    handleFileSelect(event, (result) => { // handleFileSelect takes 2 parameters: the event object and a callback function, which we are defining as an anonymous function
      const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const dayOfWeek  = days[result[0].startTime.getDay()] || '   ';
      const dayOfMonth = result[0].startTime.getDate() || ' ';
      const month = months[result[0].startTime.getMonth()] || '   ';
      const year = !isNaN(result[0].startTime.getFullYear()) ? result[0].startTime.getFullYear().toString().slice(-2) : '00'; // Get last 2 digits of the year
      let hours = result[0].startTime.getHours() || 0;
      let minutes = result[0].startTime.getMinutes() || 0;
      // Ensure minutes are two digits (e.g., 05 instead of 5)
      minutes = minutes < 10 ? '0' + minutes : minutes;

      const rideHrs = parseInt(result[0].totalTime/3600) || 0;
      const rideMin = parseInt(((result[0].totalTime - rideHrs*3600) + 30) / 60) || 0; // Display rounded to the nearest minute

      let fileBit = 
        `<span class='heading'>FILE</span> ${event.target.files[0].name} ${dayOfWeek} ${dayOfMonth} ${month} ${year} ${hours}:${minutes} `;
      let speedBit = 
        `<span class='heading'>MAX SPEED</span> ${parseInt(result[0].maxSpeed * 3.6 * 10)/10}km/h ` +
        `<span class='heading'>AVG SPEED</span> ${parseInt(result[0].avgSpeed * 10 * 3.6) / 10}km/h `;
      let timeBit = `<span class='heading'>TIME</span> ${rideHrs}h ${rideMin}m `;
      let hrBit = `<span class='heading'>MAX HR</span> ${result[0].maxHR} ` +
        `<span class='heading'>AVG HR</span> ${result[0].avgHR} `;

      // Adjust output for reduced information (eg. a file imported from another user that has no speed or velocity data)
      if (isNaN(result[0].startTime)) {
        fileBit = `<span class='heading'>FILE</span> ${event.target.files[0].name} `;
        speedBit = ``;
        timeBit = ``;
        hrBit = ``;
      }

      el("parseResult").innerHTML = 
        `${fileBit}` +
        `${speedBit}` +
        `<span class='heading'>DISTANCE</span> ${parseInt(result[0].totalDistance*10/1000) / 10}km ` +
        `${timeBit}` +
        `${hrBit}` +
        `<span class='heading'>ELEVATION</span> ${parseInt(result[0].totalAscent)}m ` +
        `<span class='heading'>AVG ASCENT</span> ${parseInt(result[0].avgClimb*100)/100}%`;
      rideData = result;
      prepareForAnalysis();
    });
  }); // el('gpxtcxInput').addEventListener('change', (event) => {
}); // window.addEventListener('load', async (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




