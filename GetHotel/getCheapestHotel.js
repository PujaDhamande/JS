const hotels = require('./hotelInfo.json') //import hotels info.

// Function to check if a date is a weekend
const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

// Function to calculate the cost for each hotel per date and total
const calculateCostDetails = (customerType, dates) => {
    const costDetails = {};

    Object.keys(hotels).forEach((hotel) => {
        const hotelDetails = { totalCost: 0, rating: hotels[hotel].rating, dailyCosts: [] };

        dates.forEach((date) => {
            const isWeekendDay = isWeekend(date);
            const rateType = isWeekendDay ? "weekend" : "weekday";

            const dailyCost = hotels[hotel].rates[customerType][rateType];

            hotelDetails.dailyCosts.push({
                date: date.toDateString(),
                rateType,
                cost: dailyCost
            });

            hotelDetails.totalCost += dailyCost;
        });

        costDetails[hotel] = hotelDetails;
    });

    return costDetails;
};

// Function to find the cheapest hotel based on total cost and rating
const findCheapestHotel = (costDetails) => {
    let cheapestHotel = null;
    let minCost = Infinity;

    Object.keys(costDetails).forEach((hotel) => {
        const totalCost = costDetails[hotel].totalCost;

        if ( totalCost < minCost ||
            (totalCost === minCost && hotels[hotel].rating > hotels[cheapestHotel].rating)) {
                     minCost = totalCost;
                     cheapestHotel = hotel;
        }
    });

    return cheapestHotel;
};

// Function to parse dates from input strings
const parseDates = (dateStrings) => {
    const monthMapping = {
        JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
        JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
    };

    return dateStrings.map((dateString) => {
        // Split date string and remove any unnecessary text in parentheses
        const dateParts = dateString.split(" ");
        
        if (dateParts.length < 3) {
            throw new Error(`Invalid date format: ${dateString}`);
        }

        const day = dateParts[0];
        const month = dateParts[1].toUpperCase();
        const year = dateParts[2].split("(")[0]; // Remove day of week if present

        // Convert month name to numeric format
        const monthNumber = monthMapping[month];

        if (!monthNumber) {
            throw new Error(`Invalid month name: ${month}`);
        }

        // Construct the date in YYYY-MM-DD format and create a Date object
        return new Date(`${year}-${monthNumber}-${day}`);
    });
};


// Function to generate JSON output for the cheapest hotel only
const generateCheapestHotelJson = (costDetails, cheapestHotel) => {
    const hotel = costDetails[cheapestHotel];
    return JSON.stringify({
        name: cheapestHotel,
        rating: hotel.rating,
        totalCost: hotel.totalCost,
        dailyCosts: hotel.dailyCosts
    }, null, 2);
};

// Example inputs
const input1 = {
    customerType: "regular",
    dates: ["18 MAY 2021(WED)", "19 MAY 2021(THU)", "21 MAY 2021(SAT)"]
};

const input2 = {
    customerType: "reward",
    dates: ["19 MAY 2021(THU)", "20 MAY 2021(FRI)", "21 MAY 2021(SAT)", "22 MAY 2021(SUN)"]
};

// Parse dates and calculate details
const parsedDates1 = parseDates(input1.dates);
const parsedDates2 = parseDates(input2.dates);

console.log("\n--- JSON Output for Cheapest Hotel for Input 1 ---");
const costDetails1 = calculateCostDetails(input1.customerType, parsedDates1);
const cheapestHotel1 = findCheapestHotel(costDetails1);
console.log(generateCheapestHotelJson(costDetails1, cheapestHotel1));

console.log("\n--- JSON Output for Cheapest Hotel for Input 2 ---");
const costDetails2 = calculateCostDetails(input2.customerType, parsedDates2);
const cheapestHotel2 = findCheapestHotel(costDetails2);
console.log(generateCheapestHotelJson(costDetails2, cheapestHotel2));
