(function(laroux) {
    // "use strict";

    // ui
    laroux.ui = {
        floatContainer: null,
        defaultPopupTimeout: 5,

        createFloatContainer: function() {
            if (!laroux.ui.floatContainer) {
                laroux.ui.floatContainer = laroux.dom.createElement('DIV', { id: 'laroux_floatdiv' }, '');
                document.body.insertBefore(laroux.ui.floatContainer, document.body.firstChild);
            }
        },

        createBox: function(id, xclass, message) {
            return laroux.dom.createElement('DIV', { 'id': id, 'class': xclass },
                message
            );
        },

        msgbox: function(timeout, message) {
            var id = laroux.helpers.getUniqueId();
            var obj = laroux.ui.createBox(id, 'laroux_msgbox', message);
            laroux.ui.floatContainer.appendChild(obj);

            laroux.css.setProperty(obj, 'opacity', '1');

            laroux.timers.set(timeout, function(x) {
                // laroux.css.setProperty(x, 'opacity', '0');
                laroux.dom.remove(x);
            }, obj);
        }
    };

    // date
    laroux.date = {
        parseEpoch: function(timespan) {
            if (timespan <= 3000) {
                return 'now';
            }

            if (timespan < 60*1000) {
                timespan = Math.ceil(timespan / 1000);

                return timespan + ' seconds';
            }

            if (timespan < 60*60*1000) {
                timespan = Math.ceil(timespan / (60*1000));

                if (timespan == 1) {
                    return 'a minute';
                }

                return timespan + ' minutes';
            }

            if (timespan < 24*60*60*1000) {
                timespan = Math.ceil(timespan / (60*60*1000));

                if (timespan == 1) {
                    return 'an hour';
                }

                return timespan + ' hours';
            }

            if (timespan < 7*24*60*60*1000) {
                timespan = Math.ceil(timespan / (24*60*60*1000));

                if (timespan == 1) {
                    return 'a day';
                }

                return timespan + ' days';
            }

            if (timespan < 4*7*24*60*60*1000) {
                timespan = Math.ceil(timespan / (7*24*60*60*1000));

                if (timespan == 1) {
                    return 'a week';
                }

                return timespan + ' weeks';
            }

            return null;
        },

        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        getDateString: function(date) {
            var now = new Date();

            var leadingDate = ('0' + date.getDate()).substr(-2, 2);
            var monthName = laroux.date.monthsShort[date.getMonth()];
            var leadingYear = ('' + date.getFullYear()).substr(2, 2);

            // timespan
            var timespan = now.getTime() - date.getTime();
            var future;
            if (timespan < 0) {
                future = true;
                timespan = Math.abs(timespan);
            } else {
                future = false;
            }

            var timespanstring = laroux.date.parseEpoch(timespan);
            if (timespanstring != null) {
                if (future) {
                    return timespanstring + ' later';
                }

                return timespanstring;
            }

            return leadingDate + ' ' + monthName + ' ' + leadingYear;
        },

        getLongDateString: function(date) {
            var leadingDate = ('0' + date.getDate()).substr(-2, 2);
            var leadingMonth = ('0' + date.getMonth()).substr(-2, 2);
            var fullYear = date.getFullYear();

            var leadingHour = ('0' + date.getHours()).substr(-2, 2);
            var leadingMinute = ('0' + date.getMinutes()).substr(-2, 2);

            return leadingDate + '.' + leadingMonth + '.' + fullYear + ' ' + leadingHour + ':' + leadingMinute;
        },

        updateDatesElements: null,
        updateDates: function() {
            if (laroux.date.updateDatesElements == null) {
                laroux.date.updateDatesElements = laroux.dom.select('*[data-epoch]');
            }

            laroux.date.updateDatesElements.forEach(function(obj) {
                var date = new Date(parseInt(obj.getAttribute('data-epoch')) * 1000);

                laroux.dom.replace(
                    obj,
                    laroux.date.getDateString(date)
                );

                obj.setAttribute('title', laroux.date.getLongDateString(date));
            });
        },

        trackDates: function() {
            laroux.date.updateDates();
            laroux.timers.set(5, laroux.date.trackDates);
        }
    };

    laroux.ready(laroux.ui.createFloatContainer);

    laroux.popupFunc = function(message) {
        laroux.ui.msgbox(laroux.ui.defaultPopupTimeout, message);
    };

})(window.laroux);
