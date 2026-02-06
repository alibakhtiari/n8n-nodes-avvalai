const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Please enter your AvalAI API Key: ', async (apiKey) => {
    if (!apiKey) {
        console.error('API Key is required!');
        rl.close();
        return;
    }

    console.log('\nChecking credit balance...');

    try {
        const response = await fetch('https://api.avalai.ir/user/v1/credit', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('\n--- Credit Balance ---');
        console.log(JSON.stringify(data, null, 2));

    } catch (error) {
        console.error('\nError fetching credit balance:', error.message);
    } finally {
        rl.close();
    }
});
