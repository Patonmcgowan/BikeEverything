//
// makeRideHTML.js
// 
// Writes the html for a ride input and output
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

window.addEventListener('load', (event) => { 

  const STAGES = 20;

  // Build the start of the ride calc table and the headers for the input area
  let HTMLOut = `
      <table>
        <tr>
          <!-- start of input area -->
          <td>
            <table>
              <tr>
                <td></td>
                <td class='h1'>Temp</td>
                <td class='h1'>Altitude</td>
                <td class='h1'>Slope</td>
                <td class='h1'>Cadence</td>
                <td class='h1'>Wind</td>
                <td class='h1'>Riding</td>
                <td class='h1'>Drafting</td>
                <td class='h1'>Leg</td>
              </tr>
              <tr>
                <td></td>
                <td class='h1'>&#x00b0;C</td>
                <td class='h1'>m</td>
                <td class='h1'>%</td>
                <td class='h1'>RPM</td>
                <td class='h1'>Speed</td>
                <td class='h1'>Posn</td>
                <td class='h1'>Posn</td>
                <td class='h1'>Distance</td>
              </tr>

              <tr>
                <td></td>
                <td colspan="7"><small>(uphill&nbsp;is&nbsp;a&nbsp;positive&nbsp;slope,&nbsp;downhill&nbsp;is&nbsp;a&nbsp;negative&nbsp;slope)<br />
                  (tailwind&nbsp;is&nbsp;a&nbsp;positive&nbsp;speed,&nbsp;headwind&nbsp;is&nbsp;a&nbsp;negative&nbsp;speed)</small>
                </td>
                <td class="h1">km</td>
              </tr>
    `;

    let displayStyle = '';
    let selectedText;
    // Build the ride input blocks
    for (let i = 1; i <= STAGES; i++) {
      if (i > 5) 
        displayStyle = ' style="display:none";';
      HTMLOut += `
              <tr id="ISTAGE${i}"${displayStyle}>
                <td>${i}.</td>
                <td><input maxLength=4 size="4" class="input" value=25 id="S${i}T"></td>
                <td><input maxLength=5 size="6" class="input" value=0 id="S${i}H"></td>
                <td><input maxLength=4 size="5" class="input" value=0 id="S${i}Grade"></td>
                <td><input maxLength=3 size="4" class="input" value=90 id="S${i}Cadence"></td>
                <td><input maxLength=4 size="5" class="input" value=0.0 id="S${i}W"></td>
                <td>
                  <select id="S${i}Pos">`;
                    selectedText = ` selected`;
                    riderPosText.forEach(riderPos => {
                      HTMLOut += `           <option${selectedText}>${riderPos}</option>`;
                      selectedText = '';
                    });
                  HTMLOut += `
                  </select>
                </td>
                <td>
                  <select id="S${i}Draft">`;
                    selectedText = ` selected`;
                    draftPosText.forEach(draftPos => {
                      HTMLOut += `           <option${selectedText}>${draftPos}</option>`;
                      selectedText = '';
                    });
                  HTMLOut += `
                  </select>
                </td>
               <td><input maxLength=5 size="6" class="input" value=5.0 id="S${i}Dist"></td>
              </tr>`;
    }
    // Finish input area
    HTMLOut += `
            </table>
          </td>`;

    // Do the headers for the output area
    HTMLOut += `
          <td>
            <table class="rideBlock output">
              <tr>
                <td class='h1'>Power</td>
                <td class='h1'>Speed</td>
                <td class='h1'>Leg</td>
                <td class='h1'>Leg</td>
                <td class='h1'>Leg</td>
              </tr>
              <tr>
                <td class='h1'>Output</td>
                <td class='h1'>km/hr</td>
                <td class='h1'>kJ</td>
                <td class='h1'>cal</td>
                <td class='h1'>Time</td>
              </tr>
              <tr>
                <td class='h1'>Watts</td>
                <td></td>
                <td><small>&nbsp;<br />&nbsp;</small></td> <!-- this aligns table halves -->
                <td></td>
                <td></td>
              </tr>`;

    // Build the ride output blocks 
    displayStyle = '';
    for (let i = 1; i <= STAGES; i++) {
      if (i > 5) 
        displayStyle = ' style="display:none";';
      HTMLOut += `
             <tr id=OSTAGE${i}${displayStyle}>
                <td><input maxLength=5 size="6" id="S${i}Power" readonly></td>
                <td><input maxLength=5 size="6" id="S${i}Speed" readonly></td>
                <td><input maxLength=5 size="6" id="S${i}kJ" readonly></td>
                <td><input maxLength=5 size="6" id="S${i}cal" readonly></td>
                <td><input maxLength=5 size="6" id="S${i}Time" readonly></td>
              </tr>`;
    };
    // Now build the bottom of the table  and clean up
    HTMLOut += `
          </table>
          </td>
        </tr>
        <tr>
          <td align="right" colspan=2 width=100%>
            <button type='button' class="myLink" onclick="addLeg(5)">Add 5 Legs</button>
            <button type='button' class="myLink" onclick="addLeg(1)">Add Leg</button>
            <button type='button' class="myLink" onclick="deleteLeg(1)">Delete Leg</button>
            <button type='button' class="myLink" onclick="deleteLeg(5)">Delete 5 Legs</button>
            <button type='button' class="myLink" onclick="doRideCalcs()">Calculate</button>
          </td>
        </tr>
      </table>
    `;
  el('rideInputBlock').innerHTML = HTMLOut;

  el('rideOutputBlock').innerHTML = `
      <table align="center" valign="top">
        <tr>
          <td>Total Distance</td>
          <td><input size="7" id="KMTOT" readonly> km</td>
          <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
          <td>Vertical Metres Climbed</td>
          <td><input size="7" id="MTOT" readonly> m</td>
          <td></td>
        </tr>
        <tr>
          <td>Maximum Speed</td>
          <td><input size="7" id="RVMAX" readonly> km/hr</td>
          <td></td>
          <td>Average Speed</td>
          <td><input size="7" id="RVAVG" readonly> km/hr</td>
          <td></td>
        </tr>
        <tr>
          <td>Total Ride Time</td>
          <td><input size="7" id="RIDETIME" readonly></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>Average Energy Output</td>
          <td><input size="7" id="RkJouthr" readonly> kJ/hr</td>
          <td></td>
          <td>Average Energy Output</td>
          <td><input size="7" id="Rcalouthr" readonly> cal/hr</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="6">
            <hr />
          </td>
        </tr>
        <tr>
          <td>Ride Kilojoules Metabolised</td>
          <td><input size="7" id="RkJhr" readonly> kJ/hr</td>
          <td></td>
          <td>Ride Calories Metabolised</td>
          <td><input size="7" id="RCalhr" readonly> cal/hr</td>
          <td></td>
        </tr>
        <tr>
          <td>BMR Kilojoules Metabolised</td>
          <td><input size="7" id="RBMRkJhr" readonly> kJ/hr</td>
          <td></td>
          <td>BMR Calories Metabolised</td>
          <td><input size="7" id="RBMRCalhr" readonly> cal/hr</td>
          <td></td>
        </tr>
        <tr>
          <td>Equivalent Body Fat</td>
          <td><input size="7" id="Rfathr" readonly> g/hr</td>
          <td></td>
        </tr>
        <tr>
          <td>Total Energy Intake Required</td>
          <td><input size="7" id="RkJ" readonly> kJ</td>
          <td></td>
          <td>Total Energy Intake Required</td>
          <td><input size="7" id="RCal" readonly> cal</td>
          <td></td>
        </tr>
        <tr>
          <td>Equivalent Body Fat</td>
          <td><input size="7" id="Rfat" readonly> g</td>
          <td></td>
        </tr>
        <tr>
          <td colspan=6 align="middle"><small>(Assuming a digestion energy conversion efficiency of 24%)</small></td>
        </tr>
        <tr>
          <td colspan=6>
            <hr />
          </td>
        </tr>
        <tr>
          <td>Total Gels Required</td>
          <td><input size="7" id="gels" readonly></td>
          <td></td>
          <td>Total Water Bottles Required</td>
          <td><input size="7" id="bottles" readonly></td>
          <td></td>
        </tr>
        <tr>
          <td colspan=5><small>(Assuming 1 gel to start and every 45 mins thereafter, and 1 water bottle per hour)</small></td>
        </tr>
      </table>
    `;

}); // window.addEventListener('load', (event) => { 


//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------


