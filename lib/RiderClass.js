//
// RiderClass.js
// 
// Provides the Rider Class - rider info and models for cardiac and lactate
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//      Sep 2000 WZ  Original code by Walter Zorn, http://kreuzotter.de/english/espeed.htm
//   22 Sep 2003 ??? Mods by persons unknown from original website
//          2007 MDS Ported to my app following bike crash
//   18 Apr 2020 MDS Minor mods
//    1 Jul 2024 MDS Ported to RiderClass, added more tyre Crrs, e-bike capability
//
//------------------------------------------------------------------------------
"use strict";

// Put these in the global scope for now so we can access them from the console

// ********************************************************************************************************
//
// TODO: Update heart rate recovery time if we get some arrays of heart rates vs time fed into the class...
//
// ********************************************************************************************************

class RiderClass {
  constructor(obj) {

    // Initialise parameters - user modifiable
    this.name = '';
    this.gender = 'female';
    this.height = 1.756;
    this.weight = 65;
    this.age = 38;

    //---------------------------------------------------------------------------
    // Return the rider's BMI
    Object.defineProperty(this, 'BMI', {
      value: function() {
        return this.weight/(this.height * this.height);
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // BMI()

    //---------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'calculateEfficiency', {
      value: function() {
        return this.power / this.force;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // calculateEfficiency()

    //---------------------------------------------------------------------------
    // 
    Object.defineProperty(this, 'RiderClassHelp', {
      value: function() {

        console.log(`
    RiderClass Help
    ~~~~~~~~~~~~~~~
    The following methods are available:
      None
    The following properties are available:
      name - the ridewr's name
      gender - the rider's gender ('male' or 'female')
      height - the rdiers height in m
      weight - the rider's weight in kg
      age - the riders age
    Initialisation
      A rider is initialised with the properties for the RiderClass, RiderWithCardiacClass (if it has been found) and CardiacWithLactateClass (if it has been found).
      Parameters are passed as a Javascript object upon creation of the instance; all RiderClass properties can also be changed at runtime.
      Initialisation occurs thus, with all parameters optionally changed from defaults:

        fred = new RiderClass({
          name: "Fred",
          height: 1.87, weight: 94, age:59, gender: "male"
          }); 

      RiderClass Parameters:
  

          `);

        return;
      },
      writable: false,    // Prevent modification
      configurable: false // Prevent reconfiguration or deletion
    }); // help()


    //-------------------------------------------------------------------------
    // Update the user modifiable parameters with any that have been passed in as 
    // named parameters in the object
    if (typeof obj != 'undefined')  this.#updateRiderParameters(obj);


  }; // constructor(obj)


  //---------------------------------------------------------------------------
  // Copies the entire class (including private, public properties and methods)
  // of this instance to dstInstance, another instance of the same class
  copyRiderTo(dstInstance) {
    if (!(dstInstance instanceof RiderClass)) {
      throw new Error("Destination instance must be of type RiderWithCardiacClass");
    }

    // Copy public methods and properties
    Object.assign(dstInstance, this);

    // Copy private methods and properties that can change
    // (none in this class)

    // Call the base class copy method
    // (this is the base class, so no method here)

  } // copyRiderTo(dstInstance) {


  //-----------------------------------------------------------------------------
  //
  #updateRiderParameters(obj) {
    let metric = true;

    if (typeof obj.name == 'string') this.name = obj.name;

    if (typeof obj.gender == 'string') {
      if (obj.gender.toLowerCase() == 'male') {
        this.gender = 'male';
      } else {
        this.gender = 'female';
      }
    };

    if ((typeof obj.height !== 'undefined') && (Number(obj.height) > 0.5)) {
      // Figure out if the user has entered inches, cm or m and convert back to m
      if (Number(obj.height) < 3) { // User entered metres
        this.height = Number(obj.height);
      } else if (Number(obj.height) < 140) { // User entered inches
        this.height = Number(obj.height) * 2.54/100;
        metric = false;
      } else { // User entered cm
        this.height = Number(obj.height) > 0 ? Number(obj.height)/100 : 1.756;
      };
    };

    if ((typeof obj.weight !== 'undefined') && (Number(obj.weight) > 0.5)) {
      // Figure out if the user has entered pounds or kg and convert back to kg
      if (Number(obj.weight) < 133) { // User entered kgs
        this.weight = Number(obj.weight);
      } else { // User entered pounds
        metric = true;
        this.weight = Number(obj.weight) > 0 ? Number(obj.weight)/2.20462333 : 87;
      };
    };

    if ((typeof obj.age !== 'undefined') && (Number(obj.age) > 5)) this.age = Number(obj.age);

  };   // #updateRiderParameters(obj) {



}  // class RiderClass


window.RiderClass = RiderClass; // Attach the classs to the window object


//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', (event) => { 




}); // window.addEventListener('load', (event)

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




