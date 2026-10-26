const { DateTime } = require('luxon');

const parseDueDate = (value,timezone = 'UTC') => {
    //Accept a missing due date
    if(value === undefined || value === null || value === ''){
        return {valid:true,date:null,};
    }

    if(typeof value !== 'string'){
        return {valid:false,date:null};
    }

    // Validate the timezone
    const zoneCheck = DateTime.now().setZone(timezone);

    if(!zoneCheck.isValid){
        return {valid:false,date:null,message:'Invalid timezone'};
    }

    // Date-only input: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const parsed = DateTime.fromISO(value, { zone: timezone });

        if (!parsed.isValid) {
            return {
                valid: false,
                date: null,
                message: 'Invalid due date',
            };
        }

        return {
            valid: true,
            date: parsed.startOf('day').toUTC().toJSDate(),
        };
    }

    // For date-times, require an explicit UTC marker or offset.
    const hasTimezone =
        /T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

    if (!hasTimezone) {
        return {
            valid: false,
            date: null,
            message: 'Date-time must include a timezone or UTC offset',
        };
    }

    const parsed = DateTime.fromISO(value, { setZone: true });

    if (!parsed.isValid) {
        return {
            valid: false,
            date: null,
            message: 'Invalid due date',
        };
    }

    return {
        valid: true,
        date: parsed.toUTC().toJSDate(),
    };
};

module.exports = parseDueDate;