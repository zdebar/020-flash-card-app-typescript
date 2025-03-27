/**
 * Converts config.SRS setting of algorithm from user friendly format to seconds
 * @param srs 
 * @returns 
 */
export function convertSRSToSeconds(srs: string[]): number[] {
  const result = srs.map((interval) => {    
    let unit = interval.slice(-1);
    let value = parseInt(interval.slice(0, -1));
    
    if (isNaN(value) || !["m", "h", "d"].includes(unit)) {
      throw new Error(`Invalid SRS config format!`);
    }

    switch (unit) {
      case "m":
        return value * 60;
      case "h":
        return value * 3600;
      case "d":
        return value * 86400;
      default:
        throw new Error(`Invalid SRS config format!`);
    }
  })
  return result;
}

