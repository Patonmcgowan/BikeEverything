/*
  cubic.js

  Functions used to perform solve cubic equations using Cardano's formula
  ------------------------------------------------------------------------------

  Revision History
  ================
  01 Oct 2007 MDS Original
  22 Mar 2020 MDS Minor formatting changes

  ------------------------------------------------------------------------------
 */


//
//-----------------------------------------------------------------------------
// Solve a cubic of the form ay^3 + by^2 +cy +d = 0 using Cardano's formula
// At present, only the first real solution is found (since this routine is presently
// only used to calculate bike velocity from power)
//
function cubicInit(c) {
  c.a = 0;
  c.b = 0;
  c.c = 0;
  c.d = 0;
  c.y1 = 0;
  c.y2 = 0;
  c.y3 = 0;
  return;
}
//
//-----------------------------------------------------------------------------
//
//
function cubicSolve(c) {
  c.y1='???';
  c.y2='???';
  c.y3='???';
  
  // Reduce to x^3 + a2x^2 + a1x + a0 = 0
  var a2 = c.b/c.a;
  var a1 = c.c/c.a;
  var a0 = c.d/c.a;
  
  // Now solve using Cardano's formula
  var Q = (3 * a1 - (a2 * a2))/9;
  var R = (9 * a2 * a1 - 27 * a0 - 2 * a2 * a2 *a2)/54;
  var D = Q * Q * Q + R * R;
  var S1 = R + Math.sqrt(D);
  var S = (S1>0)?Math.pow(S1, 1/3):-Math.pow(-S1, 1/3);
  var T1 = R - Math.sqrt(D);
  var T = (T1>0)?Math.pow(T1, 1/3):-Math.pow(-T1, 1/3);
  
  if (D < 0) {   // Three unique real roots
    theta = Math.acos(R / Math.sqrt(-Q * Q * Q));
    c.y1 = 2 * Math.sqrt(-Q) * Math.cos(theta / 3) - a2/3;
    c.y2 = 2 * Math.sqrt(-Q) * Math.cos((theta + 2 * Math.PI) / 3) - a2/3;
    c.y3 = 2 * Math.sqrt(-Q) * Math.cos((theta + 4 * Math.PI) / 3) - a2/3;
  } else if (D == 0) {   // Three real roots (two of the roots are the same)
    c.y1 = (S + T) - (a2/3);
    c.y2 = -(S+T)/2 - (a2/3);
    c.y3 = -(S+T)/2 - (a2/3);
  } else {   // D > 0.  One real and two complex roots
    c.y1 = (S + T) - (a2/3);
    // y2 and y3 results are complex numbers
  }
  return;
}
//
//-----------------------------------------------------------------------------
//                               End of file
//-----------------------------------------------------------------------------
//

