const fdown = require('./scrape/fdown'); // Import the fdown module


document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const videoUrl = document.getElementById('videoUrl').value;
    const resultDiv = document.getElementById('result');

    if (!videoUrl) {
        resultDiv.textContent = 'Please enter a video URL.';
        return;
    }

    if (!/^http(s)?:\/\/fdown\.net/i.test(videoUrl)) {
        resultDiv.textContent = 'Invalid URL. Make sure it comes from fdown.net.';
        return;
    }

    resultDiv.textContent = '🔍 Searching for the video... Please wait.';

    try {
        const result = await fdown.download(videoUrl);

        if (result && result.length > 0) {
            const videoDetails = result[0];
            resultDiv.innerHTML = `
                <p>📂 Video Found! 📂</p>
                <p>📄 Title: ${videoDetails.title}</p>
                <p>🔢 Description: ${videoDetails.description}</p>
                <p>📏 Duration: ${videoDetails.duration}</p>
                <a href="${videoDetails.hdQualityLink || videoDetails.normalQualityLink}" target="_blank">Download Video</a>
            `;
        } else {
            resultDiv.textContent = 'Error: Unable to find video sources.';
        }
    } catch (error) {
        console.error(error);
        resultDiv.textContent = 'Error: ' + error.message;
    }
});
