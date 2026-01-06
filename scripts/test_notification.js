const axios = require('axios');

const IP = '192.168.99.121';
const API_BASE_URL = `http://${IP}:8080`;

async function sendTestNotification() {
    try {
        console.log('Logging in as admin...');
        const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, {
            phoneNumber: '0000000000',
            password: 'admin123'
        });

        if (!loginRes.data.success) {
            console.error('Login failed:', loginRes.data.message);
            return;
        }

        const token = loginRes.data.data.token;
        console.log('Login successful. Sending notification...');

        const notificationData = {
            title: '🔥 Hot Deal: Buy 1 Get 1 Free!',
            message: 'Hungry for more? Get a free Classic Beef Burger with every order over Rs. 2000 today only! Don\'t miss out on this delicious deal.',
            isGlobal: true,
            notificationType: 'PROMOTION',
            imageUrl: 'burger.png'
        };

        const notifyRes = await axios.post(`${API_BASE_URL}/notification/add`, notificationData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (notifyRes.data.success) {
            console.log('SUCCESS: Test notification sent!');
            console.log('Details:', notifyRes.data.data);
        } else {
            console.log('FAILED to send notification:', notifyRes.data.message);
        }

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

sendTestNotification();
