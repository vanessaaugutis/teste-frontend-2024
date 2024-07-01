const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';
const favoritesFilePath = path.join(__dirname, 'favorites.json');

const directory = path.dirname(favoritesFilePath);
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
}

let favoriteVideos = [];

function loadFavorites() {
    try {
        if (fs.existsSync(favoritesFilePath)) {
            const data = fs.readFileSync(favoritesFilePath, 'utf8');
            favoriteVideos = JSON.parse(data);
        } else {
            favoriteVideos = [];
            saveFavorites();
        }
    } catch (error) {
        console.error('Erro ao ler arquivo de favoritos:', error);
    }
}

loadFavorites();

function saveFavorites() {
    fs.writeFile(favoritesFilePath, JSON.stringify(favoriteVideos), (err) => {
        if (err) {
            console.error('Erro ao salvar favoritos no arquivo:', err);
        }
    });
}

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());
app.use(express.json());

app.get('/api/data', (req, res) => {
    const data = {
        message: 'Dados do BFF para o Frontend'
    };
    res.json(data);
});

app.get('/api/youtube-search', async (req, res) => {
    try {
        const params = {
            part: 'snippet',
            q: req.query.q, 
            type: 'video', 
            key: 'AIzaSyDPPuSrOQA-cxe_iKeB0fOu-1D35bzXejg' // Colocar sua chave da API
        };

        const response = await axios.get(youtubeEndpoint, { params });

        res.json(response.data);
    } catch (error) {
        console.error('Erro ao buscar vídeos no YouTube:', error);
        res.status(500).json({ error: 'Erro ao buscar vídeos no YouTube' });
    }
});

app.post('/api/favorites/:videoId', (req, res) => {
    const { videoId } = req.params;

    const index = favoriteVideos.indexOf(videoId);
    if (index === -1) {
        favoriteVideos.push(videoId);
    } else {
        favoriteVideos.splice(index, 1);
    }

    saveFavorites();

    res.json({ favorites: favoriteVideos });
});

app.get('/api/favorites', (req, res) => {
    loadFavorites();
    res.json({ favorites: favoriteVideos });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor BFF está rodando na porta ${port}`);
});
