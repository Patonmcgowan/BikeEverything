//
// gpxTcxUtils.js
// 
// Provides the utilities associated with the ride files from Strava and Garmin
//
//------------------------------------------------------------------------------
//  Revision History
//  ~~~~~~~~~~~~~~~~
//    1 Jul 2024 MDS Original
//
//------------------------------------------------------------------------------
"use strict";

//
//-----------------------------------------------------------------------------
//
//
const handleFileSelect = (event, callback) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = parseXML(content, file.name);
      // console.log(`File: ${theFile.name}: ${parsedData[0].summary}`); // Do something with the parsed data
      callback(parsedData);
    };

    reader.readAsText(file);
  }
}

//-----------------------------------------------------------------------------
//
function parseXML(xmlString, fileName) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");

  if (fileName.endsWith('.gpx')) {
    return parseGPX(xmlDoc);
  } else if (fileName.endsWith('.tcx')) {
    return parseTCX(xmlDoc);
  } else {
    throw new Error("Unsupported file type");
  }
} // parseXML(xmlString, fileName) {

//-----------------------------------------------------------------------------
// Use the Haversine formula to calculate the distance between two geographic coordinates:
//
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius of the Earth in meters
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

//-----------------------------------------------------------------------------
// Process one point entry from the selected file
//   Parameters: 
//     vs - an object containing the working variable set
//   Returns: 
//     vs - the amended variable set
//     rs - the object to be loaded into the array of data objects defining the ride
const processRideEntry = (vs) => {

  // Check for initialisation of internally used variables
  if (typeof vs.lastAltitude == 'undefined') {
    vs.lastAltitude = 0; vs.totalAscent = 0; vs.lastDist = 0; vs.totalTime = 0; vs.maxSpeed = 0; vs.totalDistance = 0;
    vs.maxHR = 0; vs.hrTotal = 0; vs.hrSamples = 0;
    vs.distArr = []; vs.timeArr = [];
    vs.distArr[0] = 0; vs.distArr[1] = 0; vs.distArr[2] = 0; vs.distArr[3] = 0; 
    vs.timeArr[0] = 0; vs.timeArr[1] = 0; vs.timeArr[2] = 0; vs.timeArr[3] = 0;
  }

  // Check for intialisation of times
  if (!vs.startTime) {
    vs.startTime = vs.time ? vs.time : null;  vs.lastTime = vs.time ? vs.time : null;
  }

  vs.deltaT = vs.time ? (vs.time - vs.lastTime) / 1000 : null; // Delta time in seconds

  // Calculate distance
  if ((!vs.thisDist) && (vs.lastLat !== undefined) && (vs.lastLon !== undefined)) {
    const calcMove = haversineDistance(vs.lastLat, vs.lastLon, vs.lat, vs.lon);

    // Filter out for erroneous latitude / longitude readings by ignoring anything that says we are going over 100 km/hr
    // If we don't have time info to derive speed, just use the GPS info unfiltered
    if (!vs.deltaT || (vs.deltaT && ((calcMove * 3.6) / vs.deltaT) < 100)) {
      vs.thisDist = vs.lastDist + calcMove;
    } else {
      vs.thisDist = vs.lastDist;
    }
  };
  vs.deltaX = vs.thisDist - vs.lastDist;
  vs.lastDist = vs.thisDist;
  vs.lastLat = vs.lat;
  vs.lastLon = vs.lon;

  // Get rolling average speed - this is needed for the GPS fixed distances and times
  vs.distArr.pop();
  vs.distArr.unshift(vs.deltaX);
  vs.timeArr.pop();
  vs.timeArr.unshift(vs.deltaT);
  vs.speed = vs.deltaT ? vs.distArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / vs.timeArr.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : null;

  // We are still moving if we are going faster than 5 km/hr.  Note that this 
  // routine also works (as far as possible) if we get someone else's data which 
  // doesn't contain any time or speed information (ie just waypoints)
  if (!vs.speed || vs.speed * 3.6 > 5) { 
    vs.totalTime = vs.deltaT ? vs.totalTime + vs.deltaT : vs.totalTime;

    let deltaY = 0;
    if (vs.altitude) {
      deltaY = vs.altitude - vs.lastAltitude;
      if ((vs.altitude - vs.lastAltitude) > 0)  {
        vs.totalAscent += (vs.altitude - vs.lastAltitude);
      }
      vs.lastAltitude = vs.altitude;
    }

    if (vs.speed && vs.speed > vs.maxSpeed) {
      vs.maxSpeed = vs.speed;
    }
    vs.totalDistance = vs.thisDist > 0 ? vs.thisDist : vs.lastDist;
    vs.slope = vs.deltaX > 0 ? deltaY * 100 / vs.deltaX : 0;

    // Do heart rate calcs
    if (vs.hr) {
      if (vs.hr > vs.maxHR) {
        vs.maxHR = vs.hr;
      }
      vs.hrTotal += vs.hr;
      vs.hrSamples++;
    }
  } else {
    // Do nothing if we are stopped
    vs.slope = 0;
  }
  vs.lastTime = vs.time ? vs.time : null;

  // Define the stuff to be loaded into a point in the results
  const rs = { time: vs.time, speed: vs.speed, deltaT: vs.deltaT, lat: vs.lat, lon: vs.lon, altitude: vs.altitude, hr: vs.hr, temp: vs.temp, distance: vs.deltaX, speed: vs.speed, slope: vs.slope };
  if (vs.cadence !== undefined) { rs.cadence = vs.cadence; }
  if (vs.power !== undefined)  { rs.power = vs.power; }
  return { vs, rs };

}; // processRideEntry = (vs) => {

//-----------------------------------------------------------------------------
// Calculate the ride summary information
//   Parameters: 
//     vs - an object containing the working variable set
//   ride - an array of objects containing the ride data extracted from the 
//          .TCX or .GPX file
const rideSummary = (vs, ride) => {
  

  return { 
      startTime: vs.startTime || 0, 
      totalTime: vs.totalTime || 0, 
      totalDistance: vs.totalDistance, 
      totalAscent: vs.totalAscent, 
      maxSpeed: vs.maxSpeed || 0, 
      avgSpeed: vs.totalTime ? vs.totalDistance / vs.totalTime : 0,
      maxHR: vs.maxHR,
      avgHR: vs.hrSamples > 0 ? parseInt(vs.hrTotal / vs.hrSamples) : 0,
      avgClimb: vs.totalDistance > 0 ? vs.totalAscent * 100 / vs.totalDistance : 0,
      points: ride 
  }
} // const rideSummary = (vs, ride) => {

//-----------------------------------------------------------------------------
//
const parseGPX = (xmlDoc) => {
  const activities = [];
  const tracks = xmlDoc.getElementsByTagName('trk');
  let vs = {}; 

  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    const trackPoints = track.getElementsByTagName('trkpt');
    if (trackPoints.length === 0) continue;

    vs.startTime = new Date(trackPoints[0]?.getElementsByTagName('time')[0]?.textContent);
    vs.lastLat = parseFloat(trackPoints[0]?.getAttribute('lat'));
    vs.lastLon = parseFloat(trackPoints[0]?.getAttribute('lon'));

    const points = [];

    for (let j = 0; j < trackPoints.length; j++) {
      const point = trackPoints[j];

      vs.lat = parseFloat(point.getAttribute('lat'));
      vs.lon = parseFloat(point.getAttribute('lon'));
      vs.thisDist = null; // Force lat/lon distance calculation

      // These don't exist if looking at someone elses ride
      const timeElement = point.getElementsByTagName('time')[0];
      if (timeElement) {
        vs.time = new Date(timeElement?.textContent);
      }
      vs.altitude = parseFloat(point.getElementsByTagName('ele')[0]?.textContent || null);

      // Heart rate and temperature are contained in the extensions element, which can have varying names.
      // Search through the extensions to find heart rate and temperature
      // const extensions = point.getElementsByTagName('extensions')[0]?.getElementsByTagName('ns3:TrackPointExtension')[0];
      vs.hr = null; vs.temp = null;
      const extensions = point.getElementsByTagName('extensions')[0];
      if (extensions) {
        for (let k = 0; k < extensions.children.length; k++) {
          if (extensions.children[k].localName == 'TrackPointExtension') {
            for (let l = 0; l < extensions.children[k].children.length; l++) {
              let el = extensions.children[k].children[l];
              switch (el.localName) {
                case 'cad': {
                  vs.cadence= el?.textContent ? parseInt(el.textContent) : null;
                  break;
                };
                case 'hr': {
                  vs.hr = el?.textContent ? parseInt(el.textContent) : null;
                  break;
                };
                case 'atemp': {
                  vs.temp = el?.textContent ? parseInt(el.textContent) : null;
                  break;
                };
              };
            };
          } else if (extensions.children[k].localName == 'power') {
            vs.power = parseInt(extensions.children[k]?.textContent);
          };
        };
      }

      // rs is the result set, vs is the variable set 
      const res = processRideEntry( vs ); // Manipulate the data and get the info that we want
      vs = { ...res.vs };
      points.push( res.rs );
    }

    activities.push( rideSummary(vs, points) ); // Add the summary data and load into the returned object
  }
  return activities;
} // const parseGPX = (xmlDoc) => {


//-----------------------------------------------------------------------------
//
const parseTCX = (xmlDoc) => {
  const activities = [];
  const activitiesNode = xmlDoc.getElementsByTagName('Activities')[0];
  const activityNodes = activitiesNode.getElementsByTagName('Activity');

  for (let i = 0; i < activityNodes.length; i++) {
    const activityNode = activityNodes[i];
    const laps = activityNode.getElementsByTagName('Lap');
    const trackPoints = [];
    let vs = {}; 

    for (let j = 0; j < laps.length; j++) {
      const lap = laps[j];
      const track = lap.getElementsByTagName('Track')[0];
      const points = track.getElementsByTagName('Trackpoint');

      for (let k = 0; k < points.length; k++) {
        const point = points[k];
        const latElement = point.getElementsByTagName('LatitudeDegrees')[0];
        const lonElement = point.getElementsByTagName('LongitudeDegrees')[0];
        vs.lat = isNaN(parseFloat(latElement?.textContent)) ? null : parseFloat(latElement.textContent);
        vs.lon = isNaN(parseFloat(lonElement?.textContent)) ? null : parseFloat(lonElement.textContent);
        vs.thisDist = parseFloat(point.getElementsByTagName('DistanceMeters')[0]?.textContent || null);
        vs.time = new Date(point.getElementsByTagName('Time')[0]?.textContent);
        vs.altitude = parseFloat(point.getElementsByTagName('AltitudeMeters')[0]?.textContent || null);
        const hrElement = point.getElementsByTagName('HeartRateBpm')[0];
        vs.hr = hrElement ? parseInt(hrElement.getElementsByTagName('Value')[0]?.textContent || null) : null;
        let tempElement = point.getElementsByTagName('Cadence')[0]?.textContent || null;
        if (tempElement) vs.cadence = parseInt(tempElement);

        // Read extensions
        vs.temp = null;
        const extensions = point.getElementsByTagName('Extensions')[0];
        if (extensions) {
          tempElement = extensions.getElementsByTagName('TPX')[0]?.getElementsByTagName('Temp')[0] || null;
          if (tempElement) vs.temp = parseFloat(tempElement?.textContent);

          tempElement = extensions.getElementsByTagName('TPX')[0]?.getElementsByTagName('Speed')[0] || null;
          if (tempElement) vs.speed = parseFloat(tempElement?.textContent);

          tempElement = extensions.getElementsByTagName('TPX')[0]?.getElementsByTagName('Watts')[0] || null;
          if (tempElement) vs.power = parseFloat(tempElement?.textContent);
        }

        // rs is the result set, vs is the variable set 
        const res = processRideEntry( vs ); // Manipulate the data and get the info that we want
        vs = { ...res.vs };
        trackPoints.push( res.rs );
      }
    }

    activities.push( rideSummary(vs, trackPoints) ); // Add the summary data and load into the returned object
  }
  return activities;
} // const parseTCX = (xmlDoc) => {


//-----------------------------------------------------------------------------
// End of file
//-----------------------------------------------------------------------------



