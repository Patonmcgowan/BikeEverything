//
// BikeClass.js
// 
// Provides the Bike Class - bike info and models
//
// *** Everything in the bike model is stored in SI units ***
//
// As per the original author, this code is bound under the LGPL licence.  In summary the user has the right to:
//   Freedom to Use and Modify: The LGPL grants users the freedom to use, modify, and distribute the licensed software. 
//     Users can use the library in their own applications without releasing their own source code under the same license.
//   Dynamic and Static Linking: The LGPL allows the library to be dynamically or statically linked to other software. 
//     However, if a statically linked library is modified and distributed, the source code of the modifications 
//     must be made available under the LGPL.
//   Compatibility with Proprietary Software: The software can be used in proprietary software.
//   Relicensing: If a developer wants to convert this library to be GPL-licensed, they can do so.
//   Modification Requirements: If a developer modifies this library, they must make the source code of the 
//     modifications available under the same LGPL license. This ensures that improvements and bug fixes can be shared with the community.
//   Notice Requirements: When distributing this library, the distributor must include a copy of the 
//     LGPL license and make it clear that the library is licensed under the LGPL.
//
// Full text of the LGPL is available here : https://www.gnu.org/licenses/lgpl-3.0.en.html

//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//   01 Oct 2017 MDS Code based upon work done by Walter Zorn ( http://www.kreuzotter.de )
//   22 Mar 2020 MDS Modified when migrating to client based under HTML5
//    1 Jul 2024 MDS Moved into BikeClass class
//
//------------------------------------------------------------------------------
"use strict";

// Put these in the global scope for now so we can access them from the console

/* The following are the arrays from the original website http://kreuzotter.de/english/espeed.htm as at 240702

    *** Bike Types ***
var asBike        = [ 'roadster', 'mtb', 'tandem', 'racetops', 'racedrops', 'tria', 'superman', 'lwbuss', 'swbuss', 'swbass', 'ko4', 'ko4tailbox', 'whitehawk', 'questclosed', 'handtrike' ];
var afCd          = [ .95,        .79,   .35,      .82,        .60,         .53,    .47,        .85,      .67,      .60,      .50,   .41,          0,           0,              .62  ];
var afSin         = [ .95,        .85,   .7,       .89,        .67,         .64,    .55,        .64,      .51,      .44,      .37,   .37,          0,           0,              .55  ];
var afCdBike      = [ 2.0,        1.5,   1.7,      1.5,        1.5,         1.25,   .90,        1.7,      1.6,      1.25 ,    1.2,   1.15,         .036,        .090,          1.5   ];
//var AFrame      = [ .07,        .06,   .07,      .055,       .055,        .055,   .05,        .045,     .042,     .036,     .027,  .03,          1,           1,              .05  ];
var afAFrame      = [ .06,        .052,  .06,      .048,       .048,        .048,   .044,       .039,     .036,     .031,     .023,  .026,         1,           1,              .046 ];
var afCATireV     = [ 1.1,        1.1,   1.1,      1.1,        1.1,         1.1,    .9,         .66,      .8,       .85,      .77,   .77,          .1,          .26,            .9   ];
var afCATireH     = [ .9,         .9,    .9,       .9,         .9,          .7,     .7,         .9,       .80,      .84,      .49,   .3,           .13,         .16,           2     ];
var afLoadV       = [ .33,        .45,   .5,       .40,        .45,         .47,    .48,        .32,      .55,      .55,      .63,   .63,          .55,         .72,            .5   ];
var afCCrV        = [ 1.0,        1.0,   1.0,      1.0,        1.0,         1.0,    1.0,        1.25,     1.25,     1.25,     1.25,  1.25,         1.25,        1.5,           1.5   ];
var afCm          = [ 1.03,       1.025, 1.05,     1.025,      1.025,       1.025,  1.025,      1.04,     1.04,     1.04,     1.05,  1.05,         1.06,        1.09,          1.03  ];
var afMBikeDef    = [ 18,         12,    17.8,     9.5,        9.5,         9.5,    8,          18,       15.5,     11.5,     11.8,  13.5,         18,          32,           18     ];
var aiTireFDef    = [ 3,          5,     1,        0,          0,           0,      0,          1,        2,        0,        0,     0,            0,           0,             0     ];
var aiTireRDef    = [ 3,          5,     1,        0,          0,           0,      0,          3,        3,        0,        0,     0,            0,           0,             0     ];

    key:
      roadster    = roadster
      mtb         = unsuspedned mountain bike
      tandem      = tandem with racing bars
      racetops    = racing bike, hands on top of the handlebar
      racedrops   = racing bike, hands on the bottom of the handlebar
      tria        = triatholon bicycle
      superman    = superman position (racing bicycle - 1h record)
      lwbuss      = long wheel base, under seat steering, commuting equipped
      swbuss      = short wheel base, under seat steering, commuting equipped
      swbass      = short wheel base, above seat steering, racing equipped
      ko4         = lowracer
      ko4tailbox  = lowracer with streamlining tailbox
      whitehawk   = streamlined lowracer White Hawk (1h world record)
      questclosed = streamlined Quest trike
      handtrike   = hand trike



*/

//
//-----------------------------------------------------------------------------
// Types of bike and their characteristics.  The index of the bike type is 
// passed to the functions in this file.
//
const bikeType       = {    road: 0, road_ebike: 1, tandem: 2, gravel: 3, ebike: 4, mtb_cross_country: 5, mtb_trail: 6, mtb_enduro: 7, mtb_downhill: 8 };
const bikeText       = [ 'Roadbike', 'Road e-bike',  'Tandem',  'Gravel', 'E-bike',  'Cross Country MTB',  'Trail MTB',  'Enduro MTB',  'Downhill MTB' ];

// Assume that road e-bike frame area and Cd are the same as a road bike, and that a standard e-bike is the same as a mountain bike
//                             road,    road_ebike,    tandem,    gravel,    ebike,    mtb_cross_country,    mtb_trail,    mtb_enduro,    mtb_downhill 

// Frontal area of frame only (excluding tyres)
let frameArea        = [      0.048,         0.048,      0.06,     0.048,    0.052,                0.052,        0.052,         0.052,           0.052 ];
// Default weights for bikes
let defaultBikeMass  = [        6.8,          15.4,      17.8,       9.0,     19.0,                 10.9,         11.8,          12.7,            15.9 ];
// Air resistance coefficient
let CdBike           = [        1.2,           1.2,       1.4,       1.2,     1.23,                 1.23,         1.23,          1.23,            1.23 ];

// Overall weight distribution on bike when the rider is riding with hands on the bars.  Road bike and road e-bike 
// as measured on the Baum Coretto and Trek Domane+ 23 August 2024.  Assume that remainder of weight is taken by rear wheel (!)
let bikeFrontWeight  = [      0.455,         0.455,       0.5,     0.470,     0.45,                0.490,         0.48,         0.485,           0.487 ];

const disciplinePAdjustment = [ // Discipline specific adjustments to tyre pressure 
                               1.05,          1.05,      1.05,      0.82,     1.05,                0.770,         0.87,         0.873,           0.916 ];


//
//-----------------------------------------------------------------------------
// Types of wheel and their characteristics.  The index of the wheel type is passed to the functions in this file.
//
const wheel            = { '32_spoke':0, '36_spoke':1, 'aero_spoke':2, 'carbon_spoke':3,   'disk':4, '26"_mtb':5, '27.5"_mtb':6, '29"_mtb':7 };
const wheelText        = [   '32 Spoke',   '36 Spoke',   'Aero Spoke',   'Carbon Spoke',     'Disk',   '26" MTB',   '27.5" MTB',   '29" MTB' ];
// Default rim width used when calculating optimum tyre pressures
const wheelDefaultRim  = [           22,           22,             22,               22,         22,          30,            30,          30 ];

// Original figures in wheelVIncrease were % time savings on a no breeze time trial.  Figures are sqrt'd
// since webpage selections allow for individual wheels, and these figures are for the pair.
// Figure for 32 spoke is a guess average.  Figure for carbon spoked wheel is a guess average.
// % time savings data for both wheels swapped out over a 40km time trail are as follows:
//                                0.00%,    ???,      1.56%,      ???,          2.79%
// (courtesy 'Serious Cycling')
//
// MTB wheels have been set by me as an initial guesstimate.  Road wheels are 700c.  *** NOTE: THIS IS FOR THE WHEEL ONLY, NOT THE TYRE ***
//                             32 spoke,     36 spoke,     aero spoke,     carbon spoke, disk wheel,     26" MTB,     27.5" MTB,     29" MTB
const wheelVIncrease   = [       1.0038,         1.00,        1.00776,           1.0085,    1.01385,        0.92,          0.92,        0.92 ]; // Velocity increase
// Wheel diameter adjustments to tyre pressure - 700c is slightly decreased for slightly larger diameter, slightly increased for 26" MTB, slightly decreased for 29" MTB
const wheelDiaPAdjust  = [         0.97,         0.97,           0.97,             0.97,       0.97,        1.05,          1.00,        0.95 ];


//
//-----------------------------------------------------------------------------
// Types of tyre and their characteristics.  The index of the tyre type is passed to the functions in this file.
//
const tyre             = { 'race':0, 'training':1, 'conti_23mm':2, 'conti_25mm':3, 'conti_28mm':4, 'conti_32mm':5, 
                           '2"_mtb_slick':6, '2"_mtb_knobbly':7, '2.5"_mtb_slick':8, '2.5"_mtb_knobbly':9, '3.8"_mtb_slick':10, '3.8"_mtb_knobbly':11 }
const tyreText = [
  '23mm high pressure race tyre',     // 700c road tyre
  '23mm heavy durable training tyre', // 700c road tyre
  '23mm Continental Gatorskin',       // 700c road tyre
  '25mm Continental Gatorskin',       // 700c road tyre
  '28mm Continental Gatorskin',       // 700c road tyre
  '32mm Continental Gatorskin',       // 700c road tyre
  '2" MTB slick',                     // 26" to 29" wheel MTB tyre
  '2" MTB knobbly',                   // 26" to 29" wheel MTB tyre
  '2.5" MTB slick',                   // 26" to 29" wheel MTB tyre
  '2.5" MTB knobbly',                 // 26" to 29" wheel MTB tyre
  '3.8" MTB slick',                   // 26" to 29" wheel MTB tyre
  '3.8" MTB knobbly'                  // 26" to 29" wheel MTB tyre
];

//                        race, training, conti_23mm, conti_25mm, conti_28mm, conti_32mm, 2" mtb slick, 2" mtb knobbly, 2.5" mtb slick, 2.5" mtb knobbly, 3.8" mtb slick, 3.8" mtb knobbly
const tyreWidth     = [     23,       23,         23,         25,         28,         32,         50.8,           50.8,           63.5,             63.5,           96.5,             96.5 ];
// Tyre frontal area (width x diameter)
const tyreArea      = [ 0.0155,   0.0155,     0.0161,     0.0175,     0.0196,     0.0224,       0.0333,         0.0333,         0.0416,           0.0416,         0.0633,           0.0633 ];
// Tyre rolling resistance - from https://www.bicyclerollingresistance.com
//   We test all tires on a rolling resistance test machine with a 77 cm drum and a DC electric motor. The drum is covered with diamond plate to simulate an average road surface.
//   All rolling resistance data we publish is for a single tyre with a load of 42.5 kg / 94 lbs and a speed of 28.8 km/h / 18 mph. This is the data that comes straight from our test machine.
//   The total rolling resistance of an average rider with a total bike + rider weight of 85 kg / 188 lbs that averages 28.8 km/h / 18 mph will be double the rolling resistance you can find on our website.
//   If you're heavier than that or average higher speeds, the total rolling resistance will increase roughly linearly with the increase in weight or speed.
const Crr           = [ 0.0043,   0.0067,     0.0052,     0.0050,     0.0048,     0.0046,       0.0074,         0.0100,         0.0074,            0.0100,         0.0074,          0.0100 ];

// Constants to multiply tyre width by to get proportion of overall tyre frontal area impact.  The front tyre 
// has more impact than the rear tyre on the bike overall, so the front tyre constants are marginally higher
// MTB tyres are a guess

// Front tyre drag coefficient
const CdTyreFront   = [  1.955,    1.955,      1.955,      1.955,      1.955,      1.955,        1.955,          1.955,          1.955,             1.955,           1.955,          1.955 ];
// Rear tyre drag coefficient
const CdTyreRear    = [    1.6,      1.6,        1.6,        1.6,        1.6,        1.6,          1.6,            1.6,            1.6,               1.6,             1.6,            1.6 ];


//
//-----------------------------------------------------------------------------
// Types of aero parts and their characteristics
//
// Original figures in aeroVIncrease were % time savings on a no breeze time trial.  The cube root of these were used
// here since P = fn(v^3) to obtain aero percent reduction in power requirement for a given velocity.

//                      aero frame, aero bars, aero cranks, aero helmet, skinsuit
const aeroPos       = { frame: 0,   bars: 1,   cranks: 2,   helmet: 3,   skinsuit: 4 };
const aeroVIncrease = [ 1.0167,     1.0239,    1.0024,      1.010,       1.010 ]; // Velocity increase

//
//-----------------------------------------------------------------------------
// Effects of different terrain types
//
const surface       = { 'smooth':0,    'rough':1,     'gravel':2,     'bush':3     };
const surfaceText   = [ 'Smooth',      'Rough',       'Gravel',       'Bush'       ];
// Recommended reductions in tyre pressure on different surfaces
const surfacePressureAdjustments 
                    = { 'smooth': 1.0, 'rough': 0.92, 'gravel': 0.88, 'bush': 0.85 };
// Increase in rolling resistance on different terrain
//
// The following are from ChatGPT:
//   Smooth Asphalt: This is the baseline condition where most tires are tested. CRR is typically the lowest here, with values ranging from 0.0025 to 0.0045 depending on the tire.
//   Rough Asphalt:  CRR can increase by 10-20% compared to smooth asphalt. Tires that perform well on smooth surfaces may see a noticeable increase in rolling resistance.
//   Gravel:         CRR can increase significantly on gravel, often by 30-50%. The exact increase depends on gravel size and depth. Tires with a knobbier tread are better suited 
//                   but still face increased resistance compared to smooth asphalt.
//   Off-Road:       The increase in CRR can be substantial, ranging from 50-100% or more. Knobby tires are essential for off-road riding, but the rolling resistance is much higher due to
//                   the soft surface and uneven terrain.
//   Sand:           Sand presents one of the highest increases in CRR, often exceeding 100-200% compared to asphalt. Specialized fat bike tires are designed to handle these conditions but
//                   at the cost of much higher rolling resistance.
//
// CrrMultipliers for each tyre for each surface type are defined further down this file


//
//-----------------------------------------------------------------------------
// Various rider positions and the characteristics associated with them.  
//
const riderPos       = {            bars: 0,             drops: 1,        aerotuck: 2,         standing: 3 };
const riderPosText   = ['Hands on the bars', 'Hands in the drops',         'Aerotuck', 'Out of the saddle' ];
// Note that CdRider for Tandem 0.33 and mtb 0.47 are hard coded.  1.2 for out of the saddle is a guess.
let CdRider          = [               0.78,                 0.57,              0.505,                 1.2 ];
// Front/rear weight distributions for roadbikes.  For tandems, the weight distribution is always 50% front, 50% rear,
// for mtbs the weight distribution is always  45% front, 55% rear. Assume that remainder of weight is taken by rear wheel (!)
const wgtFront       = [               0.37,                 0.45,               0.47,                0.45 ];  // Front wheel weight percentage

// Sin array corresponds to 62 deg, 42 deg, 39 deg, 90 deg.  90 deg is a guess.  These correspond to the angles 
// of the rider in the various riding positions, and are used to determine lateral height based upon rider height
let sin              = [               0.89,                 0.67,                0.64,               0.98 ];


//
//-----------------------------------------------------------------------------
// Various drafting positions and their respective power saving multipliers
// Access using eg. draftPos['two_of_two']
const draftPos       = {       front: 0,      two_of_two: 1, three_of_three: 2,        mid_pack: 3,  behind_truck: 4 };
const draftPosText   = [ 'At the front',  '2nd of 2 riders', '3rd of 3 riders', 'Middle of a pack', 'Behind a truck' ];
const draftPower     = [           1.00,               0.74,              0.74,               0.73,             0.38 ];

class BikeClass {
  // static eff = 0.24;      // Efficiency of human body at generating power
  static #kFrict = 0.0053; // Lumped constant for friction losses
  static #g = 9.80665;     // Acceleration due to gravity

  #rho;
  #Froll;
  #Fgrav;
  #Ffrict;
  #Fwind;
  #Proll;
  #Pwind;
  #Pclimb;
  #Pfrict;
  #CdBike;
  #CdRider;
  CdA;                    // Always recalculated by software when used
  Cd;                     // Always recalculated by software when used
  Crr;                    // Always recalculated by software when used
  #bFA;
  #rFA;
  #FA;
  //
  //-----------------------------------------------------------------------------
  // Main constructor
  // obj is an object taking named parameters, for example:
  //   baum = new BikeClass({
  //     bike_name: "Baum Coretto", bike_type: bikeType.road, bike_weight: 9.5, 
  //     rider_height:rider.height, rider_weight: rider.weight, riding_position: riderPos.drops,
  //     air_temp: 15, height_above_sea_level: 0, slope:0, wind_speed:1, cadence:90, 
  //     front_chainring: [50, 34], rear_cassette: [11, 12, 13, 14, 15, 17, 19, 21, 24, 28],
  //     front_wheel_type: wheelType.spoke36, rear_wheel_type: wheelType.spoke36, front_tyre_type: 'training', rear_tyre_type: 'training',
  //     e_bike_arr: []
  //     });
  //
  constructor(obj) {

    // Initialise parameters - user modifiable
    // Set up for a road bike with typical rider
    this.name = '';
    this.bike_type = bikeType.road;
    this.bike_weight = defaultBikeMass[bikeType.road];
    this.rider_weight = 87;
    this.rider_height = 1.756;
    this.riding_position = riderPos.bars; 
    this.rider_age = 30;
    this.drafting_position = draftPos['mid_pack'],       
    this.air_temp = 20;
    this.height_above_sea_level = 0;
    this.slope = 0;
    this.wind_speed = 0;
    this.cadence = 90;
    this.front_chainring = [50, 34];
    this.rear_cassette =  [11, 12, 13, 14, 15, 17, 19, 21, 24, 28];
    this.front_wheel_type = '36 spoke';
    this.rear_wheel_type = '36 spoke';
    this.front_rim_width = 22;
    this.rear_rim_width = 22;
    this.front_tyre_type = 'conti_28mm';
    this.rear_tyre_type = 'conti_28mm';
    this.userP = 0;
    this.ebikeP = 0;
    this.P = 0;
    this.v = 0;
    this.aHelmet = false;    // TRUE if wearing an aero helmet
    this.aSuit = false;      // TRUE if wearing a skinsuit
    this.aFrame = false;     // TRUE if a special aero bike frame.checked
    this.aBars = false;      // TRUE if aero bars fitted
    this.aCranks = false;    // TRUE if aero cranks fitted
    this.ebike = { on: false };
    this.wet_calc = true;    // TRUE if we calculate tyre pressures based upon a wet road (will be lower)
    this.surface_type = 'smooth';

    //---------------------------------------------------------------------------
    // 

    //-------------------------------------------------------------------------
    // Calculate power from bike speed, adjusting for e-bike power as available
    // and returning user power, ebike power and total power.
    //
    Object.defineProperty(this, 'powerCalc', {
      value: function(inputParameters) {
        if (typeof inputParameters == 'object') {
          this.#updateBikeParameters(inputParameters);
        } else if (Number(inputParameters) > 0) {
          this.v = Number(inputParameters);
        } else {
          this.v = 0;
        };

        this.#powerCalc(
          this.height_above_sea_level,
          this.air_temp,
          this.v,
          this.wind_speed,
          this.rider_weight,
          this.bike_weight,
          this.rider_height,
          this.cadence,
          this.riding_position,
          this.bike_type,
          this.rear_tyre_type,
          this.front_tyre_type,
          this.rear_wheel_type,
          this.front_wheel_type,
          this.drafting_position,
          this.aHelmet,     // TRUE if wearing an aero helmet
          this.aSuit,       // TRUE if wearing a skinsuit
          this.aFrame,      // TRUE if a special aero bike frame.checked
          this.aBars,       // TRUE if aero bars fitted
          this.aCranks,     // TRUE if aero cranks fitted
          this.slope,       // Slope of hill    
          this.surface_type // Surface type - 'smooth', 'rough', 'gravel' or 'bush'
        );

        this.P = -this.P
        this.userP = this.P
        this.ebikeP = 0;

        // Find power contribution from e bike
        if (this?.ebike?.on == true) { 
          Object.entries(this.ebike).forEach(([key, val]) => {
            if (key !== 'on') { 
              // This is an assist level
              if (val.speed_limit >= this.v) {
                // console.log(`Assist level ${val.assist_level} good to use - ${val.power}`);
                this.userP = this.P - val.power;
              };
            };
          });

          if (this.userP < 0) this.userP = 0;
          this.ebikeP = this.P - this.userP;
        };

        return {P: this.P, userP: this.userP};
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // powerCalc()
    //
    //-------------------------------------------------------------------------
    // Calculate speed from user power output, adding e-bike power as available
    //
    Object.defineProperty(this, 'speedCalc', {
      value: function(inputParameters) {
        const getSpeed = (pwr) => {
          this.#speedCalc(
            this.height_above_sea_level,     this.air_temp,        pwr,                this.wind_speed,     this.rider_weight,    this.bike_weight,    this.rider_height,
            this.cadence,                    this.riding_position, this.bike_type,     this.rear_tyre_type, this.front_tyre_type, this.rear_wheel_type, this.front_wheel_type,
            this.drafting_position,
            this.aHelmet,    // TRUE if wearing an aero helmet
            this.aSuit,      // TRUE if wearing a skinsuit
            this.aFrame,     // TRUE if a special aero bike frame.checked
            this.aBars,      // TRUE if aero bars fitted
            this.aCranks,    // TRUE if aero cranks fitted
            this.slope,      // Slope of hill   
            this.surface_type
            );
          return this.v;
        };

        if (typeof inputParameters == 'object') {
          this.#updateBikeParameters(inputParameters);
        } else if (Number(inputParameters) > 0) {
          this.P = Number(inputParameters);
        } else {
          this.P = 0;
        };

        this.userP = this.P;

        if (this.userP > 0) {
          // Find power contribution from e bike - ebike only kicks in if the user is pedalling
          if (this?.ebike?.on == true) { 
            let optOut = {};

            Object.entries(this.ebike).forEach(([key, val]) => {
              if (key !== 'on') { 
                // This is an assist level
                let thisSpeed = getSpeed( this.userP + val.power );
                if (thisSpeed <= val.speed_limit) {
                  // console.log(`assist level ${key} getSpeed(this.userP + val.power) (${parseInt(getSpeed( this.userP + val.power) * 3.6)}) < val.speed_limit (${parseInt(val.speed_limit * 3.6)}) ?`)
                  if ((Object.keys(optOut).length === 0) || (thisSpeed > optOut.speed)) {
                    optOut.speed = thisSpeed;
                    optOut.key = key;
                  }
                };
              };
            });

            if (Object.keys(optOut).length > 0) {
              // console.log(`Final e assist speed calc: selected assist level ${optOut.key}, v = ${getSpeed( this.userP + this.ebike[optOut.key].power ) * 3.6}, total power = ${ this.userP + this.ebike[optOut.key].power }`);
              return getSpeed( this.userP + this.ebike[optOut.key].power );
            };
          };
        };

        // console.log(`Final speed calc: v = ${getSpeed(this.userP) * 3.6}, total power = ${this.userP}`);
        return getSpeed(this.userP);
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // speedCalc()

    //
    //-------------------------------------------------------------------------
    // Calculate optimum tyre pressures from bike and environment parameters
    //
    Object.defineProperty(this, 'tyrePressureCalc', {
      value: function() {
        let temp = this.#tyrePressureCalc(
          this.rider_weight,                // Mass of rider
          this.bike_weight,                 // Mass of bike
          tyreWidth[tyre[this.front_tyre_type]],  // Front tyre width
          tyreWidth[tyre[this.rear_tyre_type]],   // Rear tyre width
          this.front_wheel_type,            // Front wheel type 
          this.rear_wheel_type,             // Rear wheel type
          this.front_rim_width,             // Front rim width
          this.rear_rim_width,              // Rear rim width
          this.bike_type,                   // An index into all of the bike related arrays, one of the properties of bikeType
          this.surface_type,                // 'smooth', 'rough', 'gravel' or 'bush'
          this.wet_calc                     // TRUE to calculate tyre pressures for wet conditions
        );
        // console.log(temp);
        return temp;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // tyrePressureCalc()
    //
    //---------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'BikeClassHelp', {
      value: function() {

        console.log(`
    BikeClass Help
    ~~~~~~~~~~~~~~
    Not written yet.  Refer RiderClass help() for a template

          `);

        return;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // help()
    //
    //-------------------------------------------------------------------------
    // Update the user modifiable parameters with any that have been passed in as 
    // named parameters in the object
    if (typeof obj != 'undefined')  this.#updateBikeParameters(obj);
    //
    //-------------------------------------------------------------------------
    // Initialise parameters - non user modifiable
    this.#rho = 0;
    this.#Froll = 0;
    this.#Fgrav = 0;
    this.#Ffrict = 0;
    this.#Fwind = 0;
    this.Proll = 0;
    this.Pwind = 0;
    this.#Pclimb = 0;
    this.Pfrict = 0;
    this.#CdBike = 0;
    this.#CdRider = 0;
    this.CdA = 0;
    this.Cd = 0;
    this.Crr = 0;
    this.bFA = 0;
    this.rFA = 0;
    this.FA = 0;

  }; // constructor(obj)
  //
  //-----------------------------------------------------------------------------
  //
  //
  #updateBikeParameters(obj) {
    let metric = true;

    if (typeof obj.name == 'string') this.name = obj.name;

    if ((typeof obj.bike_type != 'undefined') && (Object.values(bikeType).includes(Number(obj.bike_type)))) this.bike_type = Number(obj.bike_type);
    if ((typeof obj.bike_weight != 'undefined') && ((Number(obj.bike_weight) > 6) && (Number(obj.bike_weight) < 30))) this.bike_weight = Number(obj.bike_weight);  // TODO - convert lbs back to kg

    if (typeof obj.rider_height != 'undefined') {
      // Figure out if the user has entered inches, cm or m and convert back to m
      if (Number(obj.rider_height) < 3) { // User entered metres
        this.rider_height = Number(obj.rider_height);
      } else if (Number(obj.rider_height) < 140) { // User entered inches
        metric = false;
        this.rider_height = Number(obj.rider_height) * 2.54/100;
      } else { // User entered cm
        this.rider_height = Number(obj.rider_height) > 0 ? Number(obj.rider_height)/100 : this.rider_height;
      };
    };

    if (typeof obj.rider_weight != 'undefined') {
      // Figure out if the user has entered pounds or kg and convert back to kg
      if (Number(obj.rider_weight) < 133) { // User entered kgs
        this.rider_weight = Number(obj.rider_weight);
      } else { // User entered pounds
        metric = false;
        this.rider_weight = Number(obj.rider_weight) > 0 ? Number(obj.rider_weight)/2.20462333 : this.rider_weight;
      };
    };

    if ((typeof obj.riding_position != 'undefined') && (Object.values(riderPos).includes(Number(obj.riding_position)))) this.riding_position = Number(obj.riding_position);

    if ((typeof obj.drafting_position != 'undefined') && (Object.values(draftPos).includes(Number(obj.drafting_position)))) this.drafting_position = Number(obj.drafting_position);

    if ((typeof obj.air_temp != 'undefined') && (Number(obj.air_temp) !== false)) {
      this.air_temp = (metric == true) ? Number(obj.air_temp) : (Number(obj.air_temp) - 32)/1.8 ;
    };

    if ((typeof obj.height_above_sea_level != 'undefined') && (Number(obj.height_above_sea_level) !== false)) {
      this.height_above_sea_level = (metric == true) ? Number(obj.height_above_sea_level) : Number(obj.height_above_sea_level) * 0.3048; // Convert feet to metres as required
    };

    if ((typeof obj.P != 'undefined') && (Number(obj.P) !== false)) this.P = Number(obj.P);

    // Allow P to be passed as 'power'
    if ((typeof obj.power != 'undefined') && (Number(obj.power) !== false)) this.P = Number(obj.power);

    if ((typeof obj.v != 'undefined') && (Number(obj.v) !== false)) {
      this.v = (metric == true) ? Number(obj.v) : Number(obj.v) * 0.3048; // Convert ft/sec to m/s as required
    };

    // Allow velocity to be passed as 'speed'
    if ((typeof obj.speed != 'undefined') && (Number(obj.speed) !== false)) {
      this.v = (metric == true) ? Number(obj.speed) : Number(obj.speed) * 0.3048; // Convert ft/sec to m/s as required
    };

    if ((typeof obj.slope != 'undefined') && (Number(obj.slope) !== false)) {
      this.slope = Math.atan(Number(obj.slope) * 0.01); // Convert % slope back to radians
    };

    if ((typeof obj.wind_speed != 'undefined') && (Number(obj.wind_speed) !== false)) {
      this.wind_speed = (metric == true) ? Number(obj.wind_speed) : Number(obj.wind_speed) * 0.3048; // Convert ft/sec to m/s as required
    };

    if ((typeof obj.cadence != 'undefined') && (Number(obj.cadence) !== false)) this.cadence = Number(obj.cadence);


    if (Array.isArray(obj.front_chainring) && obj.front_chainring.every(num => Number.isInteger(num) && num > 0))
      this.front_chainring = [ ...obj.front_chainring ];

    if (Array.isArray(obj.rear_cassette) && obj.rear_cassette.every(num => Number.isInteger(num) && num > 0))
      this.rear_cassette = [ ...obj.rear_cassette ];

    if ((typeof obj.wheel_circumference != 'undefined') && (Number(obj.wheel_circumference) !== false)) this.wheel_circumference = Number(obj.wheel_circumference);

    if ((typeof obj.front_wheel_type != 'undefined') && (obj.front_wheel_type.toLowerCase() in wheel)) this.front_wheel_type = obj.front_wheel_type.toLowerCase();
    if ((typeof obj.rear_wheel_type != 'undefined') && (obj.rear_wheel_type.toLowerCase() in wheel)) this.rear_wheel_type = obj.rear_wheel_type.toLowerCase();

    if (typeof obj.front_rim_width == 'number') this.front_rim_width = obj.front_rim_width;
    if (typeof obj.rear_rim_width == 'number') this.rear_rim_width = obj.rear_rim_width;

    if ((typeof obj.front_tyre_type != 'undefined') && (obj.front_tyre_type in tyre)) this.front_tyre_type = obj.front_tyre_type;
    if ((typeof obj.rear_tyre_type != 'undefined') && (obj.rear_tyre_type in tyre)) this.rear_tyre_type = obj.rear_tyre_type;

    if (typeof obj.aeroHelmet != 'undefined') this.aHelmet = obj.aeroHelmet;  // TRUE if wearing an aero helmet
    if (typeof obj.aeroSuit != 'undefined')   this.aSuit = obj.aeroSuit;      // TRUE if wearing a skinsuit
    if (typeof obj.aeroFrame != 'undefined')  this.aFrame = obj.aeroFrame;    // TRUE if a special aero bike frame.checked
    if (typeof obj.aeroBars != 'undefined')   this.aBars = obj.aeroBars;      // TRUE if aero bars fitted
    if (typeof obj.aeroCranks != 'undefined') this.aCranks = obj.aeroCranks;  // TRUE if aero cranks fitted

    if (typeof obj.ebike === 'object') {
      if (typeof obj.ebike.on === 'boolean') { this.ebike.on = obj.ebike.on };

      // Check that the remaining properties form an array of objects
      const keys = Object.keys(obj.ebike);

      //-------------------------------------------------------------------------
      // Define a helper function to check each assist level object
      const validateAssistLevel = (level) => {
        if (typeof level !== 'object' || level === null) {
          return false;
        }

        // Check for assist_level, speed_limit, and power properties
        if (!level.hasOwnProperty('assist_level') || 
            !level.hasOwnProperty('speed_limit') || 
            !level.hasOwnProperty('power')) {
          return false;
        }

        // Validate types of properties
        if (typeof level.assist_level !== 'number' || 
            typeof level.speed_limit !== 'number' || 
            typeof level.power !== 'number') {
          return false;
        }
        return true;
      } // validateAssistLevel

      // Validate each assist level in the object
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== 'on') {
          if (validateAssistLevel(obj.ebike[key])) {
            this.ebike[key] = obj.ebike[key];
          }
        }
      }
    }; // if typeof obj.ebike === 'object'

    if ((typeof obj.surface_type != 'undefined') && (Object.keys(surfacePressureAdjustments).includes(obj.surface_type.toLowerCase()))) this.surface_type = obj.surface_type.toLowerCase();
    if (typeof obj.wet_calc == 'boolean') this.wet_calc = obj.wet_calc;

    return;
  }; // #updateBikeParameters()
  //
  //-----------------------------------------------------------------------------
  // Determine the air density at specified temperature and height.  
  // Note that this presently assumes dry air (air with water vapour
  // will have a marginally different density)
  #RhoCalc(
      T1,       // ambient temperature
      h         // height above sea level
    ) {

    // Determine density as a function of height
    let Po = 101325    // Sea level standard atmospheric pressure
    let To = 288.15    // Sea level standard temperature
    let L = -0.0065    // Temperature lapse rate
    let R = 8.31447    // Universal gas constant
    let M = 0.0289644  // Molecular weight of dry air
    
    let T = To + (L * h)
    let tmp1 = 1 + (L * h / To)
    let tmp2 = -BikeClass.#g * M / (R * L)
    
    let P = Po * Math.pow(tmp1, tmp2)
    this.#rho = P * M / (R * T) 

    // Now adjust for ambient temperature
    this.#rho = this.#rho * T / (T1 + 273)
    return;
  };
  //
  //-----------------------------------------------------------------------------
  // Adjust the Crr of the tyre (obtained by testing on a typical road type 
  // surface) to account for the surface that the bike is actually on.
  //
  // The following Crr figures based upon discipline and surface were proposed by ChatGPT:
  //   const crr = (discipline, surfaceType) => {
  //     road: { smooth: 0.004, rough: 0.006, gravel: 0.008, bush: 0.01 },
  //     cyclocross: { smooth: 0.005, rough: 0.007, gravel: 0.009, bush: 0.011 },
  //     gravel: { smooth: 0.006, rough: 0.008, gravel: 0.01, bush: 0.012 },
  //     mtb_cross_country: { smooth: 0.007, rough: 0.009, gravel: 0.011, bush: 0.013 },
  //     mtb_trail: { smooth: 0.008, rough: 0.01, gravel: 0.012, bush: 0.014 },
  //     mtb_enduro: { smooth: 0.009, rough: 0.011, gravel: 0.013, bush: 0.015 },
  //     mtb_downhill: { smooth: 0.01, rough: 0.012, gravel: 0.014, bush: 0.016 },
  //   };
  //
  // Reconciling the above ChatGPT Crr figures against the tyre Crr's (which we 
  // assume are the 'smooth' surface based upon the above, we can assign each
  // of the discpline's figure's to the tyres with the nearest 'smooth' Crr, and 
  // then figure out a multiplier of the 'smooth' value to get Crr for the other 
  // surfaces
  #adjustCrrForSurface(
    Crr,        // Crr on a smooth road
    tyreType,   // Tyre type as a key into the tyre object
    surfaceType // Surface type - 'smooth', 'rough', 'gravel' or 'bush'
  ) {
    const CrrMultipliers = {
      'race': { smooth: 1.000, rough: 1.500, gravel: 2.000, bush: 2.500}, // 23mm high pressure race tyre     
      'training': { smooth: 1.000, rough: 1.286, gravel: 1.571, bush: 1.857}, // 23mm heavy durable training tyre 
      'conti_23mm': { smooth: 1.000, rough: 1.400, gravel: 1.800, bush: 2.200}, // 23mm Continental Gatorskin       
      'conti_25mm': { smooth: 1.000, rough: 1.400, gravel: 1.800, bush: 2.200}, // 25mm Continental Gatorskin       
      'conti_28mm': { smooth: 1.000, rough: 1.400, gravel: 1.800, bush: 2.200}, // 28mm Continental Gatorskin       
      'conti_32mm': { smooth: 1.000, rough: 1.400, gravel: 1.800, bush: 2.200}, // 32mm Continental Gatorskin       
      '2"_mtb_slick': { smooth: 1.000, rough: 1.286, gravel: 1.571, bush: 1.857}, // 2" MTB slick (26" wheel)         
      '2"_mtb_knobbly': { smooth: 1.000, rough: 1.200, gravel: 1.400, bush: 1.600}, // 2" MTB knobbly (26" wheel)       
      '2.5"_mtb_slick': { smooth: 1.000, rough: 1.286, gravel: 1.571, bush: 1.857}, // 2" MTB slick (27.5" wheel)       
      '2.5"_mtb_knobbly': { smooth: 1.000, rough: 1.200, gravel: 1.400, bush: 1.600}, // 2" MTB knobbly (27.5" wheel)     
      '3.8"_mtb_slick': { smooth: 1.000, rough: 1.286, gravel: 1.571, bush: 1.857}, // 2" MTB slick (29" wheel)         
      '3.8"_mtb_knobbly': { smooth: 1.000, rough: 1.200, gravel: 1.400, bush: 1.600} // 2" MTB knobbly (29" wheel)
    };
    
    let mul = 1.00;


    if (typeof CrrMultipliers?.[tyreType]?.[surfaceType] !== 'undefined') mul = CrrMultipliers[tyreType][surfaceType];

    return mul * Crr;
  }; // const #adjustCrrForSurface = (Crr, tyreType, surface) => {

  //
  //-----------------------------------------------------------------------------
  // Determine force on bike due to rolling resistance.  
  // This force always opposes the direction of motion 
  #FrollCalc(
      b,          // Bike being ridden, an index into the bike arrays
      fTyre,      // Front tyre type as an index into the tyre arrays
      rTyre,      // Rear tyre type as an index into the tyre arrays
      m,          // Total mass of rider, bike and gear
      p,          // Position of rider as an index into RiderPos array
      theta,      // Slope of hill
      surfaceType // Surface type - 'smooth', 'rough', 'gravel' or 'bush'
    ) {      


    // wgtfront array only applies to a roadbike.  Proportionately adjust this for the bike type
    let frontWeight;
    switch (b) {
      case bikeType.road:
        frontWeight = wgtFront[p];
        break;
      case bikeType.road_ebike:
        frontWeight = wgtFront[p] * bikeFrontWeight[b] / bikeFrontWeight[bikeType.road];
        break;
      case bikeType.tandem:
        // Always 0.5 for tandems irrespective of riding position
        frontWeight = 0.5;
        break;
      default:
        // Always 0.45 for MTBs and true e-bikes irrespective of riding position
        frontWeight = 0.45;
        break;
    };
    let rearWeight = 1 - frontWeight;

    let frontCrr = this.#adjustCrrForSurface(Crr[tyre[fTyre]], fTyre, surfaceType);
    let rearCrr = this.#adjustCrrForSurface(Crr[tyre[rTyre]], rTyre, surfaceType);
    this.#Froll = -((rearCrr * rearWeight * m * BikeClass.#g * Math.cos(theta)) + (frontCrr * frontWeight * m * BikeClass.#g * Math.cos(theta)))
    this.Crr = Math.abs(this.#Froll/(m * BikeClass.#g * Math.cos(theta)));
    return;
  };
  //
  //-----------------------------------------------------------------------------
  // Determine force on bike due to gravity.  
  //
  #FgravCalc(
      m,        // Total mass of rider, bike and gear
      theta     // Slope of hill
    ) {    
   
    this.#Fgrav = -m * BikeClass.#g * Math.sin(theta);
    return;
  }
  //
  //-----------------------------------------------------------------------------
  // Determine force on bike due to frictional losses (ie chain on sprockets, tyre slippage etc)
  // This force always opposes the direction of motion 
  #FfrictCalc(
      m,        // Total mass of rider, bike and gear
      theta     // Slope of hill
    ) {

    this.#Ffrict = -BikeClass.#kFrict * m * BikeClass.#g * Math.cos(theta);  // kfrict is a lumped constant
    return;
  };
  //
  //-----------------------------------------------------------------------------
  // 
  //
  #getCdABike(
      b,         // Bike being ridden, an index into the bike arrays
      fTyre,     // Front tyre type as a key into the tyre object
      rTyre      // Rear tyre type as a key into the tyre object
    ) {

    return (CdTyreFront[tyre[fTyre]] * tyreArea[tyre[fTyre]] + CdTyreRear[tyre[rTyre]] * tyreArea[tyre[rTyre]] + CdBike[b] * frameArea[b]);
  };
  //
  //-----------------------------------------------------------------------------
  // Determine the force on the bike due to wind drag
  //
  #FwindCalc(
      alt,        // Height above sea level
      T,          // Ambient temperature
      v,          // Ground speed (m/s).
      w,          // Wind speed (m/s).  +ve is a tailwind, -ve is a headwind
      vAdj,       // Ground speed (m/s), artifically reduced for purposes of the power calc as a result of
                  // any aerodynamic improvements
      wAdj,       // Wind speed (m/s), artifically reduced for purposes of the power calc as a result of
                  // any aerodynamic improvements
      m,          // Mass of rider (kg)
      h,          // Height of rider (m)
      c,          // Cadence (rpm)
      p,          // Position of rider, an index into the riderPos array
      b,          // Bike being ridden, an index into the BikeArr array
      fTyre,      // Front tyre type as a key into the tyre object
      rTyre,      // Rear tyre type as an index into the tyre arrays
      draftPos    // Drafting position as an index into DraftPos array
    ) {

    // First calculate the drag force based upon the velocities that have already been adjusted for aerodynamic enhancements
    this.#RhoCalc(T, alt);
    this.#frontalAreaCalc( m, h, c, p, b, fTyre, rTyre );
    this.CdARider = this.rFA * ((b == bikeType.tandem)? 0.33 : ((b == bikeType.mtb) ? 0.75 : CdRider[p]));
    this.CdABike = this.#getCdABike(b, fTyre, rTyre);
    let vwAdj = vAdj - wAdj; // Relative velocity of bike to wind, adjusted for aerodynamic improvements
    this.#Fwind = -0.5 * draftPower[draftPos] * this.#rho * (this.CdARider + this.CdABike) * vwAdj * vwAdj;
    // Calculate the effective real world Cd's and CdA's by back calculating from the Force, and substituting the real speeds 
    // for those adjusted for aerodynamic improvements
    let vw = v - w;
    this.CdA = 0;
    if (vw > 0.01) this.CdA = this.#Fwind / (-0.5 * draftPower[draftPos] * this.#rho * vw * vw);
    this.Cd = this.CdA / this.FA;
    return;    
  };
  //
  //-----------------------------------------------------------------------------
  // Determine frontal area of rider and bike
  //
  #frontalAreaCalc(
      m,          // Mass of rider (kg)
      h,          // Height of rider (m)
      c,          // Cadence (rpm)
      p,          // Position of rider, an index into the riderPos type
      b,          // Bike being ridden, an index into the bikeType array
      fTyre,      // Front tyre type as a key of the tyre object
      rTyre       // Rear tyre type as a key of the tyre object
    ) {

    let cCad = 0.002; // Constant for influence of cadence on frontal area
    let s = ((b == bikeType.tandem) ? 0.7 * 2 : (b == bikeType.mtb) ? ((p == riderPos.bars) ? 0.85 : 0.89) : sin[p]);
    let adipos = Math.sqrt(m/(h*750));
    this.rFA = (1 + c * cCad) * adipos * (((h - adipos) * s) + adipos);
    this.bFA = frameArea[b] + tyreArea[tyre[fTyre]];
    this.FA = this.bFA + this.rFA;    
    return;
  };
  //
  //-----------------------------------------------------------------------------
  // Original figures in here were % time savings on a no breeze time trial.  The cube root of these were used
  // here since P = fn(v^3) to obtain aero percent reduction in power requirement for a given velocity.
  #aeroAdjustment(
      aHelmet,    // TRUE if wearing an aero helmet
      aSuit,      // TRUE if wearing a skinsuit
      aFrame,     // TRUE if a special aero bike frame.checked
      aBars,      // TRUE if aero bars fitted
      aCranks,    // TRUE if aero cranks fitted
      rWheel,     // Rear wheel type a property of the wheel object
      fWheel      // Front wheel type as a property of the wheel object
    ) {

    // First, adjust velocity figures for any aerodynamic equipment, because all figures we
    // have relate to overall bike speed, not just one set of losses.
    return (aFrame ? aeroVIncrease[0] : 1) * (aBars ? aeroVIncrease[1] : 1) * (aCranks ? aeroVIncrease[2] : 1) *
                (aHelmet ? aeroVIncrease[3] : 1) * (aSuit ? aeroVIncrease[4] : 1) * wheelVIncrease[wheel[rWheel]] * wheelVIncrease[wheel[fWheel]];
  };
  //
  //-----------------------------------------------------------------------------
  // Calculate instantaneous power requirement from velocity and other parameters
  //
  #powerCalc(
      alt,        // Height above sea level
      T,          // Ambient temperature
      v,          // Ground speed (m/s)
      w,          // Wind speed (m/s).  +ve is a tailwind, -ve is a headwind
      mR,         // Mass of rider (kg)
      mB,         // Mass of bike (kg)
      h,          // Height of rider (m)
      c,          // Cadence (rpm)
      p,          // Position of rider, an index into the riderPos type
      b,          // Bike being ridden, an index into the bike arrays
      rTyre,      // Rear tyre type as a key into the tyre object
      fTyre,      // Front tyre type as a key into the tyre object
      rWheel,     // Rear wheel type as a property of the wheel object
      fWheel,     // Front wheel type as a property of the wheel object
      draftPos,   // Drafting position as an index into DraftPos array
      aHelmet,    // TRUE if wearing an aero helmet
      aSuit,      // TRUE if wearing a skinsuit
      aFrame,     // TRUE if a special aero bike frame.checked
      aBars,      // TRUE if aero bars fitted
      aCranks,    // TRUE if aero cranks fitted
      theta,      // Slope of hill    
      surfaceType // Surface type - 'smooth', 'rough', 'gravel' or 'bush'
    ) {

    let adj = this.#aeroAdjustment(aFrame, aBars, aCranks, aHelmet, aSuit, rWheel, fWheel);
    let vAdj = v / adj;
    let wAdj = w / adj;    
    this.#FwindCalc( alt, T, v, w, vAdj, wAdj, mR, h, c, p,  b, rTyre, fTyre, draftPos );
    this.#FfrictCalc( (mR+mB), theta);                // Force due to frictional losses
    this.#FrollCalc( b, fTyre, rTyre, (mR+mB), p, theta, surfaceType);
    this.#FgravCalc( (mR+mB), theta );    
    this.P = (this.#Fwind + this.#Ffrict + this.#Froll + this.#Fgrav) * vAdj;
    this.Pwind = this.#Fwind * vAdj;
    this.Pfrict = this.#Ffrict * vAdj;
    this.Proll = this.#Froll * vAdj;
    this.Pgrav = this.#Fgrav * vAdj;
    return;
  }; // powerCalc()
  //
  //-----------------------------------------------------------------------------
  // Calculate instantaneous speed from power and other parameters
  //
  #speedCalc(
      alt,        // Height above sea level
      T,          // Ambient temperature
      pwr,        // Power (watt)
      w,          // Wind speed (m/s).  +ve is a tailwind, -ve is a headwind
      mR,         // Mass of rider (kg)
      mB,         // Mass of bike (kg)
      h,          // Height of rider (m)
      c,          // Cadence (rpm)
      p,          // Position of rider, an index into the riderPos array
      b,          // Bike being ridden, an index into the bike arrays
      rTyre,      // Rear tyre type as a key into the tyre object
      fTyre,      // Front tyre type as a key into the tyre object
      rWheel,     // Rear wheel type as a property of the wheel object
      fWheel,     // Front wheel type as a property of the wheel object
      draftPos,   // Drafting position as an index into DraftPos array
      aHelmet,    // TRUE if wearing an aero helmet
      aSuit,      // TRUE if wearing a skinsuit
      aFrame,     // TRUE if a special aero bike frame.checked
      aBars,      // TRUE if aero bars fitted
      aCranks,    // TRUE if aero cranks fitted
      theta,      // Slope of hill in radians
      surfaceType // Surface type - 'smooth', 'rough', 'gravel' or 'bush'
    ) {

    this.#FfrictCalc( (mR+mB), theta);                // Force due to frictional losses
    this.#FrollCalc( b, fTyre, rTyre, (mR+mB), p, theta, surfaceType);
    this.#FgravCalc( (mR+mB), theta );    
    let Fstg = this.#Ffrict + this.#Froll + this.#Fgrav;
    this.#RhoCalc( T, alt);
    this.#frontalAreaCalc( mR, h, c, p, b, fTyre, rTyre );
    this.CdARider = this.rFA * ((b == bikeType.tandem)? 0.33 : ((b == bikeType.mtb) ? 0.75 : CdRider[p]));
    this.CdABike = this.#getCdABike( b, fTyre, rTyre );

    // First, adjust velocity figures for any aerodynamic equipment, because all figures we
    // have relate to overall bike speed, not just one set of losses.
    let aAdj = this.#aeroAdjustment(aFrame, aBars, aCranks, aHelmet, aSuit, rWheel, fWheel);
    let wAdj = w / aAdj;    
    let cb = new Object();
    cubicInit(cb);
    cb.a = 1;
    cb.b = -2 * wAdj;
    cb.c = (wAdj * wAdj) - (2 * Fstg) /((this.CdARider + this.CdABike) * this.#rho * draftPower[draftPos]);
    cb.d = -2 * pwr / ((this.CdARider + this.CdABike) * this.#rho * draftPower[draftPos]);
    cubicSolve(cb);
    this.v = cb.y1 * aAdj;
    this.#FwindCalc( alt, T, this.v, w, (this.v / aAdj), wAdj, mR, h, c, p, b, rTyre, fTyre, draftPos );
    this.P = pwr;
    this.Pwind = this.#Fwind * this.v / aAdj;
    this.Pfrict = this.#Ffrict * this.v / aAdj;
    this.Proll = this.#Froll * this.v / aAdj;
    this.Pgrav = this.#Fgrav * this.v / aAdj;
    return;
  }; // #speedCalc()
  //
  //-----------------------------------------------------------------------------
  // Calculate optimum tye pressures
  //
  // Constants used when calculating tyre pressuress
  static basePressure = 96;  // Base pressure in PSI
  static minPressure  = 18;  // Minimum tyre pressure in PSI
  // Minimum tyre pressures for MTB tyres fropm chatGPT
  //   2.1" to 2.3" tires: 22-28 PSI (1.5-2.0 bar)
  //   2.4" to 2.6" tires: 18-25 PSI (1.2-1.7 bar)
  //   2.8" to 3.0" tires: 14-20 PSI (1.0-1.4 bar)
  static maxPressure  = 120;  // Maximum tyre pressure in PSI
  static weightAdjustmentFactor = 0.90; // Adjustment factor for weight
  static rimWidthAdjustmentFactor  = -0.7633; // Adjustment factor for rim width
  static tyreWidthAdjustmentFactor  = -1.3167; // Adjustment factor for tyre width
  static wetAdjustmentFactor    = 0.90; // Adjustment due to wet surfaces

  #tyrePressureCalc(
      riderWeight,    // Mass of rider
      bikeWeight,     // Mass of bike
      fTyreWidth,     // Front tyre width
      rTyreWidth,     // Rear tyre width
      fWheel,         // Front wheel type 
      rWheel,         // Rear wheel type
      fRimWidth,      // Front rim width
      rRimWidth,      // Rear rim width
      bikeInd,        // An index into all of the bike related arrays, one of the properties of bikeType
      surfaceType,    // 'smooth', 'rough', 'gravel' or 'bush'
      wetCalc         // TRUE to calculate tyre pressures for wet conditions
    ) {

      //---------------------------------------------------------------------
      // Function to calculate individual tyre pressure
      //
      // Fudged around with the weightFactor and widthFactor constants until the 
      // figures for a road bike aligned to within 3 PSI of SRAM calc on 
      // https://axs.sram.com/guides/tyre/pressure
      //
      function calculateIndividualPressure(
        weight,       // Total mass on the wheel
        wheelType,    // Wheel type as a text key of object 'wheel'
        tyreWidth,    // Width of the tyre
        rimWidth,     // WIdth of the wheel rim
        bikeInd,      // Defines the bike type - an index into the bike arrays
        surfaceType,  // 'smooth', 'rough', 'gravel' or 'bush'
        wetCalc       // TRUE to calculate tyre pressures for wet conditions
      ) {

        let pressureAdjustment = weight * BikeClass.weightAdjustmentFactor;
        let widthAdjustment = rimWidth * BikeClass.rimWidthAdjustmentFactor + tyreWidth * BikeClass.tyreWidthAdjustmentFactor;
        let recommendedPressure = BikeClass.basePressure + pressureAdjustment + widthAdjustment;

        // Apply surfaceType, bike type, wheel diameter, and wet adjustments
        recommendedPressure *= surfacePressureAdjustments[surfaceType];
        recommendedPressure *= disciplinePAdjustment[bikeInd];
        recommendedPressure *= wheelDiaPAdjust[wheel[wheelType]];
        if (wetCalc) {
          recommendedPressure *= BikeClass.wetAdjustmentFactor;
        }

        return Math.max(BikeClass.minPressure, Math.min(BikeClass.maxPressure, recommendedPressure));
      } // calculateIndividualPressure(weight) {


      // Calculate total weight
      if (bikeInd == bikeType['tandem']) riderWeight *= 2;
      const totalWeight = riderWeight + bikeWeight;

      // Calculate load on each wheel
      const frontWeight = totalWeight * bikeFrontWeight[bikeInd];
      const rearWeight = totalWeight - frontWeight;

      // Calculate front and rear tyre pressures
      const frontTirePressure = calculateIndividualPressure(frontWeight, fWheel, fTyreWidth, fRimWidth, bikeInd, surfaceType, wetCalc);
      const rearTirePressure = calculateIndividualPressure(rearWeight, rWheel, rTyreWidth, fRimWidth, bikeInd, surfaceType, wetCalc);

      // Log outputs
      // console.log(`  Optimum Front Pressure: ${frontTirePressure} PSI`);
      // console.log(`  Optimum Rear Pressure: ${rearTirePressure} PSI`);

      return {
        front: frontTirePressure,
        rear: rearTirePressure,
      };
    }; // #tyrePressureCalc()

} // class BikeClass


//---------------------------------------------------------------------------
// Copies all properties and methods from srcInstance to dstInstance.  Both 
// are instances of the BikeClass object
const copyBikeObject = (srcInstance, dstInstance) => {

  //---------------------------------------------------------------------------
  // Merge properties
  Object.assign(dstInstance, srcInstance);

  //---------------------------------------------------------------------------
  // Copy methods from the entire prototype chain (RiderWithCardiacClass and CardiacWithLactateClass)
  let proto = BikeClass.prototype;
  while (proto && proto !== Object.prototype) {
    Object.getOwnPropertyNames(proto).forEach(method => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, method);
    
      // Check if the property is a function
      if (typeof descriptor.value === 'function' && method !== 'constructor') {
        dstInstance[method] = descriptor.value.bind(dstInstance);
      }
    });
    proto = Object.getPrototypeOf(proto);
  }
}; // const copyBikeObject = (srcInstance, dstInstance) => {

window.BikeClass = BikeClass; // Attach the classs to the window object


//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', (event) => { 




}); // window.addEventListener('load', (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




