How to install
```
npm i @fourterms2/mineflayer-eat
```

example code:
```
const mineflayer = require('mineflayer');
const Food = require('mineflayer-eat');  // Import the mineflayer-totem package

// Create the bot
const bot = mineflayer.createBot({
  host: 'localhost',  // Replace with your server's IP or hostname
  port: 25565,        // Replace with your server's port
  username: 'Bot',    // Replace with your bot's username
  auth: 'microsoft',  // Authentication type
});

// Initialize the Food module
const FoodModule = new Food(bot, 'foodlist.txt'); // Use a different variable name to avoid conflicts

```

my github
```
https://github.com/GamerMrAlros/mineflayer-totem
```