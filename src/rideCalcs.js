//
// rideCalcs.js
// 
// Provides the main logic to tie the bits of the app together
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

const POWER = 0;
const SPEED = 1;
var lastPVEntry = POWER;

let vEps = 0.5; // Minimum value of velocity to use to calculate power
let pEps = 5.0; // Minimum value of power to use to calculate velocity
let metEff = 0.24;  // Metabolism efficiency
//
//-----------------------------------------------------------------------------
// Returns the number of stages defined in the HTML
//
const getMaxStage = () => {
  let maxStage = 0;

  while (typeof el(`ISTAGE${maxStage + 1}`)?.id !== 'undefined')
    maxStage++;

  return maxStage;
} // getMaxStage = () => {
//
//-----------------------------------------------------------------------------
// Returns the number of visible stages defined in the HTML
//
const getMaxVisibleStage = () => {
  let currMaxStage = 0;

  while ((typeof el(`ISTAGE${currMaxStage + 1}`)?.id !== 'undefined') && (el(`ISTAGE${currMaxStage + 1}`).style.display == ''))
    currMaxStage++;

  return currMaxStage;
} // getCurrMaxStage = () => {
//
//-----------------------------------------------------------------------------
//
//
const doInstantaneousCalcs = () => {

  let bike = new BikeClass();
  populateBikeObject(bike);

  let rider = new CardiacWithLactateClass();
  populateRiderObject(rider);


  // console.log(`ebike parameters are : `, bike.ebike);

  let P, v;
  if (lastPVEntry == POWER) {         // lastPVEntry == POWER:  Calculate speed
    P = readInput("P");
    v = bike.speedCalc({
      P: P
    });
    writeOutput("vBike", 0, v * 3.6); 
    if (readInput('P') == 0) writeOutput('P', 0, bike.userP ); // Write it if it was blank when the user clicked the Calculate button
  } else { 
    let pTemp = bike.powerCalc({      // lastPVEntry == SPEED: Calculate power
      v: readInput("vBike") / 3.6
    });
    P = pTemp.userP;
    writeOutput("P", 0, P); 
    if (readInput('vBike') == 0) writeOutput("vBike", 0, 0);    // Write it if it was blank when the user clicked the Calculate button
  }

  //---------------------------------------------------------------------------
  // Determine optimal gearing based upon output speed, wheel circumference 
  // and desired cadence
  //
  // Input object contains the following input parameters:
  //   frontChainring - an array of chainring sprocket teeth counts, ordered 
  //     from lowest to highest
  //   rearCassette - an array of cassette sprocket teeth counts, ordered from 
  //     lowest to highest
  //   wheelDiameter or wheelCircumference in mm
  //   speed - output speed in km/hr
  //   cadence - target cadence in RPM
  //
  // A default set of the above is used if they are not provided by the user.
  // Speed is a compulsory parameter
  //
  // Returns an object with the following properties:
  //   validResult - true if a result was found, otherwise errText contains the error
  //   errText - the cause of the error.  zero length string upon success
  //   frontRing - tooth count of selected front ring
  //   rearCog - tooth count of selected rear cog
  //   cadence - actual cadence to meet the speed with the selected gearing
  const getOptimalGearing = (obj) => {
    const r = {};
    r.errText = '';
    r.frontGear = -1;
    r.rearGear = -1;
    r.cadence = -1;
    r.validResult = false;

    if (typeof obj !== 'object') {
      r.errText = 'Invalid input parameters to getOptimalGearing().  Expected an object.';
      return r;
    };

    if (typeof obj.speed !== 'number' || isNaN(obj.speed) || !isFinite(obj.speed)) {
      r.errText = 'Invalid speed passed to getOptimalGearing().  Expected a number.';
      return r;
    };
    obj.speed /= 3.6;

    if (typeof obj.frontChainring == 'undefined' || !Array.isArray(obj.frontChainring) || obj.frontChainring.some(num => !Number.isInteger(num) || num < 1)) {
      obj.frontChainring = [11, 12, 13, 14, 15, 17, 19, 21, 24, 28];
    };

    if (typeof obj.rearCassette == 'undefined' || !Array.isArray(obj.rearCassette) || obj.rearCassette.some(num => !Number.isInteger(num) || num < 1)) {
      obj.rearCassette = [34, 50];
    };

    if (typeof obj.wheelCircumference == 'undefined' || !Number.isInteger(obj.wheelCircumference) || obj.wheelCircumference < 1) {
      if (typeof obj.wheelDiameter != 'undefined' && Number.isInteger(obj.wheelDiameter) && obj.wheelDiameter > 0) {
        obj.wheelCircumference = obj.wheelDiameter * Math.PI / 1000;
      } else {
        // obj.wheelCircumference = 2.070;
        obj.wheelCircumference = 2.139; // Measured from the Baum Coretto
      }
    } else {
      obj.wheelCircumference /= 1000;
    }

    if (typeof obj.cadence == 'undefined' || !Number.isInteger(obj.cadence) || obj.cadence < 1) {
      obj.cadence = 90;
    }

    // For each gearing combination, determine the required cadence to get the 
    // speed and select the one closest to the desired cadence
    let bestCadence = -1000;
    let bestFrontGear = -1000;
    let bestRearGear = -1000;
    for (let i = 0; i < obj.frontChainring.length; i++) {
      for (let j = 0; j < obj.rearCassette.length; j++) {
        let testCadence = 60 * obj.speed * obj.rearCassette[j] / (obj.frontChainring[i] * obj.wheelCircumference);
        if (Math.abs(testCadence - obj.cadence) < Math.abs(bestCadence - obj.cadence)) {
          bestCadence = testCadence;
          bestFrontGear = obj.frontChainring[i];
          bestRearGear = obj.rearCassette[j];
        };
      };
    };

    r.validResult = true;
    r.frontGear = bestFrontGear;
    r.rearGear = bestRearGear;
    r.cadence = parseInt(0.5 + (60 * obj.speed * r.rearGear  / (r.frontGear * obj.wheelCircumference)));
    return r;
  }; // const getOptimalGearing = (obj) => {

  const r = getOptimalGearing({
    frontChainring: bike.front_chainring, 
    rearCassette: bike.rear_cassette, 
    speed: bike.v * 3.6, 
    cadence: bike.cadence });
  el("gearSelection").innerText = (r.validResult == true) ? `Optimal gear is ${r.frontGear}/${r.rearGear} with a target cadence of ${r.cadence}/min  ` : `${r.errText}.  `;

  let heartRate = rider.heartRateFromPower(bike.userP);
  el("hrResult").innerHTML = `${rider.heartRateText(heartRate)}`;

  // Now that we have used the bike model, display all of the detailed stuff
  write3DP("Cd", bike.Cd);
  write3DP("Crr", bike.Crr);
  write3DP("bFA", bike.bFA);
  write3DP("rFA", bike.rFA);
  write3DP("FA", bike.FA);
  write3DP("CdA", bike.CdA);
  writeOutput("Proll", 0, -bike.Proll);
  writeOutput("Pwind", 0, -bike.Pwind);
  writeOutput("Pgrav", 0, -bike.Pgrav);
  writeOutput("Pfrict", 0, -bike.Pfrict);  
  writeOutput("kJouthr", 0, Math.abs(P) * 3.6);
  writeOutput("calouthr", 0, Math.abs(P) * 3.6 * 0.2390057356);
  const kJRideHr = Math.abs(P) * 3.6/metEff;
  const BMRHr = rider.getBMR(el("gender0").checked, bike.rider_weight, bike.rider_height, bike.rider_age) / 24;
  writeOutput("kJhr", 0, kJRideHr);
  writeOutput("Calhr", 0, kJRideHr * 0.2390057356);
  writeOutput("BMRkJhr", 0, BMRHr);
  writeOutput("BMRCalhr", 0, BMRHr * 0.2390057356);
  writeOutput("TotkJhr", 0, BMRHr + kJRideHr);
  writeOutput("TotCalhr", 0, (BMRHr + kJRideHr) * 0.2390057356);
  writeOutput("fathr", 0, (BMRHr + kJRideHr) * 1000/37000);

  const BMI = bike.rider_weight /(bike.rider_height * bike.rider_height);
  el("BMI").value = Math.round(BMI);
  el("BMIText").value = rider.getBMIText(BMI);

}; // doInstantCalcs = () => {
//
//-----------------------------------------------------------------------------
//
//
const doRideCalcs = () => {
  let kmTot = 0;
  let mTot = 0;
  let rVMax = 0;
  let rideSecs = 0;
  let kJTot = 0;

  let currMaxStage = 1;
  while ((typeof el(`ISTAGE${currMaxStage + 1}`)?.id !== 'undefined') && (el(`ISTAGE${currMaxStage + 1}`).style.display == ''))
    currMaxStage++;

  // Get variables from form for all legs.  Initialise air temp etc to defaults to calculate max power output
  let bike = new BikeClass({ });
  populateBikeObject(bike);
  let pMax = readInput("PMAX");                                      // Power limit
  let vMax = readInput("VMAX")/3.6;                                  // Bike velocity limit
  let age = readInput("rAge");
  let BMRHr = BMR_calc(gender0.checked, readInput("mRider"), readInput("hRider")*0.01, readInput("rAge"))/24;

  // Check that either velocity or power limit have been defined
  if (pMax < pEps && vMax < vEps) {
    alert('Calculation is not possible.\nPlease enter a value for either the maximum sustainable speed or maximum sustainable power.'); 
    return; 
  };

  if (pMax < pEps)
    pMax = 99999;

  // Determine the maximum power output based upon the entered velocity
  let pTemp = 0;
  if (vMax > vEps) { 
    pTemp = bike.powerCalc({
      v: vMax
    });
    if (Math.abs(pTemp.P) < pMax) pMax = Math.abs(pTemp.P);
  }

  for (let i = 1; i <= currMaxStage; i++) {
    // Get variables for this leg
    let grade = readInput('S'+i+'Grade');                   // Grade of slope
    let cadence = readInput('S'+i+'Cadence');               // Cadence
    if ((cadence<0) || (cadence>130))
    {
      cadence=90;
      el('S'+i+'Cadence').value=90;
    }
    let dist =  readInput('S'+i+'Dist')*1000;               // Leg distance
    kmTot = kmTot + dist/1000;
    mTot = (grade>0)?(mTot + grade * dist/100):mTot;

    // Calculate the velocity at the power limit.  All of bike and rider 'unchanging' parameters have been initialised when the bike was created above
    let v = bike.speedCalc({
      P: pMax,
      air_temp: readInput('S'+i+'T'),       height_above_sea_level: readInput('S'+i+'H'),   slope: grade, cadence: cadence,
      wind_speed: readInput('S'+i+'W')/3.6, riding_position: el('S'+i+'Pos').selectedIndex, drafting_position: el('S'+i+'Draft').selectedIndex
    });

    if (v * 3.6 > rVMax)
      rVMax = v * 3.6;
    writeOutput('S'+i+'Power', 0, pMax); 
    writeOutput('S'+i+'Speed', 1, (v*3.6)); 
    writeOutput('S'+i+'kJ', 0, (pMax * dist / (1000 * v))); 
    writeOutput('S'+i+'cal', 0, (pMax * dist * 0.239006 / (1000 * v))); 
    el('S'+i+'Time').value = secToHHMM(dist/v); 
    outputColor('S'+i+'Time');
    rideSecs = rideSecs + dist / v;
    kJTot = kJTot + pMax * dist / (1000 * v);
  }        
  writeOutput('KMTOT', 1, kmTot); 
  writeOutput('MTOT', 1, mTot); 
  writeOutput('RVMAX', 1, rVMax); 
  el('RIDETIME').value = secToHHMM(rideSecs); 
  outputColor('RIDETIME');
  writeOutput('RVAVG', 1, (kmTot * 3600 / rideSecs)); 
  writeOutput('RkJouthr', 0, (kJTot * 3600 / rideSecs)); 
  writeOutput('Rcalouthr', 0, (kJTot * 3600 * 0.2390057356 / rideSecs)); 
  let rideHrs = rideSecs/3600;
  let ridekJHr = (kJTot / (rideHrs * metEff));
  writeOutput('RkJhr', 0, ridekJHr); 
  writeOutput('RCalhr', 0, ridekJHr * 0.2390057356); 
  writeOutput('RBMRkJhr', 0, BMRHr);
  writeOutput('RBMRCalhr', 0, BMRHr*0.2390057356);
  writeOutput('Rfathr', 0, ((ridekJHr + BMRHr) * 1000 / 37000)); 
  writeOutput('RkJ', 0, (ridekJHr + BMRHr) * rideHrs); 
  writeOutput('RCal', 0, (ridekJHr + BMRHr) * rideHrs * 0.2390057356); 
  writeOutput('Rfat', 0, ((ridekJHr + BMRHr) * rideHrs * 1000 /  37000)); 
  
  writeOutput('gels', 0, Math.round((rideHrs / 0.75) + 1.5)); 
  writeOutput('bottles', 0, Math.round(rideHrs + 0.5)); 
  
  return;
}
//
//-----------------------------------------------------------------------------
//
//
const showBlock = (idstr) => {
  let d1 = el(idstr+"1");
  let d2 = el(idstr+"2");

  try {let d3 = el(idstr+"3");} catch(err){}
  try {let d4 = el(idstr+"4");} catch(err){}
  try {let d5 = el(idstr+"5");} catch(err){}
  d1.style.display = 'none';
  d2.style.display = '';
  try {d3.style.display = '';} catch(err){}
  try {d4.style.display = '';} catch(err){}
  try {d5.style.display = '';} catch(err){}
}
//
//-----------------------------------------------------------------------------
//
//
const hideBlock = (idstr) => {
  let d1 = el(idstr+"1");
  let d2 = el(idstr+"2");

  try {let d3 = el(idstr+"3");} catch(err){}
  try {let d4 = el(idstr+"4");} catch(err){}
  try {let d5 = el(idstr+"5");} catch(err){}  	
  d1.style.display = '';
  d2.style.display = 'none';
  try {d3.style.display = 'none';} catch(err){}
  try {d4.style.display = 'none';} catch(err){}
  try {d5.style.display = 'none';} catch(err){}
}
//
//-----------------------------------------------------------------------------
//
//
const addLeg = (n) => {
  let stages = getMaxStage();
  let s = getMaxVisibleStage() + n;

  if (s > stages) 
      s = stages;
  showStage(s);
  return;
}
//
//-----------------------------------------------------------------------------
//
//
const deleteLeg = (n) => {
  let s = getMaxVisibleStage() - n;

  if (s < 1) 
      s = 1;
  showStage(s);
  return;
}
//
//-----------------------------------------------------------------------------
//
//
const showStage = (stg) => {
  let si, so;
  let stages = getMaxStage();

  if (stg > stages) stg = stages;
  for (let i = 1; i <= stages; i++) {
    si = el("ISTAGE"+i);
    so = el("OSTAGE"+i);
    if (i <= stg) { 
      si.style.display = ''; so.style.display = ''; 
    } else { // i > stg
      si.style.display = 'none'; so.style.display = 'none'; 
    }
  }
  return;
}
//
//-----------------------------------------------------------------------------
//
//
function readInput(ref, noColor) {
  let stop;
  let el = document.getElementById(ref);
  if (noColor==null) outputColor(el, '#ffffff');
  let k = el.value.indexOf(',');
  let wt = (el.value==null || el.value.length<=0)? '0' : ((k!=-1)? (el.value.substring(0, k)+'.'+el.value.substring(k+1)) : el.value);

  while (wt.charAt(0)==' ') wt = wt.substring(1);
  let z0 = wt.charAt(0);
  if (z0=='+' || z0=='-') wt = wt.substring(1);
  if (stop==0) {
    for (j = 0; j<wt.length; j++) if (j!=wt.indexOf('.')) if (('0123456789').indexOf(wt.charAt(j))==-1) {
      stop = 1;
      if (readInput.arguments[1] == null) {
        alert("Not a valid number");
        el.focus();
        el.select();
      }
      return false;
    }
  }
  let y = ((z0=='-')? -1 : 1) * parseFloat(wt);
  return y;
}
//
//-----------------------------------------------------------------------------
//
//
function writeOutput(ref, dz, F, color) {
  let y = '' + Math.round(F * mathPow(10, dz));
  let el = document.getElementById(ref);
  if (!isNaN(y)) {
    while (y.substring(y.indexOf('-')+1).length<(dz+1)) y = y.substring(0, y.indexOf('-')+1) + '0' + y.substring(y.indexOf('-')+1);
    y = y.substring(0, y.length-dz) + ((dz>0)? ('.' +y.substring(y.length-dz)) : '');
  }
 
  el.value = y;
  if (color!=null) outputColor(el, color);
  return 0;
}
//
//-----------------------------------------------------------------------------
//
//
function write3DP(ref, F, color) {
  let y = '' + (Math.round(F * 1000) / 1000);
  let el = document.getElementById(ref);
  el.value = y;
  if (color!=null) outputColor(el, color);
  return 0;
}
//
//-----------------------------------------------------------------------------
//
//
function outputColor(el, color) {
  if (el.style) el.style.background = color;
  return 0;
}
//
//-----------------------------------------------------------------------------
// Substitute for the Math.pow() method absent in Konqueror 2.2.1.
//
function mathPow(bs, ep) {
  let y = null;
  if (!isNaN(bs)) {
    if (ep==0) y = 1;
    else if (ep==1) y = bs;
    else if (bs<0) {
      if ((ep%1>.999999 || ep%1<.000001) && (ep%2<1.999999 && ep%2>.000001)) y = -Math.exp(ep*Math.log(-bs));
      else if (ep%2==0) y = Math.exp(ep*Math.log(-bs));
    }
    else y = Math.exp(ep*Math.log(bs));
  }
  if (y==null) y = 'NaN';
  return y;
}

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------

