const axios = require('axios');

async function fetchImageAndConvertToBase64(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        const base64Image = buffer.toString('base64');

        const base64Url = `data:image/jpeg;base64,${base64Image}`;

        return base64Url;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

module.exports = {
    fetchImageAndConvertToBase64
}