import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBtqJgCYvysTWoVG3VnSUNAUcaYdhpTOrU');

async function listModels() {
  try {
    console.log('Checking available models...\n');
    
    const models = [
      'gemini-pro',
      'gemini-1.0-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b'
    ];
    
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✓ ${modelName} - WORKS`);
      } catch (error) {
        console.log(`✗ ${modelName} - NOT AVAILABLE`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();