import { global } from "./global.js";

function move(event) {
  switch (event.key) {
    case "D":
    case "d":
      if (global.playerObject.xVelocity == 0)
        global.playerObject.switchCurrentSprites(12, 15);
      global.playerObject.xVelocity = 250;
      global.playerObject.yVelocity = 0;
      break;

    case "A":
    case "a":
      if (global.playerObject.xVelocity == 0)
        global.playerObject.switchCurrentSprites(8, 11);
      global.playerObject.xVelocity = -250;
      global.playerObject.yVelocity = 0;
      break;

    case "W":
    case "w":
      if (global.playerObject.xVelocity == 0)
      global.playerObject.switchCurrentSprites(4, 7);
      global.playerObject.xVelocity = 0;
      global.playerObject.yVelocity = -150;
      break;

    case "S":
    case "s":
      if (global.playerObject.xVelocity == 0)
      global.playerObject.switchCurrentSprites(0, 3);
      global.playerObject.xVelocity = 0;
      global.playerObject.yVelocity = 150;
      break;

    case "M":
    case "m":
      const breedingMachine = global.breedingM[0];
      if (breedingMachine) {
        breedingMachine.breedAnimals();
      };
      break;

    // case "R":
    // case "r":
    //   const resetMachine = global.breedingM[0];
    //   if (resetMachine) {
    //     resetMachine.resetAnimals();
    //   };
    //   break;
  };
};

function drop(event) {
  let currentAnimal = null;
  const breedingMachine = global.breedingM[0];

  //🆕 Helper function to drop animal
  function dropAnimal(slotIndex) {
    currentAnimal = global.collectedAnimals[slotIndex];

    if (currentAnimal) {
      //😀 Add explicit check for machine capacity
      if (global.animalsOnMachine.length >= 2) {
        console.log('Breeding machine is already full!');
        return;
      };
      if (!global.detectBoxCollision(global.playerObject, breedingMachine)) {
        //🆕 Drop at player's position
        currentAnimal.x = global.playerObject.x;
        currentAnimal.y = global.playerObject.y;
        currentAnimal.stored = false;
        currentAnimal.unpickable = true;

        //🆕 Clear the slot
        global.collectedAnimals[slotIndex] = null;

        setTimeout(() => {
          currentAnimal.unpickable = false;
        }, 2000);
        return;
      };

      //🆕 Add to breeding machine if colliding
      breedingMachine.addAnimalToMachine(currentAnimal);
      global.collectedAnimals[slotIndex] = null;
    };
  };

  //🆕 Map key presses to inventory slots
  switch (event.key) {
    case '1':
      dropAnimal(0);
      break;
    case '2':
      dropAnimal(1);
      break;
    case '3':
      dropAnimal(2);
      break;
    case '4':
      dropAnimal(3);
      break;
  };
};

function stop() {
  global.playerObject.xVelocity = 0;
  global.playerObject.yVelocity = 0;
};


function handlePopUp (event) {
  switch (event.key) {
    case "P":
    case "p":
      if (global.popUp.active === false) {
        global.popUp.active = true
        global.gamePaused = true;
        global.popUp.draw();
      }
      else if (global.popUp.active === true) {
        global.popUp.active = false
        global.gamePaused = false;
      }     
      break;
  };
};

document.addEventListener("keypress", move);
document.addEventListener("keypress", drop);
document.addEventListener("keyup", stop);
document.addEventListener("keypress", handlePopUp);
