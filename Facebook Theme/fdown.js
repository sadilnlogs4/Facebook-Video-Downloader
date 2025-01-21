const axios = require('axios');
const qs = require('qs');
const cheerio = require('cheerio');

const fdown = {
    getToken: async () => {
        try {
            const response = await axios.get('https://fdown.net', {
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
                },
            });

            const $ = cheerio.load(response.data);
            return {
                token_v: $('input[name="token_v"]').val(),
                token_c: $('input[name="token_c"]').val(),
                token_h: $('input[name="token_h"]').val(),
            };
        } catch (error) {
            console.error('Error fetching tokens:', error);
            throw new Error('Failed to fetch tokens.');
        }
    },

    request: async (url) => {
        const { token_v, token_c, token_h } = await fdown.getToken();
        const data = qs.stringify({
            URLz: url,
            token_v,
            token_c,
            token_h,
        });

        const response = await axios.post('https://fdown.net/download.php', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data;
    },

    download: async (url) => {
        const data = await fdown.request(url);
        const $ = cheerio.load(data);

        return $('#result .lib-item').map((i, el) => ({
            title: $(el).find('.lib-header').text().trim(),
            description: $(el).find('.lib-desc').first().text().replace('Description:', '').trim(),
            duration: $(el).find('.lib-desc').last().text().replace('Duration:', '').trim(),
            normalQualityLink: $('#sdlink').attr('href'),
            hdQualityLink: $('#hdlink').attr('href'),
        })).get();
    },
};

module.exports = fdown;
