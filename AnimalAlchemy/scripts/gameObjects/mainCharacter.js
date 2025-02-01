import { BaseGameObject } from "./baseGameObject.js";
import { global } from "../modules/global.js";

class mainCharacter extends BaseGameObject {
    name = "mainCharacter"
    xVelocity = 0;
    yVelocity = 0;

    getBoxBounds = function () {
        let bounds = {
            left: this.x + 20,
            right: this.x + this.width - 20,
            top: this.y + 30,
            bottom: this.y + this.height
        }
        return bounds;
    };


    reactToCollision = function(collidingObject) {
        switch (collidingObject.name) {
            case "boarder":
                console.log("collision?!")
                this.xVelocity = 0;
                this.yVelocity = 0;
                this.x = this.previousX;
                this.y = this.previousY;
                break;

            case "exit":
                console.log("collision Exittt ?!")
                this.xVelocity = 0;
                this.yVelocity = 0;
                this.x = this.previousX;
                this.y = this.previousY;
                break;

            case "breedingM":
                // console.log("collision BM ?!")
                this.xVelocity = 0;
                this.yVelocity = 0;
                this.x = this.previousX;
                this.y = this.previousY;
                break;
           
        };
    };




    update = function () {
        const clampedDeltaTime = Math.min(global.deltaTime, 0.05); // Limit to 50ms per frame
        this.x += this.xVelocity * clampedDeltaTime;
        this.y += this.yVelocity * clampedDeltaTime;

        // console.log(`Velocity: (${this.xVelocity}, ${this.yVelocity}), Position: (${this.x}, ${this.y})`);
    
        if (this.xVelocity === 0 && this.yVelocity === 0) {
            global.playerObject.switchCurrentSprites(this.animationData.firstSpriteIndex, this.animationData.firstSpriteIndex);
        };
    };
    
    

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.loadImagesFromSpritesheet("../images/main.png", 4, 4);
        // console.log ("hilfee is it wrorking")
    };
};


export {mainCharacter}