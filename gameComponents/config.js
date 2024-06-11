const config = {
  game: {
    renderInterval: 10, // render interval in milliseconds
    gravity: 0.8, // gravity effect
  },
  dino: {
    speed: window.innerWidth * 0.05,
    jumpInterval: 15, // jump interval that compute gravity in milliseconds
  },
  background: {
    speed: 5,
  },
  obstacle: {
    minGenerateInterval: 800, // minimum interval for generating obstacles in milliseconds in the beginning
    maxGenerateInterval: 1700, // maximum interval for generating obstacles in milliseconds in the beginning
    generateLimit: 100, // Smallest interval for generating obstacles in milliseconds
    minSpeed: 5, // minimum obstacle speed
    maxSpeed: 8, // maximum obstacle speed
    decreaseGenerateInterval: 50, // decrease obstacle interval for this interval (For every level decrease the obstacle generate interval)
  },
  score: {
    interval: 100, // update score in milliseconds
    levelInterval: 50, // update level for this interval (For every 50 points increase the level)
  },
  item: {
    speed: 3, // item speed
    minGenerateInterval: 1000, // minimum interval for generating items
    maxGenerateInterval: 3000, // maximum interval for generating items
    bombHeight: "70vh", // bomb top position
    jumpBoostHeight: "50vh", // jump boost top position
    jumpBoostEffect: 2, // value that will divide the gravity
    jumpBoostExpiration: 5000, // jump boost effect expiration time in milliseconds
  },
};

export default config;
