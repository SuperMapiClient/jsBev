/* Copyright (c) 2006-2011 by SuperMap Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.SuperMap.org/trunk/SuperMap/license.txt for the
 * full text of the license. */

/**
 * Namespace: SuperMap.Date
 * 包含parse、toString方法，两个方法用来解析RFC 3339日期，遵循 ECMAScript 5规范。
 */
SuperMap.Date = {

    /**
     * APIMethod: toISOString
     * 生成代表一个具体的日期字符串，该日期遵循ISO 8601标准(详情查看
     *     http://tools.ietf.org/html/rfc3339)。
     *
     * Parameters:
     * date - {Date} 日期对象。
     *
     * Returns:
     * {String} 一个代表日期字符串
     * (e.g. "2010-08-07T16:58:23.123Z").  
     */
    toISOString: (function() {
        if ("toISOString" in Date.prototype) {
            return function(date) {
                return date.toISOString();
            };
        } else {
            function pad(num, len) {
                var str = num + "";
                while (str.length < len) {
                    str = "0" + str;
                }
                return str;
            }
            return function(date) {
                var str;
                if (isNaN(date.getTime())) {
                    // ECMA-262 says throw RangeError, Firefox returns
                    // "Invalid Date"
                    str = "Invalid Date";
                } else {
                    str =
                        date.getUTCFullYear() + "-" +
                        pad(date.getUTCMonth() + 1, 2) + "-" +
                        pad(date.getUTCDate(), 2) + "T" +
                        pad(date.getUTCHours(), 2) + ":" +
                        pad(date.getUTCMinutes(), 2) + ":" +
                        pad(date.getUTCSeconds(), 2) + "." +
                        pad(date.getUTCMilliseconds(), 3) + "Z";
                }
                return str;
            };
        }

    })(),

    /**
     * APIMethod: parse
     * 从一个字符串生成一个日期对象。
     *
     * Parameters:
     * str - {String} 代表日期的字符串。
     *	 (如： "2010", "2010-08", "2010-08-07", "2010-08-07T16:58:23.123Z",
     *     "2010-08-07T11:58:23.123-06").
     *
     * Returns:
     * {Date} 日期对象，如果字符串无法被解析，则返回一个无效的日期。(i.e. isNaN(date.getTime())).
     */
    parse: function(str) {
        var date;
        var match = str.match(/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{1,2}):(\d{2}):(\d{2}(?:\.\d+)?)(Z|(?:[+-]\d{1,2}(?::(\d{2}))?)))?$/);
        if (match && (match[1] || match[7])) { // must have at least year or time
            var year = parseInt(match[1], 10) || 0;
            var month = (parseInt(match[2], 10) - 1) || 0;
            var day = parseInt(match[3], 10) || 1;
            date = new Date(Date.UTC(year, month, day));
            // optional time
            var type = match[7];
            if (type) {
                var hours = parseInt(match[4], 10);
                var minutes = parseInt(match[5], 10);
                var secFrac = parseFloat(match[6]);
                var seconds = secFrac | 0;
                var milliseconds = Math.round(1000 * (secFrac - seconds));
                date.setUTCHours(hours, minutes, seconds, milliseconds);
                // check offset
                if (type !== "Z") {
                    var hoursOffset = parseInt(type, 10);
                    var minutesOffset = parseInt(match[8], 10) || 0;
                    var offset = -1000 * (60 * (hoursOffset * 60) + minutesOffset * 60);
                    date = new Date(date.getTime() + offset);
                }
            }
        } else {
            date = new Date("invalid");
        }
        return date;
    }
};
