const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec"
];

export function formatDate(givenDate) {
    const dob = new Date(givenDate);
    let day = (dob.getDate()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let monthName = monthNames[dob.getMonth()]
    let year = dob.getFullYear();

    return `${day}-${monthName}-${year}`;
}
