const express = require('express');
const http = require('http');
const app = express();

const PORT = process.env.PORT || 9876; 

function extractStoriesFromHTML(htmlContent) {
    const stories = [];
    const startIndex = htmlContent.indexOf('<a class="story-module__link"');
    let remainingHtml = htmlContent.substring(startIndex);
    
    for (let i = 0; i < 6; i++) {
        const titleStartIndex = remainingHtml.indexOf('<h3>') + 4;
        const titleEndIndex = remainingHtml.indexOf('</h3>');
        const title = remainingHtml.substring(titleStartIndex, titleEndIndex).trim();
        
        const linkStartIndex = remainingHtml.indexOf('href="') + 6;
        const linkEndIndex = remainingHtml.indexOf('"', linkStartIndex);
        const link = remainingHtml.substring(linkStartIndex, linkEndIndex);
        
        stories.push({ title, link });
        
        remainingHtml = remainingHtml.substring(linkEndIndex);
    }
    
    return stories;
}

app.get('/getTimeStories', (req, res) => {
    http.get('http://time.com', (response) => {
        let htmlContent = '';

        response.on('data', (chunk) => {
            htmlContent += chunk;
        });

        response.on('end', () => {
            const latestStories = extractStoriesFromHTML(htmlContent);
            res.json(latestStories);
        });
    }).on('error', (error) => {
        console.error('Error fetching data from Time.com:', error);
        res.status(500).send('Error fetching latest stories');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
