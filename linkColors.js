const fs = require('fs');
const path = require('path');

// Function to load a JSON file
const loadJsonFile = (filePath) => {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Recursive function to replace color references in semantic tokens
const replaceReferences = (obj, globalColors) => {
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object') {
      replaceReferences(obj[key], globalColors); // Recursive call for nested objects
    } else if (typeof obj[key] === 'string') {
      const match = obj[key].match(/{(.+?)}/); // Regex to find references like {Color.100}
      if (match) {
        const [colorCategory, colorShade] = match[1].split('.');
        if (globalColors[colorCategory] && globalColors[colorCategory][colorShade]) {
          obj[key] = globalColors[colorCategory][colorShade].value; // Replace reference with actual value
        }
      }
    }
  });
};

// Main function to link Semantic.json to Global.json
const linkColors = () => {
  const globalColorsPath = path.join(__dirname, 'Global.json');
  const semanticPath = path.join(__dirname,'Semantic.json');
  const outputPath = path.join(__dirname,'UpdatedSemantic.json');

  const globalColors = loadJsonFile(globalColorsPath);
  const semantic = loadJsonFile(semanticPath);

  replaceReferences(semantic, globalColors);

  // Save the updated Semantic.json
  fs.writeFileSync(outputPath, JSON.stringify(semantic, null, 2));
  console.log('Updated Semantic.json has been saved.');
};

linkColors();