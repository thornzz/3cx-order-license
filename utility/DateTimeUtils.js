

export function convertDateTime(datetime) {
    // Convert the string to a Date object
    const date = new Date(datetime);
    // Use the toLocaleDateString() method to format the date
    const formattedDate = date.toLocaleDateString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    // Use the toLocaleTimeString() method to format the time
    const formattedTime = date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    // Concatenate the formatted date and time and return
    return `${formattedDate} ${formattedTime}`
}

export function calculateRemainingDay(datetime) {
    const targetDate = new Date(datetime);
    // Get the current date
    const currentDate = new Date();
    // Calculate the difference in milliseconds between the current date and the target date
    const timeDifference = targetDate.getTime() - currentDate.getTime();
    // Calculate the number of days remaining by dividing the time difference by the number of milliseconds in a day
     return Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

}


