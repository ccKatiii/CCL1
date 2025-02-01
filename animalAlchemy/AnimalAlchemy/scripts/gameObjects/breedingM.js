import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";
import { MixedAnimal } from "./mixedAnimal.js";

class breedingM extends BaseGameObject {
    name = "breedingM";
    
    hasSpace = function () {
        return global.animalsOnMachine.length < 2;
    };

    canBreed = function () {
        return global.animalsOnMachine.length === 2;
    };

    resetAnimals = function () {
      while (global.animalsOnMachine.length > 0) {
          const animal = global.animalsOnMachine.pop();
  
          // Ensure original size is not null
          if (animal.originalWidth && animal.originalHeight) {
              console.log(`🔄 Resetting ${animal.type} from ${animal.width}x${animal.height} to original ${animal.originalWidth}x${animal.originalHeight}`);
              animal.width = animal.originalWidth;
              animal.height = animal.originalHeight;
          } else {
              console.warn(`⚠️ Warning: originalWidth/originalHeight is missing for ${animal.type}`);
          }
  
          // Find the first empty inventory slot
          const emptySlotIndex = global.collectedAnimals.findIndex(slot => slot === null);
  
          if (emptySlotIndex !== -1) {
              animal.x = 735 + emptySlotIndex * (85 + 20);
              animal.y = -10; // Adjusted position to match inventory height
              animal.inventoryX = animal.x;
              animal.inventoryY = animal.y;
              animal.stored = true;
  
              console.log(`📦 ${animal.type} placed back in inventory slot ${emptySlotIndex} at (${animal.x}, ${animal.y})`);
  
              // Place the animal back in the inventory
              global.collectedAnimals[emptySlotIndex] = animal;
          } else {
              console.warn(`⚠️ No available inventory slot for ${animal.type}.`);
          }
      }
  };
  
      addAnimalToMachine = function (animal) {
        console.error('WRKS""""""""!!!!!!!!')
        if (!this.hasSpace()) {
          console.log('Machine is full.');
          return;
        }
    
        //🆕 Remove animal from its inventory slot
        const slotIndex = global.collectedAnimals.indexOf(animal);
        if (slotIndex !== -1) {
          global.collectedAnimals[slotIndex] = null;
        }
    
        const slot = global.animalsOnMachine.length;
        animal.x = this.x + (slot === 0 ? 75 : 143);
        animal.y = this.y + 7;
        animal.stored = false;
        global.animalsOnMachine.push(animal);
      };

    //😀 New method to check player collision
    isPlayerColliding = function () {
    return global.detectBoxCollision(this, global.playerObject);
    };

    //😀 Fixed screen shake to preserve canvas position
    screenShake = function () {
        const canvas = global.canvas;
        const originalTransform = canvas.style.transform || 'translate(0px, 0px)';
        let shakeAmount = 5;
        let iterations = 0;
        
        const interval = setInterval(() => {
            const offsetX = (iterations % 2 === 0 ? shakeAmount : -shakeAmount);
            canvas.style.transform = `translate(${offsetX}px, 0px)`;
            
            iterations++;
            if (iterations > 10) {
                clearInterval(interval);
                canvas.style.transform = originalTransform;
            }
        }, 50);
    };

    breedAnimals = function () {
        if (this.canBreed()) {
            const [animal1, animal2] = global.animalsOnMachine;
            this.screenShake();

            setTimeout(() => {
                // Reset original animals to inventory with their original positions
                const emptySlot1 = global.collectedAnimals.findIndex(
                  (slot) => slot === null
                );
                const emptySlot2 = global.collectedAnimals.findIndex(
                  (slot, index) => slot === null && index !== emptySlot1
                );
        
                //🆕 Ensure there are empty slots before resetting
                if (emptySlot1 !== -1 && emptySlot2 !== -1) {
                  animal1.stored = true;
                  animal2.stored = true;
        
                  const baseX = 735;
                  const baseY = -10;
                  const offsetX = 85 + 20;
        
                  animal1.x = baseX + emptySlot1 * offsetX;
                  animal1.y = baseY;
                  animal1.inventoryX = animal1.x;
                  animal1.inventoryY = animal1.y;
        
                  animal2.x = baseX + emptySlot2 * offsetX;
                  animal2.y = baseY;
                  animal2.inventoryX = animal2.x;
                  animal2.inventoryY = animal2.y;
        
                  global.collectedAnimals[emptySlot1] = animal1;
                  global.collectedAnimals[emptySlot2] = animal2;
        
                  // Create a new mixed animal
                  const mixedType = `${animal1.type}-${animal2.type}`;
                  const mixedAnimal = new MixedAnimal(
                    this.x - 120,
                    this.y - 10,
                    90,
                    90,
                    mixedType
                  );
        
                  global.allGameObjects.push(mixedAnimal);
                  global.animals.push(mixedAnimal);
        
                  // Clear the machine
                  global.animalsOnMachine = [];
                  console.log(`New mixed animal created: ${mixedType}`);
                } else {
                  console.log('Not enough inventory slots to reset animals.');
                }
              }, 1500);
            } else {
              console.log('Breeding failed: Not enough animals.');
            }
          };

    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height);
        this.image = new Image();
        this.image.src = imageSrc;
    }
}

export { breedingM };