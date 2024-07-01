const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';
const favoritesFilePath = path.join(__dirname, 'favorites.json');

// Verifica e cria o diretório se não existir
const directory = path.dirname(favoritesFilePath);
if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
}

let favoriteVideos = [];

// Função para carregar os favoritos do arquivo JSON
function loadFavorites() {
    try {
        // Verifica se o arquivo existe antes de ler
        if (fs.existsSync(favoritesFilePath)) {
            const data = fs.readFileSync(favoritesFilePath, 'utf8');
            favoriteVideos = JSON.parse(data);
        } else {
            // Se o arquivo não existir, inicia com um array vazio
            favoriteVideos = [];
            saveFavorites(); // Salva um arquivo vazio para garantir sua existência
        }
    } catch (error) {
        console.error('Erro ao ler arquivo de favoritos:', error);
    }
}

// Carregar os favoritos ao iniciar o servidor
loadFavorites();

// Salvar os favoritos no arquivo JSON
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
            key: 'AIzaSyARKVO2ES5zbiNl9UEa5mR4gKaVTRxLxws'
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

    // Salvar os favoritos de volta no arquivo JSON
    saveFavorites();

    res.json({ favorites: favoriteVideos });
});

app.get('/api/favorites', (req, res) => {
    loadFavorites(); // Garante que os favoritos sejam carregados ao acessar esta rota
    res.json({ favorites: favoriteVideos });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor BFF está rodando na porta ${port}`);
});
