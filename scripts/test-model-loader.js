/**
 * Test script for Avvalai Model Loader
 * This script mimics the logic in helpers.ts/fetchModelList
 * 
 * Run with: node --env-file=.env scripts/test-model-loader.js
 */

const AVVALAI_API_KEY = process.env.AAVALAI_API_KEY;
const AVVALAI_BASE_URL = 'https://api.avalai.ir/v1';

async function testModelLoader() {
    console.log('--- Avvalai Model Loader Test ---');
    console.log(`Base URL: ${AVVALAI_BASE_URL}`);

    if (!AVVALAI_API_KEY) {
        console.error('Error: AAVALAI_API_KEY not found in environment.');
        console.log('Please ensure your .env file contains: AAVALAI_API_KEY="your-key-here"');
        process.exit(1);
    }

    console.log('Fetching models...');

    try {
        const response = await fetch(`${AVVALAI_BASE_URL}/models`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${AVVALAI_API_KEY}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        let models = data;
        if (data && data.data && Array.isArray(data.data)) {
            models = data.data;
        }

        if (!Array.isArray(models)) {
            console.error('Unexpected response format:', data);
            return;
        }

        console.log(`Successfully fetched ${models.length} models.`);

        // Group by mode
        const groups = {};
        models.forEach(m => {
            const mode = m.mode || 'unknown';
            if (!groups[mode]) groups[mode] = 0;
            groups[mode]++;
        });

        console.log('\nModels by Mode:');
        Object.entries(groups).forEach(([mode, count]) => {
            console.log(` - ${mode}: ${count}`);
        });

        console.log('\nSample Chat Models (Top 5):');
        models
            .filter(m => m.mode === 'chat' || (!m.mode && !m.id.includes('image') && !m.id.includes('embed')))
            .slice(0, 5)
            .forEach(m => {
                console.log(` - ${m.id} (${m.owned_by || 'unknown'})`);
            });

        console.log('\n--- Test Passed ---');
    } catch (error) {
        console.error('\n--- Test Failed ---');
        console.error(error.message);
    }
}

testModelLoader();
