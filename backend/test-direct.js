async function listAvailableModels() {
  const apiKey = 'AIzaSyBtqJgCYvysTWoVG3VnSUNAUcaYdhpTOrU';
  
  // Try both API versions
  const versions = ['v1beta', 'v1'];
  
  for (const version of versions) {
    console.log(`\n=== Checking API ${version} ===`);
    const url = `https://generativelanguage.googleapis.com/${version}/models?key=${apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok && data.models) {
        console.log(`✓ Found ${data.models.length} models:\n`);
        
        data.models.forEach(model => {
          console.log(`Model: ${model.name}`);
          console.log(`  Display Name: ${model.displayName || 'N/A'}`);
          console.log(`  Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('✗ Error:', data.error?.message || 'Unknown error');
      }
      
    } catch (error) {
      console.error('✗ Fetch error:', error.message);
    }
  }
}

listAvailableModels();