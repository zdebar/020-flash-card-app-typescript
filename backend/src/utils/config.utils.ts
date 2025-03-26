/**
 * Converts config.SRS setting of algorithm from user friendly format to seconds
 * @param srs 
 * @returns 
 */
export function convertSRSToSeconds(srs: string[]): number[] {
  const result = srs.map((interval) => {
    let unit = interval.slice(-1);
    let value = parseInt(interval.slice(0, -1));

    if (!isNaN(parseInt(unit))) {
      unit = "";
      value = parseInt(interval);
    }
    
    if (!(unit === "h" || unit === "m" || unit === "d" || unit === "")) return null;

    

    if (isNaN(value)) return null;

    switch (unit) {
      case 'm': 
        return value * 60; 
      case 'h': 
        return value * 3600; 
      case 'd': 
        return value * 86400; 
      default:
        return value; 
    }
  }).filter(value => value !== null);

  return result;
}

