const fs = require('fs');

const categories = {
  animals: { label: 'Animals', emoji: '🦁', words: ['Lion', 'Penguin', 'Dolphin', 'Elephant', 'Eagle', 'Shark', 'Octopus', 'Cheetah', 'Gorilla', 'Flamingo', 'Tiger', 'Bear', 'Wolf', 'Fox', 'Kangaroo', 'Giraffe', 'Zebra', 'Rhino', 'Hippo', 'Crocodile', 'Snake', 'Turtle', 'Frog', 'Toad', 'Lizard', 'Chameleon', 'Monkey', 'Ape', 'Lemur', 'Sloth'] },
  places: { label: 'Places', emoji: '🌍', words: ['Casino', 'Hospital', 'Airport', 'Library', 'Submarine', 'Space Station', 'Circus', 'Pirate Ship', 'Museum', 'Ski Resort', 'School', 'Supermarket', 'Bank', 'Post Office', 'Police Station', 'Fire Station', 'Restaurant', 'Cafe', 'Bakery', 'Cinema', 'Theatre', 'Stadium', 'Gym', 'Park', 'Beach', 'Forest', 'Mountain', 'Desert', 'Island', 'Cave'] },
  food: { label: 'Food & Drink', emoji: '🍔', words: ['Pizza', 'Sushi', 'Chocolate', 'Taco', 'Ice Cream', 'Burger', 'Croissant', 'Ramen', 'Espresso', 'Fondue', 'Pasta', 'Steak', 'Salad', 'Soup', 'Sandwich', 'Pancake', 'Waffle', 'Donut', 'Cake', 'Pie', 'Cookie', 'Muffin', 'Bread', 'Cheese', 'Bacon', 'Sausage', 'Egg', 'Apple', 'Banana', 'Orange'] },
  sports: { label: 'Sports', emoji: '⚽', words: ['Chess', 'Surfing', 'Fencing', 'Archery', 'Polo', 'Curling', 'Skydiving', 'Gymnastics', 'Bobsled', 'Rowing', 'Football', 'Basketball', 'Tennis', 'Baseball', 'Golf', 'Volleyball', 'Table Tennis', 'Badminton', 'Rugby', 'Cricket', 'Hockey', 'Boxing', 'Wrestling', 'Martial Arts', 'Swimming', 'Cycling', 'Athletics', 'Weightlifting', 'Skiing', 'Snowboarding'] },
  technology: { label: 'Technology', emoji: '💻', words: ['Drone', 'Blockchain', 'Satellite', 'Laser', 'Robot', 'Algorithm', 'Encryption', 'Neural Net', 'VR Headset', 'Quantum Computer', 'Smartphone', 'Tablet', 'Laptop', 'Smartwatch', 'Camera', 'Microphone', 'Speaker', 'Headphones', 'Router', 'Modem', 'Server', 'Database', 'Cloud', 'Network', 'Software', 'Hardware', 'Processor', 'Memory', 'Battery', 'Screen'] },
  movies: { label: 'Movies', emoji: '🎬', words: ['Heist Film', 'Western', 'Musical', 'Documentary', 'Horror', 'Sci-Fi', 'Noir', 'Mockumentary', 'Anime', 'Thriller', 'Action', 'Comedy', 'Drama', 'Romance', 'Fantasy', 'Adventure', 'Mystery', 'Crime', 'Family', 'Animation', 'Biography', 'History', 'War', 'Sport', 'Music', 'Short', 'Silent', 'Indie', 'Blockbuster', 'Cult Classic'] },
  simple_words: { label: 'Simple Words', emoji: '📝', words: ['Dog', 'Cat', 'Bird', 'Fish', 'Tree', 'Flower', 'Sun', 'Moon', 'Star', 'Cloud', 'Rain', 'Snow', 'Wind', 'Fire', 'Water', 'Earth', 'Rock', 'Sand', 'Dirt', 'Grass', 'Leaf', 'Branch', 'Root', 'Seed', 'Fruit', 'Nut', 'Berry', 'Vegetable', 'Meat', 'Bone'] },
  clothing: { label: 'Clothing', emoji: '👕', words: ['Shirt', 'Pants', 'Dress', 'Skirt', 'Jacket', 'Coat', 'Sweater', 'Hoodie', 'T-shirt', 'Jeans', 'Shorts', 'Socks', 'Shoes', 'Boots', 'Sneakers', 'Sandals', 'Hat', 'Cap', 'Beanie', 'Scarf', 'Gloves', 'Mittens', 'Belt', 'Tie', 'Bow Tie', 'Glasses', 'Sunglasses', 'Watch', 'Ring', 'Necklace'] }
};

let output = 'export const WORD_BANK = {\n';

for (const [key, cat] of Object.entries(categories)) {
  output += `  ${key}: {\n    label: '${cat.label}',\n    emoji: '${cat.emoji}',\n    entries: [\n`;
  cat.words.forEach((word, index) => {
    // Beginner hint: Simple hint with first letter and length
    const bHint = `Begins with ${word.charAt(0)}, has ${word.length} letters`;
    // Intermediate hint: Type of category
    const iHint = `A type of ${cat.label.toLowerCase()}`;
    // Advanced hint: Specific entity in category
    const aHint = `A specific entity in the ${cat.label.toLowerCase()} category`;
    
    output += `      { id: '${key}_${String(index).padStart(3, '0')}', word: '${word}', hints: { beginner: '${bHint}', intermediate: '${iHint}', advanced: '${aHint}' } },\n`;
  });
  output += `    ]\n  },\n`;
}
output += '};\n';

fs.writeFileSync('src/data/categories.js', output);
console.log('categories.js generated.');
