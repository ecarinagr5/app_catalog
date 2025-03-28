/*** Function to handle Calls ***/
async function sendDataToApi(endpoint, csvContent) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                "Content-Type": "text/csv", // ✅ Important
            },
            body: csvContent,
        });

        if (!response.ok) {
            const errorContent = await response.json();
            throw new Error(`HTTP Error: ${response.status} - ${errorContent.message || ''}`);
        }

        return await response.json(); // Assuming you want to return response data
    } catch (error) {
        console.error(`Error sending data to ${endpoint}:`, error);
        throw error; // Re-throw to handle higher up if needed
    }
}

export default sendDataToApi;