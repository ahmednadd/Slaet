const formatDate = () => {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    date: date.getDate(),
    day: days[date.getDay()],
    month: months[date.getMonth()],
  };
};

function formatTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);

  // Extracting hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Formatting to am/pm
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format
  const timeFormatted = `${hours}:${minutes} ${ampm}`;

  // Extracting day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  const dateFormatted = `${day}/${month}/${year}`;

  return { timeFormatted, dateFormatted };
}

const formatDuration = (duration) => {
  // Convert milliseconds to minutes
  const totalMinutes = Math.floor(duration / (1000 * 60));

  // Round down to the nearest 15 minutes
  const roundedMinutes = Math.floor(totalMinutes / 15) * 15;

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  let result = "";
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    result += (result ? " " : "") + `${minutes} min${minutes > 1 ? "s" : ""}`;
  }

  return result || "0 mins"; // Return '0 mins' if duration is 0
};

// Round time up to the next 15-minute interval
const roundToNext15Minutes = (date = new Date()) => {
  const newDate = new Date(date);
  const minutes = newDate.getMinutes();
  const remainder = minutes % 15;
  
  if (remainder === 0 && newDate.getSeconds() === 0 && newDate.getMilliseconds() === 0) {
    // If it's exactly on a 15-minute mark, move to next 15-minute interval
    newDate.setMinutes(minutes + 15);
  } else {
    // Round up to next 15-minute mark
    newDate.setMinutes(minutes + (15 - remainder));
  }
  
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  
  return newDate;
};

export { formatDate, formatTimestamp, formatDuration, roundToNext15Minutes };
