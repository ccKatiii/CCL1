import { global } from '../modules/global.js';
import { BaseGameObject } from './baseGameObject.js';

class animals extends BaseGameObject {
  name = "animals";
  type = "";
  stored = false;
  name = "";
  //😀 Add inventory position and size tracking
  inventoryX = null;
  inventoryY = null;
  originalWidth = null;
  originalHeight = null;
  inventoryWidth = 85;
  inventoryHeight = 85;
  machineWidth = 50;
  machineHeight = 50;
  imageSrc = "";

  reactToCollision = function (collidingObject) {
    switch (collidingObject.name) {
      case "mainCharacter":
        //🆕 Check if animal is temporarily unpickable
        if (this.unpickable) {
          console.log("Animal is temporarily unpickable.");
          return;
        };
  
        //🆕 Check if there's an empty slot in the inventory
        const emptySlotIndex = global.collectedAnimals.findIndex(slot => slot === null);
        
        if (emptySlotIndex !== -1 && !this.stored && !global.animalsOnMachine.includes(this)) {
          //🆕 Store in the first available slot
          global.collectedAnimals[emptySlotIndex] = this;
          const wasStoredAlready = global.animalCollectionList.includes(this.type);
              

          if (!wasStoredAlready) {
            global.animalCollectionList.push(this.type);
          }
          console.log( global.animalCollectionList)
          console.log( global.animalCollectionList)
          const baseX = 735;
          const baseY = -10;
          const offsetX = 85 + 20;
  
          this.x = baseX + emptySlotIndex * offsetX;
          this.y = baseY;
          this.inventoryX = this.x;
          this.inventoryY = this.y;
  
          this.width = this.inventoryWidth;
          this.height = this.inventoryHeight;
          this.stored = true;
          this.inventorySlot = emptySlotIndex;
        }
        break;
  
      case "breedingM":
        if (!global.animalsOnMachine.includes(this)) {
          global.animalsOnMachine.push(this);
          const slot = global.animalsOnMachine.length - 1;
          this.x = collidingObject.x + (slot === 0 ? 75 : 143);
          this.y = collidingObject.y + 7;

          // ✅ Store original size before resizing
          if (!this.originalWidth) this.originalWidth = this.width;
          if (!this.originalHeight) this.originalHeight = this.height;

          console.log(` ${this.type} placed in machine. Original: ${this.originalWidth}x${this.originalHeight}, New: ${this.machineWidth}x${this.machineHeight}`);

          this.width = this.machineWidth;
          this.height = this.machineHeight;
        }
        break;
    };
  };

  constructor(x, y, width, height, type, name) {
    super(x, y, width, height);

    this.originalWidth = width;  // ✅ Store the original width
    this.originalHeight = height; // ✅ Store the original height

    console.log(`🟢 Created ${this.type} with original size: ${this.originalWidth}x${this.originalHeight}`);

    this.type = type;
    let imageSrc;
    let spriteRows;
    let spriteCols;
    let totalSprites;

    switch (type) {
        case "cat":
            if (name === "ferrox") {
                imageSrc = "../../images/ferrox128.png"; // Black cat
            } else if (name === "spooky") {
                imageSrc = "../../images/spooky128.png"; // Grey cat
            }
            spriteRows = 4;
            spriteCols = 4;
            totalSprites = 12;
            break;
        case "fish":
            imageSrc = "../../images/fish128.png";
            spriteRows = 3;
            spriteCols = 4;
            totalSprites = 9;
            break;
        case "chicken":
            imageSrc = "../../images/chicken128.png";
            spriteRows = 5;
            spriteCols = 5;
            totalSprites = 20;
            break;
    };

    this.loadImagesFromSpritesheet(imageSrc, spriteRows, spriteCols);
    this.switchCurrentSprites(0, totalSprites);
  };
};

export { animals };