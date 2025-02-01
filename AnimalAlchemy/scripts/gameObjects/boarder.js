import { BaseGameObject } from "./baseGameObject.js";

class boarder extends BaseGameObject {

    name = "boarder";
    
    //comment out draw to see the red blocks and enable them again to make them invisible
    draw = function () {
    };

    constructor(x, y, width, height, imageSrc) {
        super(x, y, width, height);
        this.image = new Image();
        this.image.src = imageSrc;
    };
};

export {boarder};