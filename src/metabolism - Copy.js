/*
  metabolism.js

  Functions used in calculations involved with calories
  ------------------------------------------------------------------------------

  Revision History
  ================
  01 Oct 2007 MDS Original
  22 Mar 2020 MDS Minor formatting changes
  03 Sep 2024 MDS
    Renamed form calories.js to metabolism.js.  
    Changed Base Metabolism Rate (BMR) formula from Harris Benedict to 
    Miffen St Joer (more accurate)
    Added Body Mass Index (BMI) calculkator
    Added body fat estimator
    Added Resting Metabolism Rate (RMR) estimator
    Added Metabolic Equivaent Tasks (METS) as additional functions of the
    RiderWithCardiacClass - this file MUST be included after the 
    RiderWithCardiacClass definition for these additional functions to work.

  ------------------------------------------------------------------------------
 */

//
//-----------------------------------------------------------------------------
//
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
//   wgt  - mass in kg
//   ht   - height in m
//   age  - age in years
// Returns:
//   basal metabolic rate in kcal / day.  To convert to calories / day, multiply by 0.2390057356
//
const getBMR = (male, wgt, ht, age) => {

  // Harris Benedict equations
  //   let bmr = male ? (66.4730 + ( 13.7516 * wgt ) + ( 5.0033 * ht ) - ( 6.7550 * age )) : (655.0955 + ( 9.5634 * wgt ) + ( 1.8496 * ht ) - ( 4.6756 * age ));

  // Miffen St Joer equation:
  let s = male ? 5 : -161;
  let bmr = ( 10.0 * wgt ) + ( 6.25 * ht * 100) - ( 5.0 * age ) + s;
  bmr = bmr / 0.2390057356;
  return bmr;
} // getBMR()
//
//-----------------------------------------------------------------------------
// Calculate the body mass index
//
// Inputs:
//   wgt  - mass in kg
//   ht   - height in m
// Returns:
//   body mass index in kg/m2
//
const getBMI = (wgt, ht) => {

  return wgt / (ht * ht);
} // getBMI()
//
//-----------------------------------------------------------------------------
// returns text based upon the passed BMI
const getBMIText = (BMI) => {
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
} // getBMIText()

//
//-----------------------------------------------------------------------------
// Estimate the body fat % using a modified version of the Durenberg formula
//
// Reference https://en.wikipedia.org/wiki/Body_fat_percentage
//
// Inputs:
//   male - true if male, else female
//   wgt  - mass in kg
//   ht   - height in m
//   age  - age in years
// Returns: 
//   A floating point number between 0 and 1 representative of the body fat %
//
const getBodyFat = (male, wgt, ht, age) => {

  let bmi = getBMI(wgt, ht);
  let s = male ? 1 : 0;
  return ( (1.39 * bmi) + (0.16 * age) - (10.34 * s) - 9 ) / 100;
} // getBodyFat()
//
//-----------------------------------------------------------------------------
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
//   wgt  - mass in kg
//   ht   - height in m
//   age  - age in years
// Returns:
//   Resting daily energy expenditure in kJ / day.  To convert to calories / day, multiply by 0.2390057356
//
//  
const getRDEE = (male, wgt, ht, age) => {
  let bodyFat = getBodyFat(male, wgt, ht, age);
  return (370 + 21.6 * wgt * (1 - bodyFat)) / 0.2390057356;
} // getRDEE()
//
//-----------------------------------------------------------------------------
// Calculate the Resting Metabolic Rate.  Assume that it is the same as the RDEE
//
const getRMR = (male, wgt, ht, age) => {
  return getRDEE(male, wgt, ht, age);
} // getRMR()


//
//-----------------------------------------------------------------------------
// Get Metabolic Equivalent of Task hours for cycling activities
//
// References
//   https://en.wikipedia.org/wiki/Metabolic_equivalent_of_task
//   https://pacompendium.com/adult-compendium/



/*

MET Compendium - Bicycling




*/

//
//-----------------------------------------------------------------------------
// Add methods to the existing RiderWithCardiacClass class if it exists.  If 
// it doesn't, create standalone functions in the global scope
//
if (window.RiderWithCardiacClass) {
  RiderWithCardiacClass.prototype.exampleMethod = function() {
    console.log(`Showing how a method may be added to an existing class: weight is ${this.weight} kg`);
  };




} else {
  console.error('RiderWithCardiacClass is not defined!');
} // if (window.RiderWithCardiacClass) {





//
//-----------------------------------------------------------------------------
//                               End of file
//-----------------------------------------------------------------------------
//
