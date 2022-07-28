import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { generateCurrentUTC } from '../../../../../scripts/DateTime';

/**
 * Timer class to keep track of the difference between the current time and the time,
 * when the comment was posted
 */
export class Timer {
  private readonly second = 1000;
  private readonly minute = this.second * 60;
  private readonly hour = this.minute * 60;
  private readonly day = this.hour * 24;
  private readonly week = this.day * 7;
  private readonly month = this.week * 4;
  private readonly year = this.month * 12;
  // Interval :-
  // 0 - seconds
  // 1 - minute
  // 2 - hour
  // 3 - day
  // 4 - week
  // 5 - month
  // 6 - year
  private interval = -1;
  private setIntervalInstance: undefined | null | ReturnType<typeof setInterval>;
  private timeDiff: undefined | number;
  private readonly generateFinalTimeStringInstance = this.generateFinalTimeString.bind(this);
  timerValueStore: Writable<string>;
  private createdAtDate: number;

  /**
   * Constructor for Timer instance
   * @param createdAtDate
   */
  constructor(createdAtDate: number) {
    this.createdAtDate = createdAtDate;
    // Generate the time difference between the current time and the created time
    this.getTimeDifference();
    // Generate the final time string
    this.timerValueStore = writable(this.generateTimeString());
  }

  /**
   * Function to return the createdAtDate value of the comment
   */
  get createdAtDateOfMsg() {
    return this.createdAtDate;
  }

  /**
   * Function to determine if the time difference is greater than or equal to 1
   * @private
   */
  private isPlural() {
    if (this.timeDiff === undefined) throw new Error('TimeDiff is not set');
    return this.timeDiff > 1 ? 's' : '';
  }

  /**
   * Function to generate the time string for the current time stamp
   * @private
   */
  private generateTimeString() {
    let timeString: string;

    switch (this.interval) {
      case 0:
        timeString = `${this.timeDiff} sec${this.isPlural()}`;
        break;
      case 1:
        timeString = `${this.timeDiff} min${this.isPlural()}`;
        break;
      case 2:
        timeString = `${this.timeDiff} hr${this.isPlural()}`;
        break;
      case 3:
        timeString = `${this.timeDiff} day${this.isPlural()}`;
        break;
      case 4:
        timeString = `${this.timeDiff} wk${this.isPlural()}`;
        break;
      case 5:
        timeString = `${this.timeDiff} mn${this.isPlural()}`;
        break;
      case 6:
        timeString = `${this.timeDiff} yr${this.isPlural()}`;
        break;
      default:
        timeString = 'Back to the future';
    }

    return timeString;
  }

  /**
   * Function to set the interval as well as the difference in interval
   * between the current time and the createdAtDate.
   */
  private getTimeDifference() {
    const currentDateUTC = generateCurrentUTC();

    const dateDiffRaw = currentDateUTC - this.createdAtDate;
    const yearDiff = Math.trunc(dateDiffRaw / this.year);
    const monthDiff = Math.trunc(dateDiffRaw / this.month);
    const weekDiff = Math.trunc(dateDiffRaw / this.week);
    const dayDiff = Math.trunc(dateDiffRaw / this.day);
    const hourDiff = Math.trunc(dateDiffRaw / this.hour);
    const minuteDiff = Math.trunc(dateDiffRaw / this.minute);
    const secondDiff = Math.trunc(dateDiffRaw / this.second);

    // Check if at least one year has passed if, then how many year have passed
    if (yearDiff > 0) {
      this.interval = 6;
      this.timeDiff = yearDiff;
    }
    // Check if at least one month has passed if, then how many month have passed
    else if (monthDiff > 0) {
      this.interval = 5;
      this.timeDiff = monthDiff;
    }
    // Check if at least one week has passed if, then how many week have passed
    else if (weekDiff > 0) {
      this.interval = 4;
      this.timeDiff = weekDiff;
    }
    // check if at lest one day has passed if so how many day have passed
    else if (dayDiff > 0) {
      this.interval = 3;
      this.timeDiff = dayDiff;
    }
    // Check if at least one hour has passed if, then how many hour have passed
    else if (hourDiff > 0) {
      this.interval = 2;
      this.timeDiff = hourDiff;
    }
    // Check if at least one minute has passed if, then how many minute have passed
    else if (minuteDiff > 0) {
      this.interval = 1;
      this.timeDiff = minuteDiff;
    }
    // Check if at least one second has passed if then how many seconds have passed
    else if (secondDiff > 0) {
      this.interval = 0;
      this.timeDiff = secondDiff;
    }
    // If no time has passed, then return 0
    else if (secondDiff === 0) {
      this.interval = 0;
      this.timeDiff = 0;
    }
    //  If either of the diff is less than 1,
    //  then the user clock is set earlier than the message's createdAtDate
    if (
      yearDiff < 0 ||
      monthDiff < 0 ||
      weekDiff < 0 ||
      dayDiff < 0 ||
      hourDiff < 0 ||
      minuteDiff < 0 ||
      secondDiff < 0
    ) {
      this.interval = -1;
      this.timeDiff = -1;
    }

    // console.log(this.interval, this.timeDiff);
  }

  /**
   * Function to generate the final time string based on the interval and timeDiff,
   * also manages setInterval timers.
   */
  generateFinalTimeString() {
    const oldInterval = this.interval;
    // Generate the new time interval and time difference
    this.getTimeDifference();
    // generate the new time string
    // update the timerValueStore so components can update
    this.timerValueStore.set(this.generateTimeString());

    // Check if the new interval is greater than the old interval
    // If so,we need to clear the setIntervalInstance and
    // set the setIntervalInstance to the new interval
    if (this.interval > oldInterval) {
      this.clearIntervalTimer();
      this.setIntervalTimer();
    }
    // If the new interval is less than the old interval
    //  then most likely error with users clock
    else if (oldInterval > this.interval) {
      console.error('Timer is not functioning properly');
    }
  }

  /**
   * Function to clear the interval timer using the interval id stored in the setIntervalInstance
   * @private
   */
  private clearIntervalTimer() {
    if (!this.setIntervalInstance) return;

    clearInterval(this.setIntervalInstance);
    this.setIntervalInstance = null;
  }

  /**
   * Function to set the interval timer delay using the interval id
   */
  setIntervalTimer() {
    // If an instance of setInterval is already set, then return
    // we only want 1 instance of setInterval per instance of Timer
    if (this.setIntervalInstance) return;
    console.log('setInterval', this.interval);

    // limit max interval delay to week as:- 1 week = 604800000 ms, 1 month = 2592000000 ms
    // MDN: The delay argument is converted to a signed 32-bit integer.
    // This effectively limits delay to 2147483647 ms,
    // since it's specified as a signed integer in the IDL.
    switch (this.interval) {
      // If the interval is 0, then we need to set the interval delay to 1 second
      case 0:
        this.setIntervalInstance = setInterval(this.generateFinalTimeStringInstance, this.second);
        break;
      // If the interval is 1, then we need to set the interval delay to 1 minute
      case 1:
        this.setIntervalInstance = setInterval(this.generateFinalTimeStringInstance, this.minute);
        break;
      // If the interval is 2, then we need to set the interval delay to 1 hour
      case 2:
        this.setIntervalInstance = setInterval(this.generateFinalTimeStringInstance, this.hour);
        break;
      // If the interval is 3, then we need to set the interval delay to 1 day
      case 3:
        this.setIntervalInstance = setInterval(this.generateFinalTimeStringInstance, this.day);
        break;
      // If the interval is 4, then we need to set the interval delay to 1 week
      //  If the interval is 5, then we need to set the interval delay to 1 week
      //  If the interval is 6, then we need to set the interval delay to 1 week
      case 4:
      case 5:
      case 6:
        this.setIntervalInstance = setInterval(this.generateFinalTimeStringInstance, this.week);
        break;
      default:
        console.error('Timer is not functioning properly');
    }
  }
}
