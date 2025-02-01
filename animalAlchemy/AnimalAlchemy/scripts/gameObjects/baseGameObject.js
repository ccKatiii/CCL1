import { global } from "../modules/global.js"

class BaseGameObject {
    active = true;
    name = "";
    x = 100;
    y = 500;
    previousX = 0;
    previousY = 0;
    width = 85;
    height = 85;

    animationData = {
        "animationSprites": [],
        "timePerSprite": 0.08,
        "currentSpriteElapsedTime": 0,
        "firstSpriteIndex": 0,
        "lastSpriteIndex": 0,
        "currentSpriteIndex": 0
    };

    storePositionOfPreviousFrame = function () {
        this.previousX = this.x;
        this.previousY = this.y;
    };

    getBoxBounds = function () {
        let bounds = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        }
        return bounds;
    };

    update = function () { 
    };

    draw = function () {
        let sprite = this.getNextSprite();
        if (sprite) { // Ensure sprite is not null or undefined
            sprite.onload = () => {
                global.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            };
            // If the sprite is already loaded, draw it immediately
            if (sprite.complete) {
                global.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
            }
        } else {
            console.warn("No sprite available for drawing.");
        };
    };
    

   
    getNextSprite = function () {
        //is here because of images that don't have a sprite sheet but only 1 image
        if (this.image !== undefined) {
            return this.image;
        };
    
        this.animationData.currentSpriteElapsedTime += global.deltaTime;
    
        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            this.animationData.currentSpriteIndex++;
            this.animationData.currentSpriteElapsedTime = 0;
            
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex;
            };
        };
    
        const sprite = this.animationData.animationSprites[this.animationData.currentSpriteIndex];
        if (!sprite || !sprite.complete) {
            console.log('Sprite not ready for drawing:', sprite);
            return null; // Return null if the sprite is not ready
        };
        return sprite;
    };
    


    loadImages = function (imageSources) {
        /* first load images from path */

        for (let i = 0; i < imageSources.length; i++) {
            let image = new Image();
            image.src = imageSources[i];
            
            image.onload =() => {
                console.log(`Image ${i} loaded successfully.`)
            };

            image.onerror = () => {
                console.error(`Failed to load image: ${imageSources[i]}`);
            };
            /* after images have been loaded, they are added to an array that consists of each single sprite for our animation */
            this.animationData.animationSprites.push(image);
        };

    };

    loadImagesFromSpritesheet(spritesheetPath, cols, rows) {
        // Calculate the number of rows and columns
        //const cols = Math.floor(spritesheetWidth / singleSpriteWidth);
        //const rows = Math.floor(spritesheetHeight / singleSpriteHeight);
        const totalSprites = cols * rows;
    
        // Pre-create an array with `Image` objects for all sprites
        this.animationData.animationSprites = Array.from({ length: totalSprites }, () => new Image());
    
        // Load the spritesheet
        const spritesheet = new Image();
        spritesheet.src = spritesheetPath;
    
        // Add a "load" event listener to the spritesheet
        spritesheet.addEventListener("load", () => {
            const spritesheetWidth = spritesheet.width;
            const spritesheetHeight = spritesheet.height;
            const singleSpriteWidth = Math.floor(spritesheetWidth / cols);
            const singleSpriteHeight = Math.floor(spritesheetHeight / rows);


            // Create a temporary canvas to extract sprites from the spritesheet
            const tempSpritesheetCanvas = document.createElement("canvas");
            const tempSpritesheetCtx = tempSpritesheetCanvas.getContext("2d");
            tempSpritesheetCanvas.width = singleSpriteWidth;
            tempSpritesheetCanvas.height = singleSpriteHeight;

            // Loop through each sprite's row and column position
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                
                    // Clear the temporary canvas and draw the specific sprite region from the spritesheet
                    tempSpritesheetCtx.clearRect(0, 0, singleSpriteWidth, singleSpriteHeight);
                    tempSpritesheetCtx.drawImage(
                        spritesheet,
                        col * singleSpriteWidth,
                        row * singleSpriteHeight,
                        singleSpriteWidth,
                        singleSpriteHeight,
                        0,
                        0,
                        singleSpriteWidth,
                        singleSpriteHeight
                    );
    
                    // assign it to the corresponding Image object
                    const index = row * cols + col;
                    const spriteImage = new Image();
                    spriteImage.src = tempSpritesheetCanvas.toDataURL();
                    spriteImage.onload = () => {
                        // console.log(`Sprite ${index} loaded successfully.`);
                        this.animationData.animationSprites[index] = spriteImage;
                    };
                    spriteImage.onerror = () => {
                        // console.error(`Failed to load sprite ${index}.`);
                    };                
                };
            };
        });
    };



    switchCurrentSprites = function (firstSpriteIndex, lastSpriteIndex) {
        this.animationData.currentSpriteIndex = firstSpriteIndex;
        this.animationData.firstSpriteIndex = firstSpriteIndex;
        this.animationData.lastSpriteIndex = lastSpriteIndex;
    };

    reactToCollision = function(collidingObject) {
    };

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.previousX = x;
        this.previousY = y;
        global.allGameObjects.push(this);
    };

};  

export {BaseGameObject}