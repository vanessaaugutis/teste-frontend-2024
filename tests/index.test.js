const { JSDOM } = require('jsdom');
const fetchMock = require('jest-fetch-mock');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.resolve(__dirname, '../frontend/src/mf_videos/index.html'), 'utf8');
const { document } = new JSDOM(html).window;
global.document = document;

global.fetch = fetchMock;

const {
    getFavorites,
    loadFavorites,
    toggleFavorite,
    searchVideos,
    displayResults,
} = require('../frontend/src/mf_videos/index');

describe('getFavorites', () => {
    afterEach(() => {
        fetchMock.resetMocks();
    });

    test('função getFavorites está definida', () => {
        expect(getFavorites).toBeDefined();
    });

    test('retorna lista de favoritos corretamente', async () => {
        const mockFavorites = [
            { videoId: 'video1' },
            { videoId: 'video2' }
        ];
        fetchMock.mockResponseOnce(JSON.stringify({ favorites: mockFavorites }));

        const favorites = await getFavorites();
        expect(favorites).toEqual(mockFavorites);
    });
});