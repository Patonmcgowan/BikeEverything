//
// generalFunctions.js
// 
// Provides the main logic to tie the bits of the app together
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

/*


****************************************************************

Need to bring in utilities for show(), hide(), el() - check EEHA app for others



*/

// Globals from original speedPowerCalc
var ie4 = false; if(document.all) { ie4 = true; }



// Put these in the global scope for now so we can access them from the console
var myObject = {}; // Contains all of the accessible functions

// Private scoped IIFE function...
(() => {

  let myVariable = 3;
  const myConst = 'myVariable = ';

  //---------------------------------------------------------------------------
  // This is a private function
  const myFunction = () => {
    // Do stuff here - this has access to the variables insiode the IIFE 
    myVariable += 1;
    console.log(`${myConst}${myVariable} this time`)
  };

  //---------------------------------------------------------------------------
  // This is a public function - which accesses the private functions/variables/constants
  myObject.myFunction = () => {
    myFunction();
  };

  return;
})(); // Close private scoped IIFE function...

//---------------------------------------------------------------------------
// Global public functions
//---------------------------------------------------------------------------

//
//---------------------------------------------------------------------------
// Runs once the page has loaded
//
window.addEventListener('load', (event) => {   // Needs to be async while we have the dodgy fudge at the end to bypass site plant etc selection


}); // window.addEventListener('load', async (event)
//
//-----------------------------------------------------------------------------
//
//
function write3DP(ref, F, color) {
  let y = '' + (Math.round(F * 1000) / 1000);
  let el = document.getElementById(ref);
  el.value = y;
  if (color!=null) outputColor(el, color);
  return 0;
}
//
//---------------------------------------------------------------------------
//
//
const el = (el) => {
  if (ie4) 
    return document.all[el]; 
  else 
    return document.getElementById(el);
} // el = (el)

//---------------------------------------------------------------------------
// Returns true if a value is a number (interger or floating point) or can be 
// converted to a number (integer or floating point)
//
// Test cases
//   console.log(isNumeric(42)); // true
//   console.log(isNumeric(3.14)); // true
//   console.log(isNumeric("42")); // true
//   console.log(isNumeric("3.14")); // true
//   console.log(isNumeric("foo")); // false
//
const isNumeric = (value, allowZeroes = false) => {
  if ((!allowZeroes) && (value == '')) return false; // By default, the next test will return true for a null string - but we want it to return false

  // Use typeof to check if the value is a number or a string that represents a number
  if (typeof value === 'number' || typeof value === 'string') {
    // Use isNaN to check if the value can be converted to a valid number
    return !isNaN(value);
  }

  return false;
} // isNumeric = (value)
//
//---------------------------------------------------------------------------
// Shows an eleemnt
//
//
const show = (e, style='block') => {
  try {
    document.getElementById(e).style.display = style;
  } catch (e) {
    console.log(e);
  }
} // show = (e)
//
//---------------------------------------------------------------------------
// Hides an element
//
//
const hide = (e) => {
  try {
    document.getElementById(e).style.display = 'none';
  } catch (e) {
    console.log(e);
  }
} // hide = (e)
//
//-----------------------------------------------------------------------------
//
//
const secToHHMM = (s) => {
  let h = Math.round((s/3600)-0.5);
  let s1 = s-(h*3600);
  let m = Math.round((s1/60));
  let mStr = (h>0)?((m<10)?'0'+m+'m':m+'m'):m+'m';
  let hStr = (h>0)?h+'h ':'';
  return(hStr+mStr);
} //  secToHHMM(s) {
//
//---------------------------------------------------------------------------
// Add a tooltip on mouseover.  This only needs the following CSS to work:
//
//   .tooltip .tooltiptext {
//     visibility: hidden;
//     background-color: #555;
//     color: #fff;
//     text-align: center;
//     padding: 5px;
//     border-radius: 5px;
//     position: absolute;
//     z-index: 1;
//  }
//
const addToolTip = (targetElementId, tooltipText) => {
  const targetElement = el(targetElementId);
  targetElement.classList.add("tooltip");

  let tooltipSpan = document.createElement("span");
  tooltipSpan.classList.add("tooltiptext");
  tooltipSpan.textContent = tooltipText;

  // Append the tooltip span to the target element
  targetElement.appendChild(tooltipSpan);

  // Calculate and set the tooltip position dynamically
  targetElement.addEventListener('mouseenter', () => {
    const rect = targetElement.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // Account for a viewport where the viewport does not take up the whole page (ie scrollbars are present)
    let tooltipTop = rect.top + scrollTop - tooltipSpan.offsetHeight;
    // let tooltipLeft = rect.left + scrollLeft + (rect.width / 2) - (tooltipSpan.offsetWidth / 2);
    let tooltipLeft = rect.left + scrollLeft + 5;

    // Ensure the tooltip does not go off the top of the viewport
    if (tooltipTop < scrollTop) {
      tooltipTop = rect.bottom + scrollTop; // Position the tooltip below the element
    }

    // Ensure the tooltip does not go off the sides of the viewport
    if (tooltipLeft < scrollLeft) {
      tooltipLeft = scrollLeft;
    } else if (tooltipLeft + tooltipSpan.offsetWidth > window.innerWidth + scrollLeft) {
      tooltipLeft = window.innerWidth + scrollLeft - tooltipSpan.offsetWidth;
    }

    tooltipSpan.style.top = `${tooltipTop}px`;
    tooltipSpan.style.left = `${tooltipLeft}px`;
    tooltipSpan.style.visibility = 'visible';
    tooltipSpan.style.opacity = '1';
  });

  targetElement.addEventListener('mouseleave', () => {
    tooltipSpan.style.visibility = 'hidden';
    tooltipSpan.style.opacity = '0';
  });
}; // addToolTip = (targetElementId, tooltipText) => {

//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------




