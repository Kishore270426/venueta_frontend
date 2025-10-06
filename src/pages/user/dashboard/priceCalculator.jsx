export const calculatePrice = ({
    function_start_date,
    function_end_date,
    start_time,
    end_time,
    full_day_slot,
    hall_price_per_day,
}) => {
    if (!function_start_date || !function_end_date) {
        throw new Error("Start date and end date are required for price calculation.");
    }

    const startDate = new Date(function_start_date);
    const endDate = new Date(function_end_date);

    if (startDate > endDate) {
        throw new Error("End date cannot be earlier than start date.");
    }

    if (full_day_slot) {
        // Calculate price for full-day slot
        const numberOfDays = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24) + 1);
        return hall_price_per_day * numberOfDays;
    } else {
        if (!start_time || !end_time) {
            throw new Error("Start time and end time are required if full-day slot is not selected.");
        }

        // Parsing start and end times as numbers
        const [startHour, startMinute] = start_time.split(":").map(Number);
        const [endHour, endMinute] = end_time.split(":").map(Number);

        // Convert start and end times into Date objects with their respective dates
        const startDateTime = new Date(startDate);
        startDateTime.setHours(startHour, startMinute, 0, 0);

        const endDateTime = new Date(endDate);
        endDateTime.setHours(endHour, endMinute, 0, 0);

        // If the end time is earlier than the start time, we assume it's on the next day
        if (endDateTime <= startDateTime) {
            endDateTime.setDate(endDateTime.getDate() + 1);
        }

        // Calculate the duration in hours
        const durationInMs = endDateTime - startDateTime;
        const durationInHours = durationInMs / (1000 * 60 * 60); // Convert ms to hours

        if (durationInHours <= 0) {
            throw new Error("End time must be later than start time.");
        }

        const dailyHours = 24;
        const hourlyRate = hall_price_per_day / dailyHours;

        // Calculate the total price for the duration (number of hours * hourly rate)
        const numberOfDays = Math.max(1, (endDate - startDate) / (1000 * 60 * 60 * 24) + 1);
        return numberOfDays * hourlyRate * durationInHours;
    }
};
