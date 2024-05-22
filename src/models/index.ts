import fs from 'fs';
import path from 'path';

// Define the directory path where your model files are located
const modelsDirectory = path.join(__dirname, '');

// Function to import all model classes from the directory
export function importModels(): Record<string, any> {
    const models: Record<string, any> = {};

    // Read the contents of the directory
    const files = fs.readdirSync(modelsDirectory);

    // Iterate over each file in the directory
    files.forEach((file) => {
        // Check if the file is a TypeScript file and not the current file
        if (file.endsWith('.ts') && file !== 'index.ts') {
            // Import the model class from the file
            const model = require(path.join(modelsDirectory, file));
            
            // Extract the model class from the module
            const modelName = Object.keys(model)[0];
            const ModelClass = model[modelName];
            
            // Add the model class to the models object
            models[modelName] = ModelClass;
        }
    });

    return models;
};