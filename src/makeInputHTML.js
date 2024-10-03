//
// makeInputHTMLjs
// 
// Writes the html for general input
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

window.addEventListener('load', (event) => { 

  // Main menu input buttons at the top
  let HTMLOut = `
      <div class="flex-item">
        <a class="myLink" id='btnInstantCalc' href=#_ >Perform</a> an instantaneous calculation<br />
        <a class="myLink" id='btnRideCalc' href=#_ >Perform</a> calculations for a ride<br />
      </div>
      <div class="flex-item">
        <a class="myLink" href='./speedPowerTheory.html'>Read</a> about the forces that are exerted on a bike<br />
        <a class="myLink" href=#_ id='btnImportGPXTCX'>Analyse</a> a Garmin or Strava .GPX or .TCX file<br />
        <input type="file" style="display:none" id="gpxtcxInput" accept=".gpx, .tcx">
      </div>
      <div class="flex-item">
        <!-- 

          If the popups don't open in the correct size or location, close all instances of chrome (including the homeAutomation page).  Open this page, then open 
          the homeAutomation page using Win-R shell:startup.  Subsequent reloads of this page will work until the PC is rebooted.  

          (there is a conflict somewhere between the two scripts)

          -->
        <a class="myLink" href=#_ onclick='window.open("./mConvert.html","MetWin","width=450,height=430,resizable=1")'>Convert</a> between metric and imperial quantities<br />
        <a class="myLink" href=#_ onclick='window.open("./metabolicCalc.html","BMRWin","width=410,height=445,resizable=1")'>Calculate</a> metabolic quantities<br />
      </div>
    `;
  el('topMenu').innerHTML = HTMLOut;

  // Build the start of the ride calc table and the headers for the input area
  HTMLOut = `
    <table>
      <tr>
        <td class='h2' colspan="2">Prepopulated Riders &amp; Bikes</td>
        <td class='h2' id='bikeName' colspan="2">Custom Bike</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td class='h2' id='riderName' colspan="2">Custom Rider</td>
        <td></td>
      </tr>
      <tr>
        <td>Rider</td>
        <td class="inputText align="right">
          <select id = "riderSelection">
            <option value="" disabled selected hidden>Custom Rider</option>
            <option value="mike">Mike</option>
            <option value="don">Don</option>
          </select>
        </td>
        <td>Bike Type</td>
        <td class="inputText align="right">
          <select id="bikeType">`;
            let selectedText = ` selected`;
            bikeText.forEach(bike => {
              HTMLOut += `           <option${selectedText}>${bike}</option>`;
              selectedText = '';
            });
            HTMLOut += `
          </select>
        </td>
        <td></td>
        <td>Height</td>
        <td><input maxLength=5 size=6 value=178 id="hRider"> cm</td>
        <td></td>
      </tr>
      <tr>
        <td>Bike</td>
        <td class="inputText align="right">
          <select id = "bikeSelection">
            <option value="" disabled selected hidden>Custom Bike</option>
            <option value="baumCorretto">Mike's Baum</option>
            <option value="scottSpeedster">Mike's Scott</option>
            <option value="trekDomane">Mike's Trek e-bike</option>
            <option value="trekDomaneRaw">Mike's Trek e-bike (no e-assist)</option>
            <option value="donTrekDomane">Don's Trek e-bike</option>
          </select>
        </td>
        <td>Total Bike Weight</td>
        <td><input maxLength=5 size=6 value=6.8 id="mBike"> kg</td>
        <td></td>
        <td>Weight</td>
        <td><input maxLength=5 size=6 value=70.0 id="mRider"> kg</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Front Wheel</td>
        <td>
          <select size=1 id="frontWheel">`;
            selectedText = ` selected`;
            wheelText.forEach(str => {
              HTMLOut += `           <option${selectedText}>${str}</option>`;
              selectedText = '';
            });
          HTMLOut += `
          </select>
        </td>
        <td></td>
        <td>Age</td>
        <td><input maxLength=5 size=6 value=35 id="rAge"></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Rear Wheel</td>
        <td>
          <select size=1 id="rearWheel">`;
            selectedText = ` selected`;
            wheelText.forEach(str => {
              HTMLOut += `           <option${selectedText}>${str}</option>`;
              selectedText = '';
            });
          HTMLOut += `
          </select>
        </td>
        <td></td>
        <td>Resting Heart Rate</td>
        <td><input maxLength=5 size=6 value=60 id="rRHR"> bpm</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Front Wheel Tyre</td>
        <td>
          <select size=1 id="frontTyre">`;
            tyreText.forEach(tyre => {
              selectedText = '';
              if (tyre == '28mm Continental Gatorskin') selectedText = ` selected`;
              HTMLOut += `           <option${selectedText}>${tyre}</option>`;
            });
          HTMLOut += `
          </select>
        </td>
        <td></td>
        <td>Max Heart Rate</td>
        <td><input maxLength=3 size=6 value=185 id="rMHR"> bpm</td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Rear Wheel Tyre</td>
        <td>
          <select size=1 id="rearTyre">`;
            tyreText.forEach(tyre => {
              selectedText = '';
              if (tyre == '28mm Continental Gatorskin') selectedText = ` selected`;
              HTMLOut += `           <option${selectedText}>${tyre}</option>`;
            });
          HTMLOut += `
          </select>
        </td>
        <td></td>
        <td>Gender At Birth</td>
        <td>
          Male<input type="radio" name="gender" id="gender0">
        </td>
        <td>
          Female<input type="radio" checked name="gender" id="gender1">
        </td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td colspan="2">e-bike with e-Assist Enabled ? <input type=checkbox id="eBike"></td>
        <td></td>
        <td><span id="SR4">Max sustainable power</span></td>
        <td><span id="SR5"><input maxLength=3 size=6 value=188 id="PMAX"> Watts</span></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td align="right" colSpan=3>
          <div id="SR10"><small>(on a level course at sea level and 25&#x00b0;C With no tailwind for at least an hour)</small></div>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td><span id="SR7">Maximum sustainable speed</span></td>
        <td><span id="SR8"><input maxLength=5 size=6 value=30.0 id="VMAX"> km/hr</span></td>
        <td></td>
      </tr>
      <tr id="SR11">
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td colSpan=3><small>(on a level course at sea level and 25&#x00b0;C with no tailwind for at least an hour)</small></td>
      </tr>
    </table>

    <div id="aeroOptions">
      Aero Frame<input type=checkbox id="aeroFrame">
      Aero Helmet<input type=checkbox id="aeroHelmet">
      Skinsuit<input type=checkbox id="skinsuit">
      Aero Bars<input type=checkbox id="aeroBars">
      Aero Cranks And Rings<input type=checkbox id="aeroCranks">
    </div>

    <table id="instantaneousInput" colspan="2">
      <tr>
        <td class="h4" colspan="4">Environment</td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp</td>
        <td class="h4" colspan="2">Riding Style</td>
      </tr>
      <tr>
        <td>Riding Surface</td>
        <td class="inputText align="right">
          <select id="surfaceType">`;
            for (const s in surface) {
              selectedText = '';
              if (s == 'rough') selectedText = ` selected`;
              HTMLOut += `           <option${selectedText}>${surfaceText[surface[s]]}</option>`;
            };
            HTMLOut += `
          </select>
        </td>
        <td>Air Temperature</td>
        <td><input maxLength=5 size=6 value=25 id="T"> &#x00b0;C</td>
        <td></td>
        <td>Riding Position</td>
        <td>
          <select size=1 id="riderPosition">`;
            selectedText = ` selected`;
            riderPosText.forEach(riderPos => {
              HTMLOut += `           <option${selectedText}>${riderPos}</option>`;
              selectedText = '';
            });
          HTMLOut += `
          </select>
        </td>
      </tr>
      <tr>
        <td>Get Tyre Pressures For Wet Conditions ?</td>
        <td><input type=checkbox checked id="chkRain"></td>
        <td>Height above SeaLevel</td>
        <td><input maxLength=5 size=6 value=0 id="Hn"> m</td>
        <td></td>
        <td>Drafting Position</td>
        <td>
          <select size=1 id="draftPos">`;
            selectedText = ` selected`;
            draftPosText.forEach(draftPos => {
              HTMLOut += `           <option${selectedText}>${draftPos}</option>`;
              selectedText = '';
            });
          HTMLOut += `
          </select>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Slope of Road</td>
        <td><input maxLength=5 size=6 value=0 id="grade"> %</td>
        <td></td>
        <td>Front Chainring</td>
        <td><input size="6" class="gearing" value="34-50" id="frontChainring" readonly /></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td colSpan=2><small>(uphill&nbsp;is&nbsp;a&nbsp;positive&nbsp;slope,&nbsp;downhill&nbsp;is&nbsp;a&nbsp;negative&nbsp;slope)</small></td>
        <td></td>
        <td>Rear Cassette</td>
        <td><input size="30" class="gearing" value="11-12-13-14-15-16-17-19-21-24-27-30" id="rearCassette" readonly /></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Cadence</td>
        <td><input maxLength=5 size=6 value=90 id="cadence"> rpm</td>
        <td></td>
        <td>Optimum Front Tyre Pressure</td>
        <td><input size="3" class="gearing" id="frontTyrePressure" readonly />PSI&nbsp;<small>(add 2 or 3 PSI if using clinchers and tubes)</small></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td>Wind Speed</td>
        <td><input maxLength=5 size=6 value=0 id="vWind"> km/h</td>
        <td></td>
        <td>Optimum Rear Tyre Pressure</td>
        <td><input size="3" class="gearing" id="rearTyrePressure" readonly />PSI&nbsp;<small>(add 2 or 3 PSI if using clinchers and tubes)</small></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td colSpan=2><small>(tailwind&nbsp;is&nbsp;a&nbsp;positive&nbsp;speed,&nbsp;headwind&nbsp;is&nbsp;a&nbsp;negative&nbsp;speed)</small></td>
      </tr>
    </table>
    `;
  el('inputBlock').innerHTML = HTMLOut;
  //
  //-----------------------------------------------------------------------
  // Populate the passed BikeClass object from the bike fields on the 
  // left hand side of the page
  window.populateBikeObject = (b) => { // Make this function global because we use it in the rideCalcs.js module
    b.name = el('bikeName').innerText;
    b.bike_type = el('bikeType').selectedIndex;
    b.bike_weight = readInput('mBike');

    let foundKey;
    for (const key in wheel) {
      if (wheel[key] === el('frontWheel').selectedIndex) {
        foundKey = key;
        break; // Stop at the first match
      }
    }
    b.front_wheel_type = foundKey;

    for (const key in wheel) {
      if (wheel[key] === el('rearWheel').selectedIndex) {
        foundKey = key;
        break; // Stop at the first match
      }
    }
    b.rear_wheel_type = foundKey;

    for (const key in tyre) {
      if (tyre[key] === el('frontTyre').selectedIndex) {
        foundKey = key;
        break; // Stop at the first match
      }
    }
    b.front_tyre_type = foundKey;

    for (const key in tyre) {
      if (tyre[key] === el('rearTyre').selectedIndex) {
        foundKey = key;
        break; // Stop at the first match
      }
    }
    b.rear_tyre_type = foundKey;

    if (el('eBike').checked) {
      b.ebike = { on: true,
        // Assist levels
        0: { assist_level: 0, speed_limit: 30/3.6, power: 30 },
        1: { assist_level: 1, speed_limit: 25/3.6, power: 250 * 0.12 },
        2: { assist_level: 2, speed_limit: 25/3.6, power: 250 * 0.30 },
        3: { assist_level: 3, speed_limit: 25/3.6, power: 250 * 0.75 }
      }

    } else {
      delete b.ebike;
    };
    b.front_chainring = el('frontChainring').value.split('-').map(Number);
    b.rear_cassette = el('rearCassette').value.split('-').map(Number);
    b.aFrame = el('aeroFrame').checked;
    b.aHelmet = el('aeroHelmet').checked;
    b.aSuit = el('skinsuit').checked;
    b.aBars = el('aeroBars').checked;
    b.aCranks = el('aeroCranks').checked;
    b.air_temp = readInput("T");
    b.height_above_sea_level = readInput("Hn");
    b.slope = Math.atan(readInput("grade") * 0.01); 
    b.wind_speed = readInput("vWind");

    b.riding_position = el("riderPosition").selectedIndex;
    b.drafting_position = el("draftPos").selectedIndex;
    b.cadence = readInput("cadence");

    b.surface_type = el('surfaceType').options[el('surfaceType').selectedIndex].text.toLowerCase();
    b.wet_calc = el('chkRain').checked;

    b.rider_height = readInput('hRider')/100;
    b.rider_weight = readInput('mRider');
    b.rider_age = readInput('rAge');

  }; // window.populateBikeObject = (b) => {
  populateBikeObject(bikeData);

  //
  //-----------------------------------------------------------------------
  // Populate the passed RiderClass object from the rider fields on the 
  // right hand side of the page
  window.populateRiderObject = (r) => { // Make this function global because we use it in the rideCalcs.js module
    r.name = el('riderName').innerText;
    r.height = readInput('hRider')/100;
    r.weight = readInput('mRider');
    r.age = readInput('rAge');
    r.resting_heart_rate = readInput('rRHR');
    r.maximum_heart_rate = readInput('rMHR');
    r.gender = el('gender0').checked ? 'male' : 'female';
  }; // window.populateRiderObject = (r) => {
  populateRiderObject(riderData);
  //
  //-------------------------------------------------------------------------
  //
  //
  const populateTyrePressureFields = () => {
    let r = bikeData.tyrePressureCalc();
    el('frontTyrePressure').value = parseInt(r.front + 0.5);
    el('rearTyrePressure').value = parseInt(r.rear + 0.5);
  }; // populateTyrePressureFields = () => {
  populateTyrePressureFields();

  //
  //-------------------------------------------------------------------------
  //
  //
  el('riderSelection').addEventListener('change', (event) => {
    //
    //-----------------------------------------------------------------------
    // Populate the rider fields on the right hand side of the page and the 
    // sticky summary at the bottom of the page from the passed RiderClass
    // object
    const populateRiderForm = (r) => {
      el('riderName').innerText = r.name;
      el('hRider').value = r.height * 100;
      el('mRider').value = r.weight;
      el('rAge').value = r.age;
      el('rRHR').value = r.resting_heart_rate;
      el('rMHR').value = r.maximum_heart_rate;
      if (r.gender == 'male') {
        el('gender0').checked = true;
      } else {
        el('gender1').checked = true;
      };
      el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> ${r.name} ${r.weight} kg <span class='heading'>BMI</span> ${parseInt(r.weight/(r.height * r.height) * 10)/10} `;
    }; // const populateRiderForm = (r) => {

    switch (el('riderSelection').value) {
      case 'mike' : {
        mike.copyLactateTo(riderData);
        populateRiderForm(riderData);
        break;
      };
      case 'don' : {
        don.copyLactateTo(riderData);
        populateRiderForm(riderData);
        break;
      };
    };

    if (typeof bikeData !== 'undefined') {
      if (typeof rideData !== 'undefined' && !isNaN(rideData[0].startTime)) {
        el('btnAnalyse').disabled = false;
        if (!bikeData?.ebike?.on || bikeData.ebike.on == false) {
          el('btnWhatIf').disabled = false;
          if (el('riderSelection').value == 'mike') {
            el('btnValidate').disabled = false;
          }
        }
      };
      bikeData.rider_age = riderData.age;
      bikeData.rider_height = riderData.height;
      bikeData.rider_weight = riderData.weight;
    };
    doInstantaneousCalcs();
  }); // el('riderSelection').addEventListener('change', (event) => {
  //
  //-------------------------------------------------------------------------
  //
  //
  el('bikeSelection').addEventListener('change', (event) => {
    //
    //-----------------------------------------------------------------------
    // Populate the bike fields on the right hand side of the page and the 
    // sticky summary at the bottom of the page
    const populateBikeFields = (b) => {
      el('bikeName').innerText = b.name;
      el('bikeType').selectedIndex = b.bike_type;
      el('mBike').value = b.bike_weight;
      el('frontWheel').selectedIndex = wheel[b.front_wheel_type];
      el('rearWheel').selectedIndex = wheel[b.rear_wheel_type];
      el('frontTyre').selectedIndex = tyre[b.front_tyre_type];
      el('rearTyre').selectedIndex = tyre[b.rear_tyre_type];
      el('eBike').checked = !(!b?.ebike?.on || b.ebike.on == false);
      el('frontChainring').value = b.front_chainring
        .slice() // Create a shallow copy of the array to avoid mutating the original array
        .sort((a, b) => a - b) // Sort numbers in ascending order
        .join('-');

      el('rearCassette').value = b.rear_cassette
        .slice() // Create a shallow copy of the array to avoid mutating the original array
        .sort((a, b) => a - b) // Sort numbers in ascending order
        .join('-');

      for (let i = 0; i < el('surfaceType').options.length; i++) {
        if (el('surfaceType').options[i].text.toLowerCase() === b.surface_type) {
          // Set the selectedIndex to the index of the matching option
          el('surfaceType').selectedIndex = i;
          break; // Stop once we've found and selected the desired option
        }
      }

      el('chkRain').checked = b.wet_calc;
    }; // const populateBikeFields = (b) => {

    switch (el('bikeSelection').value) {
      case 'baumCorretto' : {
        copyBikeObject(baumCoretto, bikeData);
        populateBikeFields(bikeData);
        populateTyrePressureFields();
        break;
      };
      case 'scottSpeedster' : {
        copyBikeObject(scottSpeedster, bikeData);
        populateBikeFields(bikeData);
        populateTyrePressureFields();
        break;
      };
      case 'trekDomane' : {
        copyBikeObject(trekDomane, bikeData);
        populateBikeFields(bikeData);
        populateTyrePressureFields();
        break;
      };
      case 'trekDomaneRaw' : {
        copyBikeObject(trekDomaneRaw, bikeData);
        populateBikeFields(bikeData);
        populateTyrePressureFields();
        break;
      };
      case 'donTrekDomane' : {
        copyBikeObject(donTrekDomane, bikeData);
        populateBikeFields(bikeData);
        populateTyrePressureFields();
        break;
      };
    };

    let ebikeText = '';
    if (bikeData.ebike.on == true) ebikeText = ' e-bike';

    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> ${bikeData.name} ${bikeData.bike_weight}kg${ebikeText} `;

    if (typeof riderData !== 'undefined') {
      /*
      if (typeof rideData !== 'undefined' && !isNaN(rideData[0].startTime)) {
        el('btnAnalyse').disabled = false;
        if (!bikeData?.ebike?.on || bikeData.ebike.on == false) {
          el('btnWhatIf').disabled = false;
          if (el('riderSelection').value == 'mike') {
            el('btnValidate').disabled = false;
          }
        }
      };
      */
      bikeData.rider_age = riderData.age;
      bikeData.rider_height = riderData.height;
      bikeData.rider_weight = riderData.weight;
    };
    doInstantaneousCalcs();
  }); // el('bikeSelection').addEventListener('change', (event) => {

  //---------------------------------------------------------------------------
  // Bike Stuff
  //---------------------------------------------------------------------------
  el('bikeType').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;

    // Load default mass
    el('mBike').value = defaultBikeMass[el('bikeType').selectedIndex];

    // Load default tyres and wheels for the various bikes 
    switch (el('bikeType').selectedIndex) {

      // Bikes with road style wheels and tyres
      case bikeType.road:
      case bikeType.road_ebike:
      case bikeType.tandem:
      case bikeType.gravel:
        el('frontWheel').selectedIndex = wheel['36_spoke'];
        el('rearWheel').selectedIndex = wheel['36_spoke'];
        el('frontTyre').selectedIndex = tyre['training'];
        el('rearTyre').selectedIndex = tyre['training'];
        break;

      // Bikes with MTB style wheels and tyres
      case bikeType.ebike:
        el('frontWheel').selectedIndex = wheel['27.5"_mtb'];
        el('rearWheel').selectedIndex = wheel['27.5"_mtb'];
        el('frontTyre').selectedIndex = tyre['2.5"_mtb_slick'];
        el('rearTyre').selectedIndex = tyre['2.5"_mtb_slick'];
        break;
      case bikeType.mtb_cross_country:
      case bikeType.mtb_trail:
      case bikeType.mtb_enduro:
      case bikeType.mtb_downhill:
      default:
        el('frontWheel').selectedIndex = wheel['29"_mtb'];
        el('rearWheel').selectedIndex = wheel['29"_mtb'];
        el('frontTyre').selectedIndex = tyre['2.5"_mtb_knobbly'];
        el('rearTyre').selectedIndex = tyre['2.5"_mtb_knobbly'];
    };

    // Load default tyres and wheels for the various bikes 
    // bikes for the road or bush, 
    switch (el('bikeType').selectedIndex) {

      // Bikes for gravel
      case bikeType.gravel:
        el('surfaceType').selectedIndex = surface['gravel'];
        break;

      // Bikes for the bush
      case bikeType.mtb_cross_country:
      case bikeType.mtb_trail:
      case bikeType.mtb_enduro:
      case bikeType.mtb_downhill:
        el('surfaceType').selectedIndex = surface['bush'];
        break;

      // Bikes for a rough road surface
      case bikeType.road:
      case bikeType.road_ebike:
      case bikeType.tandem:
      case bikeType.ebike:
      default:
        el('surfaceType').selectedIndex = surface['rough'];
    };

    // Corect for an e-bike (or not)
    switch (el('bikeType').selectedIndex) {

      case bikeType.road_ebike:
      case bikeType.ebike:
        el('eBike').checked = true;
        bikeData.ebike = { on: true,
          // Assist levels
          0: { assist_level: 0, speed_limit: 30/3.6, power: 30 },  // Because the bike puts out 30 W anyway to 30 km/hr
          1: { assist_level: 1, speed_limit: 25/3.6, power: 250 * 0.12 },
          2: { assist_level: 2, speed_limit: 25/3.6, power: 250 * 0.30 },
          3: { assist_level: 3, speed_limit: 25/3.6, power: 250 * 0.75 }
        }
        break;

      default:
        el('eBike').checked = false;
        bikeData.ebike = { on: false };
    };


    // Update the objects that need to be changed
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('bikeType').addEventListener('change', (event) => {

  el('mBike').addEventListener('change', (event) => {
    let mass = readInput('mBike');
    if ((mass < 6.8) || (mass > 40)) {
      el('mBike').value = mass < 6.8 ? 6.8 : 40;
    };

    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('mBike').addEventListener('change', (event) => {

  el('frontWheel').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('frontWheel').addEventListener('change', (event) => {

  el('rearWheel').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('rearWheel').addEventListener('change', (event) => {

  el('frontTyre').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('frontTyre').addEventListener('change', (event) => {

  el('rearTyre').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('rearTyre').addEventListener('change', (event) => {

  el('eBike').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    doInstantaneousCalcs();
  }); // el('eBike').addEventListener('change', (event) => {

  el('aeroFrame').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    doInstantaneousCalcs();
  }); // el('aeroFrame').addEventListener('change', (event) => {

  el('aeroHelmet').addEventListener('change', (event) => {
    bikeData.aHelmet = el('aeroHelmet').checked;
    doInstantaneousCalcs();
  }); // el('aeroHelmet').addEventListener('change', (event) => {

  el('skinsuit').addEventListener('change', (event) => {
    bikeData.aSuit = el('skinsuit').checked;
    doInstantaneousCalcs();
  }); // el('skinsuit').addEventListener('change', (event) => {

  el('aeroBars').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    doInstantaneousCalcs();
  }); // el('aeroBars').addEventListener('change', (event) => {

  el('aeroCranks').addEventListener('change', (event) => {
    el('bikeName').innerText = 'Custom Bike';
    el('bikeSelection').selectedIndex = 0;
    el('bikeInfo').innerHTML = `<span class='heading'>BIKE</span> Custom `;
    populateBikeObject(bikeData);
    doInstantaneousCalcs();
  }); // el('aeroCranks').addEventListener('change', (event) => {

  //---------------------------------------------------------------------------
  // Rider Stuff
  //---------------------------------------------------------------------------
  el('hRider').addEventListener('change', (event) => {
    let height = readInput('hRider');
    if ((height < 120) || (height > 250)) {
      height = 175;
      el('hRider').value = height;
    };
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    populateRiderObject(riderData);
    bikeData.rider_height = riderData.height;
    doInstantaneousCalcs();
  }); // el('hRider').addEventListener('change', (event) => {

  el('mRider').addEventListener('change', (event) => {
    let mass = readInput('mRider');
    if ((mass < 40) || (mass > 150)) {
      mass = 75;
      el('mRider').value = mass;
    };
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    populateRiderObject(riderData);
    bikeData.rider_weight = riderData.weight;
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('mRider').addEventListener('change', (event) => {

  el('rAge').addEventListener('change', (event) => {
    let age = readInput('rAge');
    if ((age < 5) || (age > 100)) {
      age = 38;
      el('rAge').value = age;
    };
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    el('rMHR').value = riderData.getMHR(age, riderData.gender);
    populateRiderObject(riderData);
    bikeData.rider_age = riderData.age;
  }); // el('rAge').addEventListener('change', (event) => {

  el('rRHR').addEventListener('change', (event) => {
    let rhr = readInput('rRHR');
    if ((rhr < 40) || (rhr > 80)) {
      rhr = 60;
      el('rRHR').value = rhr;
    };
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    populateRiderObject(riderData);
    doInstantaneousCalcs();
  }); // el('rRHR').addEventListener('change', (event) => {

  el('rMHR').addEventListener('change', (event) => {
    let mhr = el('rMHR').value;
    if ((mhr < 130) || (mhr > 210)) {
      mhr = riderData.getMHR(riderData.age, riderData.gender);
      el('rMHR').value = mhr;
    };
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    populateRiderObject(riderData);
    doInstantaneousCalcs();
  }); // el('rMHR').addEventListener('change', (event) => {

  el('gender0').addEventListener('change', (event) => {
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    riderData.gender = 'male';
    el('rMHR').value = riderData.getMHR(riderData.age, riderData.gender);
    populateRiderObject(riderData);
    doInstantaneousCalcs();
  }); // el('gender0').addEventListener('change', (event) => {

  el('gender1').addEventListener('change', (event) => {
    el('riderName').innerText = 'Custom Rider';
    el('riderSelection').selectedIndex = 0;
    el('riderInfo').innerHTML = `<span class='heading'>RIDER</span> Custom `;
    riderData.gender = 'female';
    el('rMHR').value = riderData.getMHR(riderData.age, riderData.gender);
    populateRiderObject(riderData);
    doInstantaneousCalcs();
  }); // el('gender1').addEventListener('change', (event) => {

  //---------------------------------------------------------------------------
  // Environment Stuff
  //---------------------------------------------------------------------------
  el('surfaceType').addEventListener('change', (event) => {
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('surfaceType').addEventListener('change', (event) => {

  el('chkRain').addEventListener('change', (event) => {
    bikeData.wet_calc = el('chkRain').checked;
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('chkRain').addEventListener('change', (event) => {

  el('T').addEventListener('change', (event) => {
    bikeData.air_temp = readInput("T");
    if ((bikeData.air_temp < 0) || (bikeData.air_temp > 45)) {
      bikeData.air_temp = 20;
      el('T').value = bikeData.air_temp;
    };
    doInstantaneousCalcs();
  }); // el('T').addEventListener('change', (event) => {

  el('Hn').addEventListener('change', (event) => {
    bikeData.height_above_sea_level = readInput("Hn");
    doInstantaneousCalcs();
  }); // el('Hn').addEventListener('change', (event) => {

  el('grade').addEventListener('change', (event) => {
    let grade = readInput("grade");
    if (grade < -30 || grade > 30) {
      let sign = grade < 0 ? -1 : 1;
      el('grade').value = 30 * sign;
    };
    bikeData.slope = Math.atan(readInput("grade") * 0.01); 
    doInstantaneousCalcs();
  }); // el('grade').addEventListener('change', (event) => {

  el('vWind').addEventListener('change', (event) => {
    bikeData.wind_speed = readInput("vWind");
    if ((bikeData.wind_speed < -50) || (bikeData.wind_speed > 50)) {
      let sign = bikeData.wind_speed < 0 ? -1 : 1;
      bikeData.wind_speed =  50 * sign;
      el('vWind').value = bikeData.wind_speed;
    };
    doInstantaneousCalcs();
  }); // el('vWind').addEventListener('change', (event) => {

  //---------------------------------------------------------------------------
  // Riding Style Stuff
  //---------------------------------------------------------------------------
  el('riderPosition').addEventListener('change', (event) => {
    bikeData.riding_position = el("riderPosition").selectedIndex;
    populateBikeObject(bikeData);
    populateTyrePressureFields();
    doInstantaneousCalcs();
  }); // el('riderPosition').addEventListener('change', (event) => {

  el('draftPos').addEventListener('change', (event) => {
    bikeData.drafting_position = el("draftPos").selectedIndex;
    doInstantaneousCalcs();
  }); // el('draftPos').addEventListener('change', (event) => {

  el('cadence').addEventListener('change', (event) => {
    bikeData.cadence = readInput("cadence");
    doInstantaneousCalcs();
  }); // el('cadence').addEventListener('change', (event) => {

}); // window.addEventListener('load', (event) => { 


//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------


