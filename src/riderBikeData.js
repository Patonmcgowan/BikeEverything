//
// riderBikeData.js
// 
// Pre populates class variables for various bikes and riders
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";


// Put these in the global scope for now so we can access them from the console
var mike;
var baumCoretto;
var scottSpeedster;
var trekDomane;
var trekDomaneRaw;

var don;
var donTrekDomane;

var rideData;
var bikeData = new BikeClass();
var riderData = new CardiacWithLactateClass();

//---------------------------------------------------------------------------
// Runs once the page has loaded
//

window.addEventListener('load', async (event) => {   // Needs to be async while we have the dodgy fudge at the end to bypass site plant etc selection

  mike = new CardiacWithLactateClass({
    name: "Mike",
    height: 1.87, weight: 94, age:59, gender: "male",
    resting_heart_rate: 60, maximum_heart_rate: 171,
    ejection_fraction: 0.45,
    powerFromHeartRate: function(heart_rate) {
      if (heart_rate < this.lactate_threshold_heart_rate) {
        // We are in the linear region - this is a linear fit from Power.vs.HeartRate.xlsx 'T2Plot'
        return heart_rate * 3.2771 - 211.03;
      } else {
        return heart_rate * 1.5097 + 56.329;
      };
      // return 247.07 * Math.log(heart_rate) - 1005; // Found by Excel curve fit
    },
    heartRateFromPower: function(power) {
      if (power <= this.powerFromHeartRate(this.lactate_threshold_heart_rate)) {
        // We are in the linear region - this is a linear fit from Power.vs.HeartRate.xlsx 'T2Plot'
        return (power + 211.03) / 3.2771;
      } else {
        return (power - 56.329) / 1.5097;
      };
      // return Math.exp((power + 1005)/247.07); // Found by Excel curve fit
    },
    }); 

//  mike.calculateHeartRateRecoveryRate([[100, 90, 80, 70], [1, 2, 3, 4]]);
//  console.log(mike.powerFromHeartRate(150));
//  console.log(mike.heartRateFromPower(150));

  baumCoretto = new BikeClass({
      name: "Baum Coretto", bike_type: bikeType.road, bike_weight: 9.2, 
      rider_height:mike.height, rider_weight: mike.weight, riding_position: riderPos.drops,
      air_temp: 15, height_above_sea_level: 0, slope: 0, wind_speed: 0, cadence: 90, surface_type: 'rough', wet_calc: false,
      front_chainring: [50, 34], rear_cassette: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28],
      wheel_circumference: 2139,
      front_wheel_type: '36_spoke', rear_wheel_type: '36_spoke', 
      front_rim_width: 22, rear_rim_width: 22,
      front_tyre_type: 'conti_28mm', rear_tyre_type: 'conti_28mm'
    });

  // baumCoretto.speedCalc({power:180, slope:10})*3.6 returns 5.725976933696945
  // baumCoretto.powerCalc({speed:25/3.6, slope:5})   returns {P: 474.41797968277086, userPower: 474.41797968277086}

  scottSpeedster = new BikeClass({
      name: "Scott Speedster S10", bike_type: bikeType.road, bike_weight: 10.0, 
      rider_height:mike.height, rider_weight: mike.weight, riding_position:  baumCoretto.riding_position,
      air_temp:  baumCoretto.air_temp, height_above_sea_level:  baumCoretto.height_above_sea_level, slope: baumCoretto.slope, wind_speed: baumCoretto.wind_speed, cadence: baumCoretto.cadence, surface_type: baumCoretto.surface_type, wet_calc: baumCoretto.wet_calc,
      front_chainring: [50, 34], rear_cassette: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28],
      wheel_circumference: baumCoretto.wheel_circumference,
      front_wheel_type: '36_spoke', rear_wheel_type: '36_spoke', 
      front_rim_width: 19.5, rear_rim_width: 19.5,
      front_tyre_type: 'conti_23mm', rear_tyre_type: 'conti_23mm' 
    });

  // Make the Trek the same as the Baum in terms of common conditions
  trekDomane = new BikeClass({
      name: "Trek Domane+", bike_type: bikeType.road_ebike, bike_weight: 15.4, 
      rider_height: mike.height, rider_weight: mike.weight, riding_position: baumCoretto.riding_position,
      air_temp: baumCoretto.air_temp, height_above_sea_level: baumCoretto.height_above_sea_level, slope: baumCoretto.slope, wind_speed: baumCoretto.wind_speed, cadence: baumCoretto.cadence, surface_type: baumCoretto.surface_type, wet_calc: baumCoretto.wet_calc,
      front_chainring: [50, 34], rear_cassette: [11, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34],
      wheel_circumference: 2122,
      front_wheel_type: '36_spoke', rear_wheel_type: '36_spoke',  
      front_rim_width: 26.5, rear_rim_width: 26.5,
      front_tyre_type: 'conti_28mm', rear_tyre_type: 'conti_28mm',
      ebike: { on: true,
        // Assist levels
        0: { assist_level: 0, speed_limit: 30/3.6, power: 30 },  // Because the bike puts out 30 W anyway to 30 km/hr
        1: { assist_level: 1, speed_limit: 25/3.6, power: 250 * 0.12 },
        2: { assist_level: 2, speed_limit: 25/3.6, power: 250 * 0.50 },
        3: { assist_level: 3, speed_limit: 25/3.6, power: 250 * 1.00 }
      }
    });


  // Make the Trek the same as the Baum in terms of common conditions
  trekDomaneRaw = new BikeClass({
      name: "Trek Domane+ (no e-function)", bike_type: bikeType.road, bike_weight: 15.4, 
      rider_height: mike.height, rider_weight: mike.weight, riding_position: baumCoretto.riding_position,
      air_temp: baumCoretto.air_temp, height_above_sea_level: baumCoretto.height_above_sea_level, slope: baumCoretto.slope, wind_speed: baumCoretto.wind_speed, cadence: baumCoretto.cadence, surface_type: baumCoretto.surface_type, wet_calc: baumCoretto.wet_calc,
      front_chainring: [50, 34], rear_cassette: [11, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34],
      wheel_circumference: 2122,
      front_wheel_type: '36_spoke', rear_wheel_type: '36_spoke',
      front_rim_width: 26.5, rear_rim_width: 26.5,
      front_tyre_type: 'conti_28mm', rear_tyre_type: 'conti_28mm',
      ebike: { on: false }
    });

  don = new CardiacWithLactateClass({
    name: 'Don',
    height: 1.8, weight: 72, age:85, gender: "male",
    resting_heart_rate: 52, aerobic_threshold_heart_rate: 97, lactate_threshold_heart_rate: 119, maximum_heart_rate: 149,
    }); 

  // Make the Trek the same as the Baum in terms of common conditions
  donTrekDomane = new BikeClass({
      name: "Trek Domane+", bike_type: bikeType.road_ebike, bike_weight: 14.3, 
      rider_height: don.height, rider_weight: don.weight, riding_position: riderPos.bars,
      air_temp: 15, height_above_sea_level: 0, slope: 0, wind_speed: 0, cadence: 90, surface_type: 'rough', wet_calc: false,
      front_chainring: [50, 34], rear_cassette: [11, 13, 15, 17, 19, 21, 23, 25, 27, 30, 34],
      wheel_circumference: baumCoretto.wheel_circumference,
      front_wheel_type: '36_spoke', rear_wheel_type: '36_spoke',  
      front_rim_width: 26.5, rear_rim_width: 26.5,
      front_tyre_type: 'conti_32mm', rear_tyre_type: 'conti_32mm',
      ebike: { on: true,
        // Assist levels
        0: { assist_level: 0, speed_limit: 30/3.6, power: 30 },  // Because the bike puts out 30 W anyway to 30 km/hr
        1: { assist_level: 1, speed_limit: 25/3.6, power: 250 * 0.12 },
        2: { assist_level: 2, speed_limit: 25/3.6, power: 250 * 0.30 },
        3: { assist_level: 3, speed_limit: 25/3.6, power: 250 * 0.75 }
      }
    });


    // trek.speedCalc({power:180, slope:10})*3.6 returns 12.815140246183608 km/hr
    // trek.powerCalc({speed:25/3.6, slope:5})   returns {P: 500.1419214245635, userPower: 250.14192142456352}

  console.log(`
    Mike:
      Baum Coretto:
        Speed at aerobic threshold (${mike.AerT} bpm) on the flat = ${
          parseInt((baumCoretto.speedCalc({power: mike.powerFromHeartRate(mike.AerT), slope: 0}) * 3.6) + 0.5)
        } km/h, power = ${
          parseInt(baumCoretto.P + 0.5) // Round off
        } W
        Speed at lactate threshold (${mike.LTHR} bpm) on the flat = ${
          parseInt((baumCoretto.speedCalc({power: mike.powerFromHeartRate(mike.LTHR), slope: 0}) * 3.6) + 0.5)
        } km/h, power = ${
          parseInt(baumCoretto.P + 0.5) // Round off
        } W
        Heart rate at 35 km/h mid pack = ${parseInt(mike.heartRateFromPower(baumCoretto.powerCalc({speed:35/3.6, slope:0, drafting_position: draftPos['mid_pack']}).userP))} bpm
      Trek Domane+
        Speed at aerobic threshold (${mike.AerT} bpm) on the flat = ${
          parseInt((trekDomane.speedCalc({power: mike.powerFromHeartRate(mike.AerT), slope: 0}) * 3.6) + 0.5)
        } km/h, power = ${
          parseInt(trekDomane.P + 0.5) // Round off
        } W
        Speed at lactate threshold (${mike.LTHR} bpm) on the flat = ${
          parseInt((trekDomane.speedCalc({power: mike.powerFromHeartRate(mike.LTHR), slope: 0}) * 3.6) + 0.5)
        } km/h, power = ${
          parseInt(trekDomane.P + 0.5) // Round off
        } W
        Heart rate at 35 km/h mid pack = ${parseInt(mike.heartRateFromPower(trekDomane.powerCalc({speed:35/3.6, slope:0, drafting_position: draftPos['mid_pack']}).userP))} bpm
  `);


  // Calculate power - some of this data was from the Baum, some was from the Scott when the Baum was in repair, then 
  // add the data to the HR info array, to get average power vs heart rate data
  let hrData = {};
  stravaArr.forEach(stravaEntry => {
    if (stravaEntry.slope >= 0) { // Filter out downhill stuff because power reading may be dodgy
      let pwr = baumCoretto.powerCalc({ speed: Number(stravaEntry.speed), slope: Number(stravaEntry.slope) * 100 });
      if (typeof hrData[stravaEntry.heart_rate] == 'undefined') {
        hrData[stravaEntry.heart_rate] = {};
        hrData[stravaEntry.heart_rate].samples = 1;
        hrData[stravaEntry.heart_rate].power = pwr.userP;
        hrData[stravaEntry.heart_rate].heart_rate = Number(stravaEntry.heart_rate);
      } else {
        hrData[stravaEntry.heart_rate].samples++;
        hrData[stravaEntry.heart_rate].power += pwr.userP;
      };
    };
  });

  // Update the samples to get the average power
  let csv = `heart_rate, power, samples\n`;
  for (let ind in hrData) {
    hrData[ind].power = hrData[ind].power/hrData[ind].samples;
    csv = csv + `${hrData[ind].heart_rate}, ${hrData[ind].power}, ${hrData[ind].samples}\n`;
  };
  // console.log(csv);

// heart rate at 35 km/h = ${baumCoretto.powerCalc({speed:35/3.6, slope:0}).userP} bpm, power = ${}
// mike.heartRateFromPower(baumCoretto.powerCalc({speed:35/3.6, slope:0}).userP)


}); // window.addEventListener('load', async (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




