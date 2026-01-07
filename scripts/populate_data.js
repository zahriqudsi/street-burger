const axios = require('axios');

const IP = '192.168.93.121';
const API_BASE_URL = `http://${IP}:8080`;

const burgerImg = `${API_BASE_URL}/images/burger.png`;
const friesImg = `${API_BASE_URL}/images/fries.png`;
const brownieImg = `${API_BASE_URL}/images/brownie.png`;
const drinkImg = `${API_BASE_URL}/images/drink.png`;
const comboImg = `${API_BASE_URL}/images/combo.png`;

const burgers = [
    { title: 'Classic Beef Burger', price: 1850, imageUrl: burgerImg, description: 'Prime beef patty with fresh lettuce, tomato, and our secret sauce.' },
    { title: 'Double Cheese Burger', price: 2400, imageUrl: burgerImg, description: 'Double beef patty with melted cheddar, pickles, and mustard.' },
    { title: 'Spicy Zinger Burger', price: 1650, imageUrl: burgerImg, description: 'Crispy fried chicken with a spicy kick and creamy mayo.' },
    { title: 'Mushroom Swiss Burger', price: 2100, imageUrl: burgerImg, description: 'Beef patty topped with sautéed mushrooms and Swiss cheese.' },
    { title: 'BBQ Bacon Burger', price: 2600, imageUrl: burgerImg, description: 'Beef patty with crispy bacon, onion rings, and smoky BBQ sauce.' },
    { title: 'Hawaiian Chicken Burger', price: 1950, imageUrl: burgerImg, description: 'Grilled chicken with pineapple ring, teriyaki sauce, and lettuce.' },
    { title: 'Veggie Delight Burger', price: 1500, imageUrl: burgerImg, description: 'Homemade vegetable patty with avocado, sprouts, and yogurt dressing.' },
    { title: 'Fish Fillet Burger', price: 1750, imageUrl: burgerImg, description: 'Breaded fish fillet with tartar sauce and crunchy slaw.' },
    { title: 'Blue Cheese Master', price: 2800, imageUrl: burgerImg, description: 'Gourmet beef patty with blue cheese crumbles and caramelized onions.' },
    { title: 'Street Special Giant', price: 3500, imageUrl: burgerImg, description: 'Triple patty monster with everything on it – for the brave!' }
];

const drinks = [
    { title: 'Fresh Lime Soda', price: 450, imageUrl: drinkImg, description: 'Refreshing lime juice with sparkling soda and mint.' },
    { title: 'Iced Coffee Latte', price: 650, imageUrl: drinkImg, description: 'Premium Sri Lankan coffee with chilled milk and a hint of vanilla.' },
    { title: 'Mango Smoothie', price: 850, imageUrl: drinkImg, description: 'Real Alphonso mangoes blended with yogurt and honey.' },
    { title: 'Classic Coca Cola', price: 250, imageUrl: drinkImg, description: 'Chilled 330ml can of classic Coke.' },
    { title: 'Chocolate Milkshake', price: 950, imageUrl: drinkImg, description: 'Thick and creamy Belgian chocolate milkshake with whipped cream.' },
    { title: 'Strawberry Lemonade', price: 550, imageUrl: drinkImg, description: 'Homemade lemonade infused with fresh strawberries.' },
    { title: 'Green Apple Mojito', price: 750, imageUrl: drinkImg, description: 'Virgin mojito with green apple syrup, lime, and mint leaves.' },
    { title: 'Vanilla Frappe', price: 700, imageUrl: drinkImg, description: 'Blended coffee with vanilla bean and ice, topped with cream.' },
    { title: 'Passion Fruit Juice', price: 500, imageUrl: drinkImg, description: 'Tangy and sweet fresh passion fruit juice.' },
    { title: 'Mineral Water (500ml)', price: 150, imageUrl: drinkImg, description: 'Bottled natural mineral water.' }
];

const sides = [
    { title: 'Classic Salted Fries', price: 450, imageUrl: friesImg, description: 'Crispy golden fries seasoned with sea salt.' },
    { title: 'Cheesy Loaded Fries', price: 850, imageUrl: friesImg, description: 'Fries topped with melted cheddar and jalapeños.' },
    { title: 'Onion Rings (8pcs)', price: 600, imageUrl: friesImg, description: 'Golden battered onion rings with a garlic dip.' },
    { title: 'Chicken Nuggets (6pcs)', price: 750, imageUrl: burgerImg, description: 'Tender chicken nuggets served with BBQ sauce.' },
    { title: 'Garlic Bread with Cheese', price: 550, imageUrl: friesImg, description: 'Toasted baguette with garlic butter and mozzarella.' },
    { title: 'Sweet Potato Fries', price: 650, imageUrl: friesImg, description: 'Crunchy sweet potato fries with a honey mustard dip.' },
    { title: 'Coleslaw Salad', price: 350, imageUrl: friesImg, description: 'Creamy homemade cabbage and carrot slaw.' },
    { title: 'Mozzarella Sticks (4pcs)', price: 900, imageUrl: friesImg, description: 'Melting mozzarella sticks in a herb crust.' },
    { title: 'Spicy Potato Wedges', price: 550, imageUrl: friesImg, description: 'Thick-cut potato wedges with a spicy seasoning.' },
    { title: 'Hot Chicken Wings (6pcs)', price: 1200, imageUrl: burgerImg, description: 'Crispy wings tossed in a buffalo hot sauce.' }
];

const desserts = [
    { title: 'Chocolate Lava Cake', price: 950, imageUrl: brownieImg, description: 'Rich chocolate cake with a molten center.' },
    { title: 'Classic Brownie with Ice Cream', price: 1100, imageUrl: brownieImg, description: 'Warm fudge brownie topped with vanilla bean ice cream.' },
    { title: 'Strawberry Cheesecake', price: 850, imageUrl: brownieImg, description: 'Creamy New York style cheesecake with strawberry topping.' },
    { title: 'Vanilla Bean Panna Cotta', price: 750, imageUrl: brownieImg, description: 'Smooth Italian cream dessert with berry coulis.' },
    { title: 'Double Choc Chip Cookies', price: 400, imageUrl: brownieImg, description: 'Two large, soft and chewy chocolate chip cookies.' },
    { title: 'Apple Crumble Pie', price: 800, imageUrl: brownieImg, description: 'Warm apple pie with a cinnamon oat crumble topping.' },
    { title: 'Tiramisu Cup', price: 1200, imageUrl: brownieImg, description: 'Coffee-soaked ladyfingers with mascarpone cream.' },
    { title: 'Banoffee Pie', price: 900, imageUrl: brownieImg, description: 'Layers of banana, toffee, and whipped cream.' },
    { title: 'Ice Cream Sundae', price: 700, imageUrl: brownieImg, description: 'Three scoops of ice cream with chocolate sauce and nuts.' },
    { title: 'Waffles with Maple Syrup', price: 850, imageUrl: brownieImg, description: 'Fluffy waffles served with maple syrup and butter.' }
];

const combos = [
    { title: 'Single Burger Combo', price: 2500, imageUrl: comboImg, description: '1 Classic Burger + Regular Fries + Small Drink.' },
    { title: 'Double Deal Combo', price: 4500, imageUrl: comboImg, description: '2 Classic Burgers + Large Fries + 2 Small Drinks.' },
    { title: 'Family Platter for 4', price: 8500, imageUrl: comboImg, description: '4 Burgers + 2 Family Fries + 4 Drinks.' },
    { title: 'Mega Feast Platter', price: 12000, imageUrl: comboImg, description: '6 Burgers + 3 Side Platters + 6 Drinks.' },
    { title: 'Chicken Lovers Combo', price: 3200, imageUrl: comboImg, description: '1 Zinger Burger + 6 Nuggets + Small Drink.' },
    { title: 'Veggie Platter for 2', price: 3800, imageUrl: comboImg, description: '2 Veggie Burgers + Sweet Potato Fries + 2 Fresh Juices.' },
    { title: 'Kids Party Box', price: 1800, imageUrl: comboImg, description: 'Mini Burger + Small Fries + Fruit Juice + Toy.' },
    { title: 'Business Lunch Combo', price: 2200, imageUrl: comboImg, description: 'Any Burger + Salad Side + Iced Coffee.' },
    { title: 'Movie Night Bucket', price: 5500, imageUrl: comboImg, description: '12 Chicken Wings + Large Fries + Liter of Coke.' },
    { title: 'Weekend Special', price: 6000, imageUrl: comboImg, description: '2 Premium Burgers + 2 Desserts + 2 Large Drinks.' }
];

async function postItem(item, categoryId) {
    try {
        await axios.post(`${API_BASE_URL}/menu/items`, {
            ...item,
            category: { id: categoryId },
            isAvailable: true
        });
        console.log(`Added: ${item.title}`);
    } catch (e) {
        console.error(`Failed to add ${item.title}:`, e.message);
    }
}

async function populate() {
    try {
        console.log('Fetching all existing items to clear...');
        const allItemsRes = await axios.get(`${API_BASE_URL}/menu/items`);
        const allItems = allItemsRes.data.data;
        for (const item of allItems) {
            await axios.delete(`${API_BASE_URL}/menu/items/${item.id}`);
        }
        console.log('Cleared existing items.');

        console.log('Fetching categories...');
        const catsResponse = await axios.get(`${API_BASE_URL}/menu/categories`);
        let categories = catsResponse.data.data;

        const findOrCreate = async (name, icon, imageUrl) => {
            let cat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
            if (cat) {
                await axios.put(`${API_BASE_URL}/menu/categories/${cat.id}`, { ...cat, imageUrl });
                console.log(`Updated ${name} category.`);
                return cat;
            }
            console.log(`Creating ${name} category...`);
            const res = await axios.post(`${API_BASE_URL}/menu/categories`, { name, displayOrder: categories.length + 1, imageUrl });
            return res.data.data;
        };

        const burgerCat = await findOrCreate('Burgers', '🍔', burgerImg);
        const drinkCat = await findOrCreate('Drinks', '🥤', drinkImg);
        const sideCat = await findOrCreate('Sides', '🍟', friesImg);
        const dessertCat = await findOrCreate('Desserts', '🍰', brownieImg);
        const comboCat = await findOrCreate('Combos', '🍱', comboImg);

        console.log('\nPopulating Items...');

        for (const b of burgers) await postItem(b, burgerCat.id);
        for (const d of drinks) await postItem(d, drinkCat.id);
        for (const s of sides) await postItem(s, sideCat.id);
        for (const de of desserts) await postItem(de, dessertCat.id);
        for (const c of combos) await postItem(c, comboCat.id);

        console.log('\nSUCCESS: 50 items and 5 categories processed!');
    } catch (error) {
        console.error('Population failed:', error.response ? error.response.data : error.message);
    }
}

populate();
