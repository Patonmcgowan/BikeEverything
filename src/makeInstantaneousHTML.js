//
// makeInstantaneousHTML.js
// 
// Writes the html for a instantaneous power and speed calc
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

window.addEventListener('load', (event) => { 

  // Build the speed power input / output area
  let HTMLOut = `
    <div class="h3">Enter either Power or Speed and click "Calculate", and the other quantity will be calculated</div>
    <div align="center">
      Rider Power<input maxLength=6 size="7" id="P">Watts<button type='button' class="myLink" id="doInstantaneousCalcs">Calculate</button>Speed<input maxLength=6 size="7" id="vBike">km/hr
    </div>
    <div align="center"><span id="gearSelection">&nbsp;</span><br /><span id="hrResult"></span><br /><span id="lactateResult">id="lactateResult" (functionality not written yet)</span></div>
    <div align="right"><a href=#_ class="myLink" id="FD1" onclick='show("detailedOutput"); hide("FD1")'>More Results ...</a></div>
    `;

  el('instantaneousOutput').innerHTML = HTMLOut;

  // Build the detailed output area
  HTMLOut = `
    <table>
      <tr>
        <td class='h3' colspan="6">Detailed Results</td>
      </tr>
      <tr>
        <td>Effective Drag Coeff. Cd</td>
        <td><input size="7" id="Cd" readonly></td>
        <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
        <td>Rolling Resistance Coeff. Crr</td>
        <td><input size="7" id="Crr" readonly></td>
      </tr>
      <tr>
        <td>Bike Frontal Area</td>
        <td><input size="7" id="bFA" readonly> m<sup>2</sup></td>
        <td></td>
        <td>Rider Frontal Area</td>
        <td><input size="7" id="rFA" readonly> m<sup>2</sup></td>
      </tr>
      <tr>
        <td>Total Frontal Area</td>
        <td><input size="7" id="FA" readonly> m<sup>2</sup></td>
        <td></td>
        <td>Effective Drag Area Cd*A</td>
        <td><input size="7" id="CdA" readonly> m<sup>2</sup></td>
      </tr>
      <tr>
        <td>Rolling Losses</td>
        <td><input size="7" id="Proll" readonly> Watts</td>
        <td></td>
        <td>Wind Drag Losses</td>
        <td><input size="7" id="Pwind" readonly> Watts</td>
      </tr>
      <tr>
        <td>Climbing Losses</td>
        <td><input size="7" id="Pgrav" readonly> Watts</td>
        <td></td>
        <td>Frictional Losses</td>
        <td><input size="7" id="Pfrict" readonly> Watts</td>
      </tr>
      <tr>
        <td>Energy Output</td>
        <td><input size="7" id="kJouthr" readonly>kJ/hr</td>
        <td></td>
        <td>Energy Output</td>
        <td><input size="7" id="calouthr" readonly> cal/hr</td>
      </tr>
      <tr>
        <td colspan=6>
          <hr />
        </td>
      </tr>
      <tr>
        <td class='h3' colspan="6">Assuming a digestion / conversion efficiency of 24%...</td>
      </tr>
      <tr>
        <td>Ride Kilojoules Burnt</td>
        <td><input size="7" id="kJhr" readonly> kJ/hr</td>
        <td></td>
        <td>Ride Calories Burnt&nbsp;</td>
        <td><input size="7" id="Calhr" readonly> cal/hr<br /></td>
      </tr>
      <tr>
        <td>BMR Kilojoules Burnt</td>
        <td><input size="7" id="BMRkJhr" readonly> kJ/hr</td>
        <td></td>
        <td>BMR Calories Burnt</td>
        <td><input size="7" id="BMRCalhr" readonly> cal/hr<br /></td>
      </tr>
      <tr>
        <td>Total Kilojoules Burnt</td>
        <td><input size="7" id="TotkJhr" readonly> kJ/hr</td>
        <td></td>
        <td>Total Calories Burnt</td>
        <td><input size="7" id="TotCalhr" readonly> cal/hr<br /></td>
      </tr>
      <tr>
        <td>Equivalent Body Fat</td>
        <td><input size="7" id="fathr" readonly> g/hr</td>
        <td></td>
        <td>BMI</td>
        <td><input size="7" id="BMI" readonly></td>
        <td></td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
        <td colspan="3"><input size=33 id="BMIText" readonly></td>
      </tr>
    </table>
    <div align="right"><a href=#_ class="myLink" id="FD2" onclick='hide("detailedOutput"); show("FD1");'>Hide ...</a></div>
    `;
  el('detailedOutput').innerHTML = HTMLOut;
  //
  //---------------------------------------------------------------------------
  //
  //
  el("doInstantaneousCalcs").addEventListener("click", () => {
    doInstantaneousCalcs();
    });
  //
  //---------------------------------------------------------------------------
  //
  //
  el("P").addEventListener("click", function(){
      el("P").style.backgroundColor = "";
      el("vBike").style.backgroundColor = "var(--outputBackground)";
      el("vBike").value = '';
      lastPVEntry = POWER;
      // el("gearSelection").innerText = '';
    });
  //
  //---------------------------------------------------------------------------
  //
  //
  el("P").addEventListener("mousedown", function(){
      el("P").style.backgroundColor = "";
      el("vBike").style.backgroundColor = "var(--outputBackground)";
      el("vBike").value = '';
      lastPVEntry = POWER;
      // el("gearSelection").innerText = '';
  });
  //
  //---------------------------------------------------------------------------
  //
  //
  el('P').addEventListener('change', (event) => {
    if (lastPVEntry == POWER) {
      let P = readInput('P');
      if ((P < 0) || (P > 1000)) {
        P = 200;
        el('P').value = P;
      };
    };
  }); // el('P').addEventListener('change', (event) => {
  //
  //---------------------------------------------------------------------------
  //
  //
  el("vBike").addEventListener("click", function(){
      el("P").style.backgroundColor = "var(--outputBackground)";
      el("P").value = '';
      el("vBike").style.backgroundColor = "";
      lastPVEntry = SPEED;
      // el("gearSelection").innerText = '';
  });
  //
  //---------------------------------------------------------------------------
  //
  //
  el("vBike").addEventListener("mousedown", function(){
      el("P").style.backgroundColor = "var(--outputBackground)";
      el("P").value = '';
      el("vBike").style.backgroundColor = "";
      lastPVEntry = SPEED;
      // el("gearSelection").innerText = '';
  });
  //
  //---------------------------------------------------------------------------
  //
  //
  el('vBike').addEventListener('change', (event) => {
    if (lastPVEntry == SPEED) {
      let v = readInput('vBike');
      if ((v < 0) || (v > 100)) {
        v = 40;
        el('vBike').value = v;
      };
    };
  }); // el('vBike').addEventListener('change', (event) => {

}); // window.addEventListener('load', (event) => { 


//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------


