//
// makeRideAnalysisHTML.js
// 
// Writes the html and contains the code for the analysis of a .GPX or.TCX file
//
//-----------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//-----------------------------------------------------------------------------
"use strict";



// Private scoped IIFE function...
(() => {

  let myVariable = 3;

  //---------------------------------------------------------------------------
  // This is a private function
  const myFunction = () => {
    // Do stuff here - this has access to the variables insiode the IIFE 
    myVariable += 1;
    console.log(`${myConst}${myVariable} this time`)
  };

  //---------------------------------------------------------------------------
  // This is a public function - which accesses the private functions/variables/constants
  myObject.myFunction = () => {
    myFunction();
  };

  return;
})(); // Close private scoped IIFE function...

//
//---------------------------------------------------------------------------
// Enables the relevant analysis buttons and sets up any variables that are required
//
const prepareForAnalysis = () => {


    if ((typeof riderData !== 'undefined') && (typeof bikeData !== 'undefined') && (!isNaN(result[0].startTime))) {
//        el('btnAnalyse').disabled = false;
    } else {
//        el('btnAnalyse').disabled = true;
    };
    if (!bikeData?.ebike?.on || bikeData.ebike.on == false) {
//        el('btnWhatIf').disabled = false;
      if (el('riderSelection').value == 'mike') {
//          el('btnValidate').disabled = false;
      }
    }


}; // prepareForAnalysis = () => {

window.addEventListener('load', (event) => { 

  let HTMLOut = `
        <div class="flex-row" id="analysisMenu">                                                          
            <div class="flex-item"><button type='button' class="myLink" id='btnModelLactate'>Model</button> lactate buildup</div>
            <div class="flex-item"><button type='button' class="myLink" id='btnValidateHRPower'>Validate</button> heart rate vs power equation</div>
            <div class="flex-item"><button type='button' class="myLink" id='btnValidatePower'>Validate</button> power calculations (virtual ride only)</div>
            <div class="flex-item">Add heart rate training zones</div>
        </div>
        Virtual Ride<input type=checkbox id="virtualRide"> (not needed - just look for power in RideData object ?)
        e-assisted Ride<input type=checkbox id="eAssistRide"> (not needed - use the bike profile to figure it out)

        <div class="chart-container" id="modelFrame" style="display:none">
          <canvas id="modelChartCanvas"></canvas>
        </div>
  `;
  el('rideAnalysisBlock').innerHTML = HTMLOut;
  addToolTip('btnModelLactate', 'Use this to model lactate production and consumption for the selected rider on the selected bike on the imported ride');
  //
  //---------------------------------------------------------------------------
  // Checks lactate buildup for the ride in rideData.  rideData and riderData 
  // should contain valid data
  el('btnModelLactate').addEventListener('click', (event) => {
alert("Hi there");
  }); // el('btnModelLactate').addEventListener('click', (event) => {
  //
  //---------------------------------------------------------------------------
  // Validates the heart rate vs power relationship in riderData against heart
  // rate and power in the rideData object.  rideData and riderData should 
  // contain valid data
  addToolTip('btnValidateHRPower', 'This option compares the actual measured power and heart rate from the imported ride to the theoretical equation for the rider');
  el('btnValidateHRPower').addEventListener('click', (event) => {
alert("Hi there");

  }); // el('btnValidateHRPower').addEventListener('click', (event) => {
  //
  //---------------------------------------------------------------------------
  // Validates the power calculations in the bike model against the data in the 
  // rideData object.  bikeData, rideData and riderData should all contain 
  // valid data
  addToolTip('btnValidatePower', 'Using the bike model, this option compares the actual measured power against those modelled for the given bike and rider');
  el('btnValidatePower').addEventListener('click', (event) => {

  }); // el('btnValidatePower').addEventListener('click', (event) => {

  //-------------------------------------------------------------------------
  // Analyse the ride data - when this button is enabled (and then clicked), 
  // rideData, bikeData and riderData should all contain relevant data
  /*
  el('btnAnalyse').addEventListener('click', (event) => {

    for (let i = 0; i < rideData.length; i++) {// For each ride

      // Do stuff for one ride

      for (let j = 0; j < rideData[i].points.length; j++) {
        let pt = rideData[i].points[j];

          Calories burned can be calculated directly from the power output. The general formula is:
            Calories Burned = Power (Watts) × Time (hours) × 3.6
          Where:
            Power is in Watts
            Time is in hours
            3.6 is the conversion factor from Joules to calories (1 Watt = 1 Joule/second, and 1 calorie ≈ 4.184 Joules, so 1 Watt for 1 hour ≈ 3600 seconds × 1 / 4.184 ≈ 3.6 calories)


          Alternatively, if you don't have power data, you can estimate calories based on speed using MET values, though this method is less precise.
            Determine MET value: Use a MET table to find the MET value corresponding to your cycling speed.

            Calories Burned = MET × Weight (kg) × Time (hours) × 1.05
          Where:
            MET is the Metabolic Equivalent of Task
            Weight is in kilograms
            Time is in hours
            1.05 is a factor to account for individual variations

          One MET corresponds to an energy expenditure of 1 kcal/kg/hour. One MET can also be expressed as oxygen uptake of 3.5 ml/kg/min.

          Also refer https://metscalculator.com/#google_vignette
                     https://pacompendium.com/adult-compendium/       // Extended list of MET activities
          https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task :

            1 MET = Resting metabolic rate (Metabolic Equivalent Of Task)
                  = 1 kcal/kg.h = 4.184 kJ/kg.h = 1.162 W/kG

            3500 cal => 450g body fat

    

        // Calculate METs

        // Calculate BMI

        // Put heart rate in a zone
    

        // Figure out power from heart rate


        // Figure out power from bike, speed, slope etc


        // Validate power from heart rate ...


        // Figure out lactate buildup




      };

    };

  }); // el('btnAnalyse').addEventListener('click', (event) => {

  */






}); // window.addEventListener('load', (event) => { 


//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------


