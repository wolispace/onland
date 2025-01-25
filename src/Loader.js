import settings from "./settings.js";
import Hood from "./Hood.js";
import GameList from "./GameList.js";

/**
 * Loads the 9 land files around the neibourhood hoodKey eg '1_2'
 * Builds up the gameLists
 */
export default class Loader {

  backgroundColors = {};

  constructor(landName) {
    this.landName = landName ?? 'land';
  }

  /** 
   * Load land data when entering a new area
   * @param {object} app 
   * @param {string} hoodKey - key eg '0_0' or '4_6' lands are bigger than suburbs
   * @returns {Promise} Promise that resolves when all data is loaded
   */
  loadData(hoodKey, gameList) {
    // clear all previous background colours ready to setup a new set of 9 suburbs
    this.backgroundColors = {};
    const hood = new Hood(hoodKey);
    const filePromises = [];

    for (const hoodKey of hood.listReal) {
      //console.log('hoodKey', hoodKey);
      // Change file extension from .js to .json in the URL construction
      const filePromise = fetch(`lands/land_${hoodKey}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(loadedData => {
          if (loadedData.defaultData) {
            if (typeof (loadedData.defaultData) === "string") {
              const layerList = gameList.get(settings.DEFAULT);
              layerList.decode(loadedData.defaultData);
              layerList.expand(hoodKey);
            }
          }
          //TODO: allocate a backgroundcolor
        })
        .catch((error) => {
          console.error('Error loading JSON:', error);
        });
      filePromises.push(filePromise);
    }

    return Promise.all(filePromises)
      .then(() => {
        // All files have been read from disk so update the gameLists
        gameList.update();
      })
      .catch((error) => {
        console.error('Error loading files:', error);
      });
  }

  /**
  * Loads the js file ie one that has a js data object with more world data
  * @param {string} src path to a js file
  * @returns 
  */
  loadScript(hoodKey) {
    const filePath = `lands/${this.landName}_${hoodKey}.js`;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = filePath;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

}
