const express = require('express');
const { chromium } = require('playwright');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:115.0) Gecko/20100101 Firefox/115.0',
    });

    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    const html = await page.content();
    await browser.close();

    res.status(200).send(html);
  } catch (error) {
    console.error('Scrape error:', error.message);
    res.status(500).json({ error: 'Failed to scrape page', details: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('✅ Headless Scraper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
