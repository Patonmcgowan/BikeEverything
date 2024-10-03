//
// RiderWithCardiacClass.js
// 
// Provides the Cardiac Class - cardiac models
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

class RiderWithCardiacClass extends RiderClass {

  // Private properties & methods
  // These ones are to determine if the property has been chanegd by the user 
  //   - if so, we need to recalculate dependant parameters
  #initial_ejection_fraction;
  #initial_maximum_heart_rate;

  #UDFpowerFromHeartRate;
  #UDFheartRateFromPower;

  // These ones are held as private variables because we don't want the user to 
  // modify them directly
  #ejection_fraction;
  #maximum_heart_rate;
  #resting_heart_rate;
  #working_heart_rate;
  #AerT; // Aerobic threshold heart rate
  #LTHR; // lactate threshold heart rate

  constructor(obj) {
    super(obj);

    // --------------------------------------------------
    // Initial values
    this.#initial_maximum_heart_rate = this.getMHR(this.age, this.gender);
    this.#maximum_heart_rate = this.#initial_maximum_heart_rate;
    this.#initial_ejection_fraction = 0.6;
    this.#ejection_fraction = this.#initial_ejection_fraction;

    this.#resting_heart_rate = 60;
    this.#working_heart_rate = this.#maximum_heart_rate - this.#resting_heart_rate;

    // Aerobic threshold AerT - above this, lactate is produced by the body during exercise
    this.#AerT= 0.8 * this.#maximum_heart_rate;
    

    // Lactate threshold LTHR - above this, lactate is not cleared by the body during exercise
    //   Method 1: LTHR = restingHR + (80% - 90% × WHR) = 60 + 0.85 x 111 = 154 bpm
    //   Method 2: LTHR is 10% - 15% higher than AeT = 134 x 1.1 to 134 x 1.15 = 147 bpm to 154 bpm
    // When exercising at or below the lactate threshold, any lactate produced by the muscles is removed by the body without it building up.[3]
    this.#LTHR= 0.9 * this.#maximum_heart_rate;

    this.#UDFpowerFromHeartRate = (heart_rate) => {
      if (heart_rate < this.#LTHR) {
        // We are in the linear region - this is a linear fit from Power.vs.HeartRate.xlsx 'T2Plot'
        return heart_rate * 3.2771 - 211.03;
      } else {
        return heart_rate * 1.5097 + 56.329;
      };
      // return 247.07 * Math.log(heart_rate) - 1005;
    };

    this.#UDFheartRateFromPower = (power) => {
      if (power <= this.powerFromHeartRate(this.#LTHR)) {
        // We are in the linear region - this is a linear fit from Power.vs.HeartRate.xlsx 'T2Plot'
        return (power + 211.03) / 3.2771;
      } else {
        return (power - 56.329) / 1.5097;
      };
      // return Math.exp((power + 1005)/247.07);
    };

    //-------------------------------------------------------------------------
    //
    Object.defineProperty(this, 'powerFromHeartRate', {
      value: function(heart_rate) {
        let HR = heart_rate > this.#maximum_heart_rate ? this.#maximum_heart_rate : heart_rate;
         HR = heart_rate < this.#resting_heart_rate ? this.#resting_heart_rate : HR;
         return parseInt(this.#UDFpowerFromHeartRate(HR));
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // powerFromHeartRate()

    //-------------------------------------------------------------------------
    //
    Object.defineProperty(this, 'heartRateFromPower', {
      value: function(power) {
        let HR = this.#UDFheartRateFromPower(power);
        HR = HR > this.#maximum_heart_rate ? this.#maximum_heart_rate : HR;
        HR = HR < this.#resting_heart_rate ? this.#resting_heart_rate : HR;
        return parseInt(HR);
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // heartRateFromPower()

    //---------------------------------------------------------------------------
    // Returns text based upon the passed heart rate
    Object.defineProperty(this, 'heartRateText', {
      value: function(heartRate) {
        if (heartRate <= this.resting_heart_rate) {
          return `Heart rate is ${heartRate} bpm - rider is at rest`;
        } else {
          if (heartRate < this.#AerT) {
            return `Heart rate is ${heartRate} bpm - riding aerobically`;
          } else {
            if (heartRate < this.#LTHR) {
              return `Heart rate is ${heartRate} bpm - riding anaerobically below lactate threshold`;
            } else {
              if (heartRate < this.maximum_heart_rate) {
                return `Heart rate is ${heartRate} bpm - riding anaerobically and accumulating lactate`;
              }
            }
          }
        }
        return `Riding at maximum heart rate of ${heartRate} bpm`;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // heartRateText()

    //---------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'RiderWithCardiacClassHelp', {
      value: function() {

        console.log(`
    RiderWithCardiacClass Help
    ~~~~~~~~~~~~~~~~~
    Not written yet.  Refer RiderClass help() for a template

          `);

        return;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // help()

    //-------------------------------------------------------------------------
    // Update the user modifiable parameters with any that have been passed in as 
    // named parameters in the object
    if (typeof obj != 'undefined')  this.#updateCardiacParameters(obj);
  }; // constructor(obj)

  //---------------------------------------------------------------------------
  // Get the max heart rate by using the various formulae
  //   https://www.verywellfit.com/maximum-heart-rate-1231221
  getMHR(age, gender) {
    if (gender.toLowerCase() == 'female') {
      return parseInt(206 - (0.88 * age));  // Gulati formula for women
    }
    // return parseInt(211 - (0.64 * age)); // HUNT formaula for those that are active
    return parseInt(208 - (0.7 * age));     // Tanaka formula
  } // #getMHR(age, gender) {

  //---------------------------------------------------------------------------
  // Copies the entire class (including private, public properties and methods)
  // of this instance to dstInstance, another instance of the same class
  copyCardiacTo(dstInstance) {
    if (!(dstInstance instanceof RiderWithCardiacClass)) {
      throw new Error("Destination instance must be of type RiderWithCardiacClass");
    }

    // Copy public methods and properties
    Object.assign(dstInstance, this);

    // Copy private methods and properties that can change
    dstInstance.#UDFpowerFromHeartRate = this.#UDFpowerFromHeartRate;
    dstInstance.#UDFheartRateFromPower = this.#UDFheartRateFromPower;
    dstInstance.#ejection_fraction = this.#ejection_fraction;
    dstInstance.#maximum_heart_rate = this.#maximum_heart_rate;
    dstInstance.#resting_heart_rate = this.#resting_heart_rate;
    dstInstance.#working_heart_rate = this.#working_heart_rate;
    dstInstance.#AerT = this.#AerT;
    dstInstance.#LTHR = this.#LTHR;

    // Call the base class copy method
    this.copyRiderTo(dstInstance);
  } // copyCardiacTo(dstInstance) {

  //---------------------------------------------------------------------------
  // 
  #updateCardiacParameters(obj) {

    if ((typeof obj.resting_heart_rate !== 'undefined') && (Number(obj.resting_heart_rate) > 35) && (Number(obj.resting_heart_rate) < 80))  { 
      this.resting_heart_rate = Number(obj.resting_heart_rate); 
    } else {

    };

    if ((typeof obj.maximum_heart_rate !== 'undefined') && (Number(obj.maximum_heart_rate) > 110) && (Number(obj.maximum_heart_rate) < 220))  { 
      this.maximum_heart_rate = Number(obj.maximum_heart_rate);
    } else {
      if (!this.maximum_heart_rate_changed) {
        // User hasn't adjusted maximum heart rate directly so adjust maximum heart rate based upon gender and age if they are supplied
console.log(`Adjusting maximum heart rate automatically`);









      };
    };
    obj.maximum_heart_rate = this.maximum_heart_rate; // Update obj ready to send to CardiacWithLactateClass

    if ((typeof obj.ejection_fraction !== 'undefined') && (Number(obj.ejection_fraction) > 0.2) && (Number(obj.ejection_fraction) < 0.7)) {
      this.ejection_fraction = Number(obj.ejection_fraction);
    } else {
      if (!this.ejection_fraction_changed) {
        // User hasn't adjusted ejection fraction directly so adjust ejection fraction based upon gender and age if they are supplied
console.log(`Adjusting ejection fraction automatically`);






      }
    };
    obj.ejection_fraction = this.ejection_fraction; // Update obj ready to send to CardiacWithLactateClass

    if (typeof obj.powerFromHeartRate == 'function') { this.#UDFpowerFromHeartRate = obj.powerFromHeartRate.bind(this) };
    if (typeof obj.heartRateFromPower == 'function') { this.#UDFheartRateFromPower = obj.heartRateFromPower.bind(this) };
  }; // #updateCardiacParameters(obj)


  get maximum_heart_rate_changed() {
    return (this.maximum_heart_rate !== this.#initial_maximum_heart_rate);
  };

  get ejection_fraction_changed() {
    return (this.ejection_fraction !== this.#initial_ejection_fraction);
  };

  get ejection_fraction() {
    return parseInt(this.#ejection_fraction);
  };

  set ejection_fraction(value) {
    this.#ejection_fraction = value;
  };

  get resting_heart_rate() {
    return parseInt(this.#resting_heart_rate);
  };

  set resting_heart_rate(value) {
    this.#resting_heart_rate = value;
    this.#working_heart_rate = this.maximum_heart_rate - this.resting_heart_rate;
    this.#AerT= this.resting_heart_rate + 0.67 * (this.maximum_heart_rate - this.resting_heart_rate);
    this.#LTHR=  this.resting_heart_rate + 0.85 * (this.maximum_heart_rate - this.resting_heart_rate);
  };

  get maximum_heart_rate() {
    return parseInt(this.#maximum_heart_rate);
  };

  set maximum_heart_rate(value) {
    this.#maximum_heart_rate = value;
    this.#working_heart_rate = this.maximum_heart_rate - this.resting_heart_rate;
    this.#AerT= this.resting_heart_rate + 0.67 * (this.maximum_heart_rate - this.resting_heart_rate);
    this.#LTHR=  this.resting_heart_rate + 0.85 * (this.maximum_heart_rate - this.resting_heart_rate);
  };

  get AerT() {
    return parseInt(this.#AerT);
  };

  set AerT(v) {  }; // Do nothing but keep external property calls happy

  get LTHR() {
    return  parseInt(this.#LTHR);
  };

  set LTHR(v) {  }; // Do nothing but keep external property calls happy

  get working_heart_rate() {
    return  parseInt(this.#working_heart_rate);
  };

  set working_heart_rate(v) {  }; // Do nothing but keep external property calls happy
  
}  // class RiderWithCardiacClass

window.RiderWithCardiacClass = RiderWithCardiacClass; // Attach the classs to the window object


//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', (event) => { 




}); // window.addEventListener('load', (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




