/**
 * Retrieve timestamps and titles from description
 * @param description Video description
 * @returns Array of video chapters
 */
export const getDataFromDescription = (description: string): string[] => {
  const pattern =
    /([0-9][0-9]:[0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9]:[0-9][0-9])|([0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9])/;
  const res: string[] = description.split('\n');
  const array: string[] = [];
  res.map((elt) =>
    elt.match(pattern) !== null ? array.push(elt.match(pattern)?.input as string) : null,
  );
  return array;
};

/**
 * Retrieve timestamp from chapter
 * @param description Single chapter from video description
 * @returns Timestamp of the chapter
 */
export const getTimeFromDescription = (description: string): string => {
  const pattern =
    /([0-9][0-9]:[0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9]:[0-9][0-9])|([0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9])/;
  if (description.match(pattern) !== null) {
    const match = description.match(pattern) as RegExpMatchArray;
    return match[0];
  }
  return '';
};

/**
 * Retrieve title from chapter
 * @param description Single chapter from video description
 * @returns Title of the chapter
 */
export const getTitleFromDescription = (description: string): string => {
  const pattern =
    /([0-9][0-9]:[0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9]:[0-9][0-9])|([0-9][0-9]:[0-9][0-9])|([0-9]:[0-9][0-9])/;
  const matchTime = description.match(pattern);
  if (matchTime !== null) {
    const newMatch = matchTime?.input?.slice(matchTime.index) as string;
    const matchText = newMatch.match(/[a-zA-Z]/);
    if (matchText !== null) {
      return (matchText?.input as string).slice(matchText.index);
    }
  }
  return '';
};

/**
 * Reformat timestamp into seconds
 * @param timecode Timestamp
 * @returns Timestamps in seconds
 */
export const convertTimecodeToSeconds = (timecode: string) => {
  const timeSplit = timecode.split(':');
  if (timeSplit.length >= 3) {
    return Number(timeSplit[0]) * 3600 + Number(timeSplit[1]) * 60 + Number(timeSplit[2]);
  }
  return Number(timeSplit[0]) * 60 + Number(timeSplit[1]);
};

/**
 * Reformat time into timestamp
 * @param time
 * @returns Time converted into timestamp
 */
export const formatTime = (time: number): string => {
  const formatedTime = new Date(time * 1000).toISOString().split('T')[1].split('.')[0];
  if (time < 3600) {
    return formatedTime.substring(3);
  }
  return formatedTime;
};
