//
// CardiacWithLactateClass.js
// 
// Provides the Lactate Class - lactate models
//
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    15 Aug 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

// Put these in the global scope for now so we can access them from the console

class CardiacWithLactateClass extends RiderWithCardiacClass {
  // Private properties
  // These ones are to determine if the property has been chanegd by the user 
  //   - if so, we would need to recalculate dependant parameters

  // Left Ventricle Ejection Fraction (LVEF) is important in this class because the left ventricle delivers blood to the body.
  // Commonly referred to as EF, the ejection fractionis a measure of the proportion of the blood volume that is pumped each stroke.
  // Since medical terminology for 'normal', 'mild', 'moderate' and 'severe' is well defined, we annotate the ranges for EF here:
  //
  //  LVEF range                    Men            Women
  //  ----------                  -------         -------
  //  Normal range                52%–72%         54%–74%
  //  Mildly abnormal range       41%–51%         41%–53%
  //  Moderately abnormal range	  30%–40%         30%–40%        *** heart failure ***
  //  Severely abnormal range   less than 30%   less than 30%    *** heart failure ***

  // Instantaneous Lactate Production/Consumption
  // --------------------------------------------
  // Overall lactate production = LPR - LCR
  //
  // LPR = k x (HR - AerT), HR > AerT
  //
  // where:
  //   LPR - lactate production rate in mmol/l/min
  //     k - lactate production rate constant in mmol/l/bpm/min
  //         With an ejection fraction of:
  //           45% (mild ef) - Typical k = 0.03 to 0.06 mmol/L per bpm above AerT
  //           60% (normal)  - Typical k = 0.015 to 0.03 mmol/L per bpm above AerT. (lower production because of more efficient pumping)
  //    HR - heart rate in bpm
  //  AerT - aerobic heart rate threshold in bpm
  //
  #k;                             // mmol/l/min

  // LCR = c × (LTHR − HR), HR < LTHR
  //
  //   where:
  //   LCR - lactate clearance rate in mmol/l/min
  //     c - lactate clearance rate constant in mmol/l/bpm/min
  //         With an ejection fraction of:
  //           45% (mild ef) - Typical c = 0.03 to 0.06 mmol/L per bpm below LTHR
  //           60% (normal)  - Typical c = 0.04 to 0.08 mmol/L per bpm below LTHR. (higher clearance because of more efficient pumping)
  //    HR - heart rate in bpm
  //  LTHR - lactate threshold heart rate in bpm
  //
 #c;                             // mmol/L/min/bpm

  // OVER TIME:
  // ----------
  //
  // L = Lo + d(LPR - LCR)
  //          ------------
  //               dt
  //

  // https://en.wikipedia.org/wiki/Lactate_threshold
  //   In zone-based polarized training methodologies, LT1 (AerT) is commonly used to designate the linear inflection point, 
  //     often observed around blood lactate levels of 2.0 mmol/L, while  LT2 (LTHR) is commonly used to designate the 
  //     non-linear inflection point, often observed around blood lactate levels of 4.0 mmol/L.
  //   Wikipedia notes that typical quiescent lactate concentrations may be 0.5 - 2.2 mmol/l, whereas typically at rest it is around 1 mmol/l
  //     This can vary because of reduced EF:
  //       Normal : 0.5 - 2.2 mmol/l
  //       Mildly Abnormal : ChatGPT notes that quiescent lactate concentrations may increase slightly, often still within the upper limit 
  //         of the normal range (e.g., 2-2.5 mmol/L).
  //       Moderately Abnormal : ChatGPT notes that quiescent lactate concentrations may rise further, potentially exceeding 
  //         2.5 mmol/L and reaching up to 4 mmol/L or more.

  #lactate_present_concentration; // mmol/l

   //---------------------------------------------------------------------------
  constructor(obj) {
    super(obj);


    //-------------------------------------------------------------------------
    // Initialise parameters - non user modifiable
    this.#k = (0.015 + 0.03) / 2;  // mmol/l/bpm.  Take mid range of typical values for now
    this.#c = (0.04 + 0.08) / 2;   // mmol/l/bpm.  Take mid range of typical values for now
    
    this.#lactate_present_concentration = this.#getQuiescentLactate(); // Initial concentration in mmol/l

    //---------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'updateLactateParameters', {
      value: function(obj) {

/*
        if ((typeof obj.lactate_production_rate !== 'undefined') && (Number(obj.lactate_production_rate) > 0.005) && (Number(obj.lactate_production_rate) < 0.1)) {
          this.lactate_production_rate = Number(obj.lactate_production_rate);
        };

        if ((typeof obj.lactate_clearance_rate !== 'undefined') && (Number(obj.lactate_clearance_rate) > 0.005) && (Number(obj.lactate_clearance_rate) < 0.1)) {
          this.lactate_clearance_rate = Number(obj.lactate_clearance_rate);
        };
*/



      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // updateLactateParameters(obj)


    //-------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'CardiacWithLactateClassHelp', {
      value: function() {

        console.log(`
    CardiacWithLactateClass Help
    ~~~~~~~~~~~~~~~~~
    Not written yet.  Refer RiderClass help() for a template

          `);

        return;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // help()

  }; // constructor(obj)

  //---------------------------------------------------------------------------
  // Copies the entire class (including private, public properties and methods)
  // of this instance to dstInstance, another instance of the same class
  copyLactateTo(dstInstance) {
    if (!(dstInstance instanceof CardiacWithLactateClass)) {
      throw new Error("Destination instance must be of type RiderWithCardiacClass");
    }

    // Copy public methods and properties
    Object.assign(dstInstance, this);

    // Copy private methods and properties that can change
    // (none in this class)

    // Call the base class copy method
    this.copyCardiacTo(dstInstance);
  }

  //---------------------------------------------------------------------------
  // The following private methods are based upon ChatGPT Response to varying lactate parameters w.r.t age, ef, gender
  //
  // Cited Sources (cannot be checked):
  //   Gladden, L. B. (2004). "Lactate Kinetics in the Human Body: The Balance Between Lactate Production and Lactate Clearance." Sports Medicine.
  //   Lakatta, E. G., & Levy, D. (2003). "Age-Related Changes in Cardiac Function." Circulation.
  //   Struthers, A. D., & Morris, A. D. (1997). "Ejection Fraction and Cardiac Output in Aging." The American Journal of Cardiology.
  // ... methods have been verified to 'an order of magnitude' by web research

  //---------------------------------------------------------------------------
  // Quiescent Lactate Concentration (mmol/L)
  #getQuiescentLactate = () => {
    let baseRate = 1.0;
    let ageFactor = this.age > 40 ? (this.age - 40) * 0.02 : 0;
    let efFactor = this.ejectionFraction < 0.55 ? (0.55 - this.ejectionFraction) * 2.5 : 0;

    return baseRate + ageFactor + efFactor;
  } // #getQuiescentLactate = () => {

  //---------------------------------------------------------------------------
  // Instantaneous Lactate Production Rate (mmol/L/min)
  #getLactateProductionRate = (heartRate) => {
    let baseRate = this.gender === 'female' ? 0.035 : 0.04; // Slightly higher in males due to muscle mass
    let ageFactor = this.age > 50 ? (this.age - 50) * 0.001 : 0;
    let efFactor = this.ejectionFraction < 0.50 ? (0.50 - this.ejectionFraction) * 0.01 : 0;

    return heartRate > this.AerT ? (baseRate + ageFactor + efFactor) * (heartRate - this.AerT) : 0;
  } // #getLactateProductionRate = (heartRate) => {

  //---------------------------------------------------------------------------
  // Instantaneous Lactate Clearance Rate (mmol/L/min)
  #getLactateClearanceRate = (heartRate) => {
    let baseClearance = this.gender === 'female' ? 0.045 : 0.05; // Slightly higher in males due to muscle mass
    let ageFactor = this.age > 60 ? -(this.age - 60) * 0.002 : 0;
    let efFactor = this.ejectionFraction < 0.50 ? -(0.50 - this.ejectionFraction) * 0.02 : 0;

    return heartRate < this.LTHR ? (baseClearance + ageFactor + efFactor) * (this.LTHR - heartRate) : 0;
  } // #getLactateClearanceRate = (heartRate) => {

  //---------------------------------------------------------------------------
  // Instantaneous  Net Lactate Production Rate (mmol/L/min)
  netLactateProductionRate = (heartRate) => {
    return this.#getLactateProductionRate(heartRate) - this.#getLactateClearanceRate(heartRate)
  } // netProductionRate = (heartRate) => {

} // class CardiacWithLactateClass



window.CardiacWithLactateClass = CardiacWithLactateClass; // Attach the classs to the window object


//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', (event) => { 




}); // window.addEventListener('load', (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




