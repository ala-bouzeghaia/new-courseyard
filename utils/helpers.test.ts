import {
  getTimeFromDescription,
  getTitleFromDescription,
  convertTimecodeToSeconds,
  convertSecondsToTimecode,
  formatDurationToTimecode,
} from './helpers';

describe('extract time code', () => {
  it('should extract time code from description', () => {
    const description = '⌨️ (0:00:00) Introduction';
    const expectedTimeCode = '0:00:00';
    const timeCode = getTimeFromDescription(description);
    expect(timeCode).toBe(expectedTimeCode);
  });

  it('should return empty string when no time code', () => {
    const description = 'Introduction';
    const expectedTimeCode = '';
    const timeCode = getTimeFromDescription(description);
    expect(timeCode).toBe(expectedTimeCode);
  });
});

describe("extract chapter's title", () => {
  it('should extract title from description', () => {
    const description = '⌨️ chapter 1 :  (0:00:00) Introduction';
    const expectedTitle = 'Introduction';
    const timeCode = getTitleFromDescription(description);
    expect(timeCode).toBe(expectedTitle);
  });

  it('should extract title from description', () => {
    const description = '⌨️ (0:00:00) Introduction';
    const expectedTitle = 'Introduction';
    const timeCode = getTitleFromDescription(description);
    expect(timeCode).toBe(expectedTitle);
  });
});

describe('convert timestamps to number', () => {
  it('should convert timestamp to second', () => {
    const timecode = '12:37';
    const expectedTime = 757;
    expect(convertTimecodeToSeconds(timecode)).toBe(expectedTime);
  });

  it('should convert timestamp > 1h to second', () => {
    const timecode = '1:12:37';
    const expectedTime = 4357;
    expect(convertTimecodeToSeconds(timecode)).toBe(expectedTime);
  });
});

describe('convert number into timestamp', () => {
  it('should convert time into timestamp', () => {
    const time = 757;
    const expectedTimecode = '12:37';
    expect(convertSecondsToTimecode(time)).toBe(expectedTimecode);
  });

  it('should convert time > 1h into timestamp', () => {
    const time = 4357;
    const expectedTimecode = '01:12:37';
    expect(convertSecondsToTimecode(time)).toBe(expectedTimecode);
  });
});

describe('convert string time into timestamp', () => {
  it('should convert time into timestamp', () => {
    const time = 'PT48M48S';
    const expectedTimeCode = '48:48';
    expect(formatDurationToTimecode(time)).toBe(expectedTimeCode);
  });

  it('should convert time > 1h into timestamp', () => {
    const time = 'PT1H48M48S';
    const expectedTimeCode = '01:48:48';
    expect(formatDurationToTimecode(time)).toBe(expectedTimeCode);
  });
});
