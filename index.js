const fs = require('fs');

// Food class to handle automatic eating functionality
class Food {
  constructor(bot, foodListFile = 'foodlist.txt') {
    this.bot = bot;
    this.foodListFile = foodListFile;
    this.foodList = this.loadFoodList();

    // Initialize the module once the bot spawns
    this.bot.once('spawn', () => {
      console.log('Food module initialized. Loaded food list:', this.foodList);
      this.startAutoEat();
    });
  }

  /**
   * Load the list of consumable food items from the file.
   * If the file doesn't exist, use a default list.
   */
  loadFoodList() {
    let foodList = [];
    
    if (fs.existsSync(this.foodListFile)) {
      try {
        const content = fs.readFileSync(this.foodListFile, 'utf8');
        foodList = content
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);

        console.log('Loaded consumable food list:', foodList);
      } catch (err) {
        console.error('Error reading food list file:', err);
      }
    } else {
      console.warn(`Food list file "${this.foodListFile}" not found. Using default food list.`);
      foodList = ['minecraft:cooked_beef', 'minecraft:cooked_chicken', 'minecraft:bread'];
    }

    // Normalize food list to ensure each item starts with 'minecraft:'
    foodList = foodList.map(this.normalizeFoodName);
    return foodList;
  }

  /**
   * Normalize food item names to ensure consistency (e.g., add "minecraft:" prefix if missing).
   */
  normalizeFoodName(foodName) {
    return foodName.startsWith('minecraft:') ? foodName : `minecraft:${foodName}`;
  }

  /**
   * Start the periodic hunger check and eating logic.
   */
  startAutoEat() {
    setInterval(() => {
      const hunger = this.bot.food;

      console.log(`Current hunger level: ${hunger}`);

      if (hunger === undefined || hunger >= 20) {
        // Skip eating if bot is not hungry or hunger is already full
        console.log('Bot is not hungry or is already full.');
        return;
      }

      console.log(`Hunger detected at level ${hunger}. Searching for food...`);
      this.tryToEat();
    }, 2000); // Check every 2 seconds
  }

  /**
   * Attempt to eat food if available in the inventory.
   */
  async tryToEat() {
    const foodItem = this.findFoodInInventory();

    if (foodItem) {
      try {
        console.log(`Found food: ${foodItem.name} in inventory. Equipping to eat...`);
        await this.bot.equip(foodItem, 'hand');

        console.log('Consuming food...');
        await this.bot.consume();

        console.log(`Successfully consumed ${foodItem.name}.`);
      } catch (error) {
        console.error('Error consuming food:', error);
      }
    } else {
      console.log('No consumable food found in inventory.');
    }
  }

  /**
   * Search for a consumable food item in the inventory.
   */
  findFoodInInventory() {
    // Check the bot's inventory for matching food items
    for (let i = 0; i < 40; i++) {
      const item = this.bot.inventory.slots[i];
      if (item) {
        const normalizedFoodName = this.normalizeFoodName(item.name);

        console.log(`Checking inventory slot ${i}: ${item.name} (normalized: ${normalizedFoodName})`);

        // Compare normalized food names
        if (this.foodList.includes(normalizedFoodName)) {
          console.log(`Found consumable food: ${item.name} in slot ${i}.`);
          return item;
        }
      }
    }

    console.log('No matching food found in inventory slots.');
    return null;
  }
}

module.exports = Food;
