import { global } from '../modules/global.js';
import { BaseGameObject } from "./baseGameObject.js";

class MixedAnimal extends BaseGameObject {
    name = "mixedAnimal";
    type = ""; // 🆕 Type derived from parent animals

    constructor(x, y, width, height, type) {
        super(x, y, width, height);
        this.type = type;
        this.setImageByType(type);
        // console.log('create mixed animal at position: ' + this.x + ' - ' + this.y);
    };

    setImageByType = function (type) {
        let imageSrc;
        let spriteRows;
        let spriteCols;
        let totalSprites;

        switch (type) {
            case "cat-fish":
            case "fish-cat":
                imageSrc = "../../images/catFish128.png";
                spriteRows = 3;
                spriteCols = 3;
                totalSprites = 6;
                break;
            case "chicken-cat":
            case "cat-chicken":
                imageSrc = "../../images/chickenCat128.png";
                spriteRows = 4;
                spriteCols = 4;
                totalSprites = 13;
                break;
            case "fish-chicken":
            case "chicken-fish":
                imageSrc = "../../images/fishChicken128.png";
                spriteRows = 3;
                spriteCols = 3;
                totalSprites = 6;
                break;
            default:
                console.error(`Unknown type: ${type}`);
                break;
        };

        console.log(imageSrc)

        this.loadImagesFromSpritesheet(imageSrc, spriteRows, spriteCols);
        this.switchCurrentSprites(0, totalSprites);
    };

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
              const baseX = 735;
              const baseY = -10;
              const offsetX = 85 + 10;
      
              this.x = baseX + emptySlotIndex * offsetX;
              this.y = baseY;
              this.inventoryX = this.x;
              this.inventoryY = this.y;
      
              //🆕 Add inventory-specific properties
              this.inventoryWidth = 80;
              this.inventoryHeight = 80;
      
              this.width = this.inventoryWidth;
              this.height = this.inventoryHeight;
              this.stored = true;
              this.inventorySlot = emptySlotIndex;
              console.log(`Mixed animal stored in slot ${emptySlotIndex}`);
            }
            break;
        };
    };

};

export { MixedAnimal };
