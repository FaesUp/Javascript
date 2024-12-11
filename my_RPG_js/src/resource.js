class Resources {
  constructor() {
    this.toLoad = {
      sky: "sprites/sky.png",
      ground: "sprites/ground.png",
      hero: "sprites/hero-sheet.png",
      shadow: "sprites/shadow.png",
      rod: "/sprites/rod.png",
    };

    this.images = {};

    Object.keys(this.toLoad).forEach((key) => {
      const img = new Image();
      img.src = this.toLoad[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };
      img.onload = () => {
        this.images[key].isLoaded = true;
        //console.log(`${key} loaded`);
      };
      img.onerror = () => {
        //console.error(`Error loading ${key}`);
      };
    });
  }
}

export const resources = new Resources();