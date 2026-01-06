const axios = require('axios');

const IP = '192.168.99.121';
const API_BASE_URL = `http://${IP}:8080`;

const restaurantInfo = {
    name: "Street Burger - The Gourmet Hub",
    address: "123 Galle Link Road, Colombo 03, Sri Lanka",
    phone: "+94 77 123 4567",
    email: "hello@streetburger.lk",
    openingHours: "Mon-Fri: 11:00 AM - 11:00 PM\nSat-Sun: 10:00 AM - 12:00 AM",
    aboutUs: "Street Burger was born from a passion for authentic, gourmet street food. We believe that a great burger is more than just a meal – it's an experience. Our chefs use only the freshest, locally sourced ingredients to create unique flavor profiles that honor traditional burger culture while pushing culinary boundaries. From our hand-pressed patties to our custom-baked buns, every element is crafted with care and a touch of street-style attitude.",
    latitude: 6.9271,
    longitude: 79.8612,
    facebookUrl: "https://facebook.com/streetburgerlk",
    instagramUrl: "https://instagram.com/streetburgerlk",
    uberEatsUrl: "https://ubereats.com/lk/colombo/street-burger",
    pickmeFoodUrl: "https://pickme.lk/food/street-burger"
};

const sampleReviews = [
    { reviewerName: "Amara Silva", rating: 5, comment: "Best burgers in Colombo! The Classic Beef is perfectly juicy every single time." },
    { reviewerName: "John Doe", rating: 4, comment: "Great atmosphere and friendly staff. The BBQ Bacon burger is a must-try." },
    { reviewerName: "Nimal Perera", rating: 5, comment: "Value for money is amazing. The giant burger actually is giant! Love the secret sauce." },
    { reviewerName: "Sahan Dias", rating: 3, comment: "The food is excellent but the delivery took a bit longer than expected during peak hours." },
    { reviewerName: "Liya Chen", rating: 5, comment: "Clean environment and high-quality ingredients. Definitely coming back for the Mango Smoothie." }
];

async function populateRestaurantInfo() {
    try {
        console.log('Checking for existing restaurant info...');
        const existingRes = await axios.get(`${API_BASE_URL}/restaurant-info/get/all`);
        const existingData = existingRes.data.data;

        if (existingData && existingData.length > 0) {
            console.log('Updating existing restaurant info...');
            await axios.put(`${API_BASE_URL}/restaurant-info/update/${existingData[0].id}`, restaurantInfo);
        } else {
            console.log('Creating new restaurant info...');
            await axios.post(`${API_BASE_URL}/restaurant-info/add`, restaurantInfo);
        }
        console.log('Restaurant info processed successfully.');
    } catch (e) {
        console.error('Failed to populate restaurant info:', e.message);
    }
}

async function populateReviews() {
    try {
        console.log('Checking for existing reviews...');
        const existingRes = await axios.get(`${API_BASE_URL}/reviews`);
        const existingData = existingRes.data.data;

        if (existingData && existingData.length > 0) {
            console.log('Approving existing reviews if any...');
            // In our system, existing reviews might just stay. We'll add new ones for variety.
        }

        console.log('Adding sample reviews...');
        for (const review of sampleReviews) {
            // Using a dummy phone number for anonymous/sample reviews
            const phone = "0000000000";
            await axios.post(`${API_BASE_URL}/reviews/add/${phone}`, review);
            console.log(`Added review from: ${review.reviewerName}`);
        }
    } catch (e) {
        console.error('Failed to populate reviews:', e.message);
    }
}

async function run() {
    console.log('--- STARTING RESTAURANT DATA POPULATION ---');
    await populateRestaurantInfo();
    await populateReviews();
    console.log('--- POPULATION COMPLETE ---');
}

run();
