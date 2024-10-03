/*
  metabolism.js

  Functions used in calculations involved with calories and Metabolic Equivalent
  Tasks
  ------------------------------------------------------------------------------

  Revision History
  ================
  01 Oct 2007 MDS Original
  22 Mar 2020 MDS Minor formatting changes
  03 Sep 2024 MDS
    Renamed from calories.js to metabolism.js.  
    Changed Base Metabolism Rate (BMR) formula from Harris Benedict to 
    Miffen St Joer (more accurate)
    Added Body Mass Index (BMI) calculkator
    Added body fat estimator
    Added Resting Metabolism Rate (RMR) estimator
    Added Metabolic Equivaent Tasks (METS) as additional functions of the
    RiderWithCardiacClass - this file MUST be included after RiderWithCardiacClass.js 
    (the class definition) definition for these additional functions to work.

  ------------------------------------------------------------------------------
 */

//
//-----------------------------------------------------------------------------
// Get Metabolic Equivalent of Task hours for cycling activities
//
// References
//   https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task
//   https://pacompendium.com/adult-compendium/

/*
https://www.healthline.com/health/what-are-mets#met-goals
https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults

Recommendations for Adults
500 MET minutes per week ...
Get at least 150 minutes per week of moderate-intensity aerobic activity or 75 minutes per week of vigorous aerobic activity, or a combination of both, preferably spread throughout the week.
Add moderate to high-intensity muscle-strengthening activity (such as resistance or weights) on at least 2 days per week.
Spend less time sitting. Even light-intensity activity can offset some of the risks of being sedentary.
Gain even more benefits by being active at least 300 minutes (5 hours) per week.
Increase amount and intensity gradually over time.

  Light < 3.0 METs
  Moderate 3.0-6.0 METs
  Vigourous > 6.0 METs

Unit of METs = ml of O2/kg/min.  1 MET ~ 3.5 ml of O2/kg/min.  In older atheletes (60 years and older), 1 MET ~ 2.7 ml of O2/kg/min to adjust for lower resting energy expenditure.

The formula to use is: METs x 3.5 x (your body weight in kilograms) / 200 = calories burned per minute, or for 60 and over, use METs x 2.7 x (your body weight in kilograms) / 200 = calories burned per minute.

*/

(function() {

  //
  // Define all of the MET entries - these are from the MET Compendium - Bicycling for the Bicycling major heading
  // (I added the discipline property to make selection of correct METs value easier)
  const metData = {
    under60: [
      // Major Heading, Activity Code, MET Value(3.5 ml/kg/min), Activity Description, Power (W) Speed (m/s)
      { code:   '01008', met:  8.5, discipline: 'BMX', description: 'BMX', Pmin: null, Pmax: null, Vmin: null, Vmax: null },

      { code:   '01013', met:  5.8, discipline: 'MTB', description: 'On dirt or farm road moderate pace', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01003', met: 14.0, discipline: 'MTB', description: 'Mountain uphill vigorous', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01004', met: 16.0, discipline: 'MTB', description: 'Mountain competitive racing', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01009', met:  8.5, discipline: 'MTB', description: 'Mountain general', Pmin: null, Pmax: null, Vmin: null, Vmax: null },

      { code:   '01011', met:  6.8, discipline: 'Road', description: 'To/from work self selected pace', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01018', met:  3.5, discipline: 'Road', description: 'Leisure', Pmin: null, Pmax: null, Vmin: 2.458, Vmax: 2.458 },                                           // 8.849 km/h, 5.5 mph
      { code:   '01019', met:  5.8, discipline: 'Road', description: 'Leisure', Pmin: null, Pmax: null, Vmin: 4.202, Vmax: 4.202 },                                           // 15.127 km/h. 9.4 mph
      { code:   '01010', met:  4.0, discipline: 'Road', description: 'Leisure to work or for pleasure (Taylor Code 115)', Pmin: null, Pmax: null, Vmin: 0.000, Vmax: 4.470 }, // 0 to 16.121 km/h, 0 to 10 mph
      { code:   '01020', met:  6.8, discipline: 'Road', description: 'Leisure slow light effort',                         Pmin: null, Pmax: null, Vmin: 4.470, Vmax: 5.363 },      // 16.121
      { code:   '01030', met:  8.0, discipline: 'Road', description: 'Leisure moderate effort',                           Pmin: null, Pmax: null, Vmin: 5.364, Vmax: 6.214 },
      { code:   '01040', met: 10.0, discipline: 'Road', description: 'Racing or leisure fast vigorous effort',            Pmin: null, Pmax: null, Vmin: 6.215, Vmax: 7.151 },
      { code:   '01065', met:  8.5, discipline: 'Road', description: 'Seated hands on brake hoods or bar drops 80 rpm', Pmin: null, Pmax: null, Vmin: 5.364, Vmax: 5.364 },
      { code:   '01066', met:  9.0, discipline: 'Road', description: 'Standing hands on brake hoods 60 rpm', Pmin: null, Pmax: null, Vmin: 5.364, Vmax: 5.364 },

      { code:   '01080', met:  6.8, discipline: 'E-bike', description: 'E-bike (electrically assisted) without electronic support', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01084', met:  6.0, discipline: 'E-bike', description: 'E-bike (electrically assisted) with light electronic support', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01088', met:  4.0, discipline: 'E-bike', description: 'E-bike (electrically assisted) with high electronic support', Pmin: null, Pmax: null, Vmin: null, Vmax: null },

      { code:   '01200', met:  6.8, discipline: 'Virtual', description: 'Stationary general', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01210', met:  3.5, discipline: 'Virtual', description: 'Stationary very light to light effort', Pmin: 25, Pmax: 30, Vmin: null, Vmax: null },
      { code:   '01214', met:  4.0, discipline: 'Virtual', description: 'Stationary light effort', Pmin: 50, Pmax: 50, Vmin: null, Vmax: null },
      { code:   '01216', met:  5.0, discipline: 'Virtual', description: 'Stationary light to moderate effort', Pmin: 60, Pmax: 60, Vmin: null, Vmax: null },
      { code:   '01218', met:  5.8, discipline: 'Virtual', description: 'Stationary', Pmin: 70, Pmax: 80, Vmin: null, Vmax: null },
      { code:   '01220', met:  6.0, discipline: 'Virtual', description: 'Stationary moderate to vigorous', Pmin: 90, Pmax: 100, Vmin: null, Vmax: null },
      { code:   '01224', met:  6.8, discipline: 'Virtual', description: 'Stationary', Pmin: 101, Pmax: 125, Vmin: null, Vmax: null },
      { code:   '01228', met:  8.0, discipline: 'Virtual', description: 'Stationary', Pmin: 126, Pmax: 150, Vmin: null, Vmax: null },
      { code:   '01232', met: 10.3, discipline: 'Virtual', description: 'Stationary', Pmin: 151, Pmax: 199, Vmin: null, Vmax: null },
      { code:   '01236', met: 10.8, discipline: 'Virtual', description: 'Stationary vigorous', Pmin: 200, Pmax: 229, Vmin: null, Vmax: null },
      { code:   '01240', met: 12.5, discipline: 'Virtual', description: 'Stationary very vigorous', Pmin: 230, Pmax: 270, Vmin: null, Vmax: null },
      { code:   '01244', met: 13.8, discipline: 'Virtual', description: 'Stationary very vigorous', Pmin: 271, Pmax: 305, Vmin: null, Vmax: null },
      { code:   '01248', met: 16.3, discipline: 'Virtual', description: 'Stationary very vigorous', Pmin: 325, Pmax: Infinity, Vmin: null, Vmax: null },

      { code:   '01040', met: 10.0, discipline: 'Racing', description: 'Racing or leisure fast vigorous effort', Pmin: null, Pmax: null, Vmin: 6.215, Vmax: 7.151 },
      { code:   '01050', met: 12.0, discipline: 'Racing', description: 'Racing not drafting', Pmin: null, Pmax: null, Vmin: 7.152, Vmax: 8.493 },
      { code:   '01050', met: 12.0, discipline: 'Racing', description: 'Racing drafting very fast racing general', Pmin: null, Pmax: null, Vmin: 8.494, Vmax: Infinity },
      { code:   '01060', met: 16.8, discipline: 'Racing', description: 'Racing not drafting', Pmin: null, Pmax: null, Vmin: 8.940, Vmax: Infinity },

      { code:   '01270', met:  9.0, discipline: 'Spin', description: 'Stationary RPM/Spin bike class', Pmin: null, Pmax: null, Vmin: null, Vmax: null },

      { code:   '01014', met:  7.0, discipline: 'Default', description: 'General', Pmin: null, Pmax: null, Vmin: null, Vmax: null },

      { code:   '01015', met:  4.3, discipline: 'Unused', description: 'Self-selected easy pace', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01016', met:  7.0, discipline: 'Unused', description: 'Self-selected moderate pace', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01017', met:  9.0, discipline: 'Unused', description: 'Self-selected vigorous pace', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01252', met:  5.5, discipline: 'Unused', description: 'Concentric', Pmin: 100, Pmax: 100, Vmin: null, Vmax: null },
      { code:   '01254', met: 11.0, discipline: 'Unused', description: 'Concentric', Pmin: 200, Pmax: 200, Vmin: null, Vmax: null },
      { code:   '01262', met:  2.3, discipline: 'Unused', description: 'Eccentric', Pmin: 100, Pmax: 149, Vmin: null, Vmax: null },
      { code:   '01264', met:  4.0, discipline: 'Unused', description: 'Eccentric', Pmin: 200, Pmax: 200, Vmin: null, Vmax: null },
      { code:   '01290', met:  8.8, discipline: 'Unused', description: 'Interactive virtual cycling indoor cycle ergometer', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code:   '01305', met:  8.8, discipline: 'Unused', description: 'High intensity interval training', Pmin: null, Pmax: null, Vmin: null, Vmax: null }
    ],

    over60: [
      // Major Heading, Older Adult Code, MET60(2.7 ml/kg/min), Activity Description, Power/speed
      { code: '0101060', met:  5.3, discipline: 'Virtual', description: 'Stationary general moderate effort', Pmin: null, Pmax: null, Vmin: null, Vmax: null },
      { code: '0101160', met:  4.3, discipline: 'Virtual', description: 'Stationary moderate effort', Pmin: 30, Pmax: 50, Vmin: null, Vmax: null },
      { code: '0101760', met:  4.5, discipline: 'Virtual', description: 'Stationary moderate-to-vigorous effort', Pmin: 51, Pmax: 89, Vmin: null, Vmax: null },
      { code: '0101260', met:  6.3, discipline: 'Virtual', description: 'Stationary vigorous effort', Pmin: 90, Pmax: 100, Vmin: null, Vmax: null },
      { code: '0101360', met:  7.8, discipline: 'Virtual', description: 'Stationary vigorous effort', Pmin: 101, Pmax: 160, Vmin: null, Vmax: null },
    ]
  };


  //
  //---------------------------------------------------------------------------
  // Infer the discipline from the tyre type on the bike
  const _inferDiscipline = (tyreType) => {



    return 'Default';
  }

  //
  //---------------------------------------------------------------------------
  // Get METS based upon cycling speed or power, infering the discipline from 
  // the tyre type, Assumes no wind and a flat riding surface
  // Passed data is a bikeClass object - we look for the valid data in there to
  // figure out which METs category and entry we use
  const _getCyclingMETs = (bike) => {

  }


  //
  //---------------------------------------------------------------------------
  // Calculate the daily Basal Metabolic Rate in kcal/day for a person as governed by the 1919 
  // Harris Benedict equations as follows:
  //   In calories:-
  //     Women: BMR = 655.0955 + ( 9.5634 x weight in kilos ) + ( 1.8496 x height in cm ) - ( 4.6756 x age in years )
  //     Men: BMR = 66.4730 + ( 13.7516 x weight in kilos ) + ( 5.0033 x height in cm ) - ( 6.7550 x age in years )
  //
  // In 1990, the Miffen St Joer equation was developed which was found to be more accurate:
  //     BMR = ( 10.0 x weight in kg ) + ( 6.25 x height in cm ) - ( 5.0 x age in years ) + s
  //   where  s = +5 for males and -161 for females
  //
  // Reference: https://en.wikipedia.org/wiki/Basal_metabolic_rate
  //
  // Inputs:
  //   male - true if male, else female
  //   weight  - mass in kg
  //   height   - height in m
  //   age  - age in years
  // Returns:
  //   basal metabolic rate in kcal / day.  To convert to calories / day, multiply by 0.2390057356
  //
  const _getBMR = (male, weight, height, age) => {
    // Harris Benedict equations
    //   let bmr = male ? (66.4730 + ( 13.7516 * weight ) + ( 5.0033 * height ) - ( 6.7550 * age )) : (655.0955 + ( 9.5634 * weight ) + ( 1.8496 * height ) - ( 4.6756 * age ));

    // Miffen St Joer equation:
    let s = male ? 5 : -161;
    let bmr = ( 10.0 * weight ) + ( 6.25 * height * 100) - ( 5.0 * age ) + s;

    bmr = bmr / 0.2390057356;
    return bmr;
  } // _getBMR()
  //
  //---------------------------------------------------------------------------
  // Calculate the body mass index
  //
  // Inputs:
  //   weight  - mass in kg
  //   height   - height in m
  // Returns:
  //   body mass index in kg/m2
  //
  const _getBMI = (weight, height) => {
    return weight / (height * height);
  } // _getBMI()
  //
  //---------------------------------------------------------------------------
  // Returns text based upon the passed BMI
  //
  const _getBMIText = (BMI) => {
    if (BMI < 15) 
      return `Starvation, (BMI < 15)`;
    else if (BMI < 18.5 )
      return `Underweight, (BMI \u2265 15, < 18.5)`;
    else if (BMI < 25)
      return `Normal, (BMI \u2265 18.5, < 25)`;
    else if (BMI < 30)
      return `Overweight, (BMI \u2265 25, < 30)`;
    else  if (BMI < 40)
      return `Obese, (BMI \u2265 30, < 40)`;

    return `Morbidly obese, (BMI \u2265 40)`;
  } // _getBMIText()
  //
  //---------------------------------------------------------------------------
  // Estimate the body fat % using a modified version of the Durenberg formula
  //
  // Reference https://en.wikipedia.org/wiki/Body_fat_percentage
  //
  // Inputs:
  //   male - true if male, else female
  //   weight  - mass in kg
  //   height   - height in m
  //   age  - age in years
  // Returns: 
  //   A floating point number between 0 and 1 representative of the body fat %
  //
  const _getBodyFat = (male, weight, height, age) => {

    let bmi = _getBMI(weight, height);
    let s = male ? 1 : 0;
    return ( (1.39 * bmi) + (0.16 * age) - (10.34 * s) - 9 ) / 100;
  } // _getBodyFat()
  //
  //---------------------------------------------------------------------------
  // Calculate the Resting Daily Energy Expenditure using the Katch–McArdle
  // formula
  //
  // Reference https://en.wikipedia.org/wiki/Basal_metabolic_rate
  //
  // The Resting Daily Energy Expenditure in kJ / day can be calculated from lean
  // body mass using the Katch–McArdle formula.  This value is marginally higher 
  // than the BMR because it takes into account things like thermic value of digestion, 
  // going to the bathroom etc.
  //
  // Inputs:
  //   male - true if male, else female
  //   weight  - mass in kg
  //   height   - height in m
  //   age  - age in years
  // Returns:
  //   Resting daily energy expenditure in kJ / day.  To convert to calories / day, multiply by 0.2390057356
  //
  //  
  const _getRDEE = (male, weight, height, age) => {
    let bodyFat = _getBodyFat(male, weight, height, age);
    return (370 + 21.6 * weight * (1 - bodyFat)) / 0.2390057356;
  } // _getRDEE()
  //
  //---------------------------------------------------------------------------
  // Calculate the Resting Metabolic Rate.  Assume that it is the same as the RDEE
  //
  const _getRMR = (male, weight, height, age) => {
    return _getRDEE(male, weight, height, age);
  } // _getRMR()

//
//-----------------------------------------------------------------------------
// Add methods to the existing RiderWithCardiacClass class if it exists.  If 
// it doesn't, create standalone functions in the global scope by attaching the 
// functionality to the global window object
//
if (window.RiderWithCardiacClass) {
  RiderWithCardiacClass.prototype.getBMR = function() {
    return _getBMR((this.gender == 'male'), this.weight, this.height, this.age);
  };

  RiderWithCardiacClass.prototype.getBMI = function() {
    return _getBMI(this.weight, this.height);
  };

  RiderWithCardiacClass.prototype.getBMIText = function(BMI) {
    return _getBMIText(BMI);
  };

  RiderWithCardiacClass.prototype.getBodyFat = function() {
    return _getBodyFat((this.gender == 'male'), this.weight, this.height, this.age);
  };

  RiderWithCardiacClass.prototype.getRDEE = function() {
    return _getRDEE((this.gender == 'male'), this.weight, this.height, this.age);
  };

  RiderWithCardiacClass.prototype.getRMR = function() {
    return _getRMR((this.gender == 'male'), this.weight, this.height, this.age);
  };

} else {

  // Map all of the functions to the global scope by attaching to the window object
  window.getBMR     = (male, weight, height, age) => { return _getBMR(male, weight, height, age)     };
  window.getBMI     = (weight, height)            => { return _getBMI(weight, height)                };
  window.getBMIText = (BMI)                       => { return _getBMIText(BMI)                       };
  window.getBodyFat = (male, weight, height, age) => { return _getBodyFat(male, weight, height, age) };
  window.getRDEE    = (male, weight, height, age) => { return _getRDEE(male, weight, height, age)    };
  window.getRMR     = (male, weight, height, age) => { return _getRMR(male, weight, height, age);    }



} // if (window.RiderWithCardiacClass) {

})(); // End of IIFE 



//
//-----------------------------------------------------------------------------
//                               End of file
//-----------------------------------------------------------------------------
//
