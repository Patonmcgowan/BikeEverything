
/*

Simplified Lactate Estimation Model
Here’s a simplified approach to estimate lactate levels:

Lactate Production Rate (LPR): The rate at which lactate is produced when your heart rate is above the LTHR.

  LPR = k x (HR - LTHR)

  where
    HR is heart rate
    LTHR lactate threshold heart rate (60%-70%) of MHR
    k is a constant that depends on your fitness level and exercise intensity. For a 60-year-old with reduced EF, a conservative estimate for k might be lower than for a healthy individual due to potentially lower exercise intensity.
    Start with an estimated value:
      k ≈ 0.05 mmol/L per bpm 
      
    This means for each bpm above LTHR, lactate increases by 0.05 mmol/L.

Lactate Clearance Rate (LCR): The rate at which lactate is cleared during recovery.

  LCR = c × (LTHR − HR)

  where 
    c is a constant that represents how quickly lactate is cleared from the bloodstream during recovery.  With reduced EF, clearance might be slower, so c would be lower.  
    Start with an estimated value:
      c ≈ 0.02 mmol/L per bpm
    
    This means for each bpm below LTHR, lactate decreases by 0.02 mmol/L.

Lactate Level (LL): The estimated lactate level at any given time.

  LL(t)=∫(LPR(t)−LCR(t))dt

For me,  
  Maximum heart rate MHR = 171 bpm 
  Resting heart rate restingHR = 60 bpm 
  Aerobic threshold AeT = 134 bpm
  Working heart rate WHR = 171 - 60 = 111 bpm
  Lactate threshold LTHR 
    Method 1: LTHR = restingHR + (80% - 90% × WHR) = 60 + 0.85 x 111 = 154 bpm
    Method 2: LTHR is 10% - 15% higher than AeT = 134 x 1.1 to 134 x 1.15 = 147 bpm to 154 bpm
 
(Notes made by me from somewhere: lactate flush is typically at 60% - 70% of MHR, and takes 15 - 20 min to happen

*/

  // Constants
  const AerT = 134; // Aerobic Threshold Heart Rate in bpm
  const LTHR = 154; // Lactate Threshold Heart Rate in bpm
  const restingHR = 60; // Resting Heart Rate in bpm
  const maxHR = 171; // Maximum Heart Rate in bpm
  const k = 0.05; // Lactate production rate constant (mmol/L per bpm above AerT)
  const c = 0.02; // Lactate clearance rate constant (mmol/L per bpm below LTHR)

  const startHR = 140; // example starting heart rate for lactate model
  const clearanceTime = 60;  // total time in minutes
  const lambda = 0.1; // decay constant for lactate clearance
  const clearanceRate = 0.05;  // rate of lactic acid clearance (MDS: was called mu)

  const startLactate = 1; // chatGPT: The typical lactate concentration in a person at rest is usually around 0.5 to 2.2 millimoles per liter (mmol/L). In most healthy individuals, resting lactate levels are closer to the lower end of this range, typically between 0.5 and 1.5 mmol/L.

  // Initial guesses for parameters
  let HR_an = 160;
  let RHR_drop = 20; // Rate of heart rate drop during recovery : HR(t) = HRan - RHR_drop * (1 - exp(- lambda * time)) - 
  let RHR_clear = 12; // How long to return to resting heart rate post exercise


  /*
  Ejection fraction of 45%
    Typical k = 0.03 to 0.06 mmol/L per bpm above AerT.
    Typical c = 0.03 to 0.06 mmol/L per bpm below LTHR.

  Ejection fraction of 60%
    Typical k = 0.015 to 0.03 mmol/L per bpm above AerT. (lower production because of more efficient pumping)
    Typical c = 0.04 to 0.08 mmol/L per bpm below LTHR. (higher clearance because of more efficient pumping)
  */
  const initialLactate = 1.0; // Initial lactate level in mmol/L
  const timeStep = 1; // Time step in minutes


// Function to simulate exercise
function simulateExercise(totalTime) {
  let time = 0;
  let lactateLevel = initialLactate; // Current lactate level in mmol/L
  let heartRate = AerT; // Initial heart rate in bpm

  while (time < totalTime) {
      // Simulate increase in heart rate towards AerT.. TODO - pass array of heart rate vs time
      heartRate = Math.min(AerT, heartRate + 1);

      // Calculate lactate production based on current heart rate
      let lactateProduction = calculateLactateProduction(heartRate);

      // Calculate lactate clearance based on current heart rate
      let lactateClearance = calculateLactateClearance(heartRate);

      // Update lactate level over time
      lactateLevel = Math.max(0, lactateLevel + lactateProduction * timeStep - lactateClearance * timeStep);

      // Log current status
      console.log(`Time: ${time} min, HR: ${heartRate} bpm, Lactate: ${lactateLevel.toFixed(2)} mmol/L`);

      // Increment time
      time += timeStep;
  }
}

// Function to calculate lactate production based on heart rate
// Above aerobic threshold, lactate is produced
function calculateLactateProduction(hr) {
    if (hr > AerT) {
        return k * (hr - AerT);
    }
    return 0;
}

// Function to calculate lactate clearance based on heart rate
// Below lactate threshold, lactate is cleared
function calculateLactateClearance(hr) {
    if (hr < LTHR) {
        return c * (LTHR - hr);
    }
    return 0;
}








      // Data for how quickly heart rate decays back to aerobic
      const time = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];  // time in minutes
      const heartRate = [160, 150, 145, 142, 140, 138, 136, 134, 132, 130, 128];  // recorded heart rate






    // Exponential decay function for heart rate to ATHR
    function recoveryFunc1(t, HR_an, RHR_drop, lambda) {
      return HR_an - RHR_drop * (1 - Math.exp(-lambda * t));
    }

    // Exponential decay function for heart rate below ATHR
    function recoveryFunc2(t, AerT, RHR_clear, clearanceRate) {
      return AerT - RHR_clear * (1 - Math.exp(-clearanceRate * t));
    }

    // Simple least squares optimization for Phase 1
    function optimizePhase1(time, heartRate, HR_an, RHR_drop, lambda) {
      let sumError = 0;
      let bestHR_an = HR_an;
      let bestRHR_drop = RHR_drop;
      let bestLambda = lambda;
      for (let i = 0; i < 10000; i++) {
        const newHR_an = HR_an + (Math.random() - 0.5);
        const newRHR_drop = RHR_drop + (Math.random() - 0.5);
        const newLambda = lambda + (Math.random() - 0.001);
        let newSumError = 0;
        for (let j = 0; j < time.length; j++) {
          const t = time[j];
          const hr = heartRate[j];
          if (hr > AerT) {
            const predicted = recoveryFunc1(t, newHR_an, newRHR_drop, newLambda);
            newSumError += Math.pow(predicted - hr, 2);
          }
        }
        if (newSumError < sumError || sumError === 0) {
          sumError = newSumError;
          bestHR_an = newHR_an;
          bestRHR_drop = newRHR_drop;
          bestLambda = newLambda;
        }
      }
      return [bestHR_an, bestRHR_drop, bestLambda];
    }

    // Simple least squares optimization for Phase 2
    function optimizePhase2(time, heartRate, AerT, RHR_clear, mu) {
      let sumError = 0;
      let bestHR_athr = AerT;
      let bestRHR_clear = RHR_clear;
      let bestMu = mu;
      for (let i = 0; i < 10000; i++) {
        const newHR_athr = AerT + (Math.random() - 0.5);
        const newRHR_clear = RHR_clear + (Math.random() - 0.5);
        const newMu = mu + (Math.random() - 0.001);
        let newSumError = 0;
        for (let j = 0; j < time.length; j++) {
          const t = time[j];
          const hr = heartRate[j];
          if (hr <= AerT) {
            const predicted = recoveryFunc2(t, newHR_athr, newRHR_clear, newMu);
            newSumError += Math.pow(predicted - hr, 2);
          }
        }
        if (newSumError < sumError || sumError === 0) {
          sumError = newSumError;
          bestHR_athr = newHR_athr;
          bestRHR_clear = newRHR_clear;
          bestMu = newMu;
        }
      }
      return [bestHR_athr, bestRHR_clear, bestMu];
    }

    // Optimize parameters for both phases
    const [HR_an_opt, RHR_drop_opt, lambda_opt] = optimizePhase1(time, heartRate, HR_an, RHR_drop, lambda);
    const [HR_athr_opt, RHR_clear_opt, mu_opt] = optimizePhase2(time, heartRate, AerT, RHR_clear, clearanceRate);
    console.log("Optimal parameters:", HR_an_opt, RHR_drop_opt, lambda_opt, HR_athr_opt, RHR_clear_opt, mu_opt);



  window.addEventListener('load', (event) => {


    // Visualization using canvas
    const canvas = document.getElementById('hr-recovery-chart');
    const ctx = canvas.getContext('2d');

    // Optionally, adjust canvas size when the window is resized
    window.addEventListener('resize', resizeCanvas);

    // Resize the canvas initially
    resizeCanvas();

    // Set canvas size to match its container's width and an appropriate height
    function resizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = 500; // Set this to any height you need
      // You can add any drawing code here, for example:
      ctx.fillStyle = 'lightgray';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw data points
    ctx.fillStyle = 'blue';
    time.forEach((t, i) => {
      ctx.fillRect(t * 50 + 50, 400 - heartRate[i] * 2, 5, 5);
    });

    // Draw fitted curve for Phase 1
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    for (let t = 0; t <= time[time.findIndex(t => recoveryFunc1(t, HR_an_opt, RHR_drop_opt, lambda_opt) <= HR_athr_opt)]; t += 0.1) {
      const hr = recoveryFunc1(t, HR_an_opt, RHR_drop_opt, lambda_opt);
      ctx.lineTo(t * 50 + 50, 400 - hr * 2);
    }
    ctx.stroke();

    // Draw fitted curve for Phase 2
    ctx.strokeStyle = 'green';
    ctx.beginPath();
    for (let t = time[time.findIndex(t => recoveryFunc1(t, HR_an_opt, RHR_drop_opt, lambda_opt) <= HR_athr_opt)]; t <= time[time.length - 1]; t += 0.1) {
      const hr = recoveryFunc2(t - time[time.findIndex(t => recoveryFunc1(t, HR_an_opt, RHR_drop_opt, lambda_opt) <= HR_athr_opt)], HR_athr_opt, RHR_clear_opt, mu_opt);
      ctx.lineTo(t * 50 + 50, 400 - hr * 2);
    }
    ctx.stroke();
  });




    //---------------------------------------------------------------------
    // Function to simulate heart rate recovery with lactic acid clearance
    //---------------------------------------------------------------------
    function recoveryDuringExercise(clearanceTime, HR_start, AerT, restingHR, lambda, clearanceRate) {
      let HR_current = HR_start;
      let HR_recovery = [];
      for (let t = 0; t <= clearanceTime; t++) {
        if (HR_current > AerT) {
          // Above aerobic threshold: exponential decay towards ATHR
          HR_current = AerT + (HR_current - AerT) * Math.exp(-lambda * t);
        } else {
          // Below aerobic threshold: exponential decay towards restingHR and lactic acid clearance
          HR_current = restingHR + (HR_current - restingHR) * Math.exp(-clearanceRate * t);
        }
        HR_recovery.push(HR_current);
      }
      return HR_recovery;
    }

    // Example usage

    let heartRateRecovery = recoveryDuringExercise(time, startHR, AerT, restingHR, lambda, clearanceRate);
    console.log(heartRateRecovery);
    //---------------------------------------------------------------------


function lactateModel(time, startHR, maxHR, LTHR, restingHR, lambda, k, c, initialLactate) {
    let LA = initialLactate; // initial lactate level
    let HR = startHR;
    let results = [];

    for (let t = 0; t <= time; t++) {
        let HR_intensity = HR; // This should be modeled based on exercise plan
        let LP = k * Math.max(HR_intensity - LTHR, 0); // Lactate production
        let LC = LA * Math.exp(-lambda * t); // Lactate clearance

        LA = LA + LP - LC;
        HR = restingHR + (startHR - restingHR) * Math.exp(-lambda * t); // simple HR recovery model
        
        results.push({ time: t, HR: HR, LA: LA });
    }

    return results;
}

// Example usage:
let data = lactateModel(60, startHR, maxHR, LTHR, restingHR, lambda, k, c, startLactate);
console.log(data);
