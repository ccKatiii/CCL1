import { global } from "../modules/global.js";
import { BaseGameObject } from "./baseGameObject.js";

class popUp extends BaseGameObject {

    name = "popUp";
   active = false;

    constructor(x, y, width, height, ) {
        super(x, y, width, height);
    };

    draw = function () {
        global.ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        global.ctx.fillRect(190, 100, 800, 600); 
    
        const imagesPerRow = 2; // Number of images per row
        const imageSize = 130; // Width and height of each image
        const spacingX = 250; // Horizontal spacing between columns
        const spacingY = 20; // Vertical spacing between rows
        const startX = 300; // Starting X position for images
        const startY = 100; // Starting Y position for images
    
        for (let i = 0; i < global.allAnimalsImages.length; i++) {
            let imagesPath = global.allAnimalsImages[i];
            const image = new Image();
    
            // Calculate x and y positions dynamically
            const x = startX + (i % imagesPerRow) * (imageSize + spacingX);
            const y = startY + Math.floor(i / imagesPerRow) * (imageSize + spacingY);
    
            image.addEventListener("load", function () {
                global.ctx.drawImage(this, x, y, imageSize, imageSize);
            });
    
            image.src = imagesPath; // Set the image source
        };
    };
};

export {popUp};