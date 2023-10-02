const DayDate = require('dayjs');
DayDate.extend(require('dayjs/plugin/advancedFormat'));
DayDate.extend(require('dayjs/plugin/relativeTime'));
DayDate.extend(require('dayjs/plugin/timezone'));
DayDate.extend(require('dayjs/plugin/toObject'));

module.exports = {
	// ===================================================================================================================
	//  DATE
	// ===================================================================================================================

	/**
	 * GET FORMATTED DATE
	 * @param {String|Date} date - Date to format
	 * @param {String} format - Format string
	 * @returns {String} - Formatted date
	 */
	formattedDate: (date, format) => DayDate(date).format(format),

	/**
	 * IF START DATE IS BEFORE END DATE
	 * @param {String|Date} startDate
	 * @param {String|Date} endDate
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {Boolean}
	 */
	isBefore: (startDate, endDate, unit) => DayDate(startDate).isBefore(endDate, unit),

	/**
	 * IF START DATE IS AFTER THE END DATE
	 * @param {String|Date} startDate
	 * @param {String|Date} endDate
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {Boolean}
	 */
	isAfter: (startDate, endDate, unit) => DayDate(startDate).isAfter(endDate, unit),

	/**
	 * IS SAME DATE
	 * @param {String|Date} startDate
	 * @param {String|Date} endDate
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {Boolean} - If both dates are equal
	 */
	equal: (startDate, endDate, unit) => DayDate(startDate).isSame(endDate, unit),

	/**
	 * GET THE DIFFERENCE BETWEEN TWO DATES
	 * @param {String|Date} startDate
	 * @param {String|Date} endDate
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {Number} - The difference between both dates
	 */
	difference: (startDate, endDate, unit) => DayDate(startDate).diff(endDate, unit),

	/**
	 * SET DATE TO THE START OF A DAY, MONTH OR YEAR
	 * @param {String|Date} date
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {DayDate} - The new date
	 */
	startOf: (date, unit = 'day') => DayDate(date).startOf(unit),

	/**
	 * ADD TIME TO DATE
	 * @param {String|Date} date
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {DayDate} - The new date
	 */
	addTime: (date, length, unit = 'day') => DayDate(date).add(length, unit),

	/**
	 * SUBTRACT TIME FROM DATE
	 * @param {String|Date} date
	 * @param {('second'|'minute'|'hour'|'day'|'week'|'month'|'year')} [unit]
	 * @returns {DayDate} - The new date
	 */
	subtractTime: (date, length, unit = 'day') => DayDate(date).subtract(length, unit),

	// ===================================================================================================================
	//  TIME
	// ===================================================================================================================

	/**
	 * GET THE TIME AGO
	 * @param {String|Date} date
	 * @returns {String} - Formatted date e.g 4 hours ago
	 */
	timeAgo: date => DayDate(date).fromNow(),

	/**
	 * GET THE TIME TO
	 * @param {String|Date} date
	 * @param {String|Date} startDate - The from date
	 * @returns {String} - Formatted date e.g in 2 days
	 */
	timeTo: (date, startDate) => DayDate(startDate).to(date)
};
