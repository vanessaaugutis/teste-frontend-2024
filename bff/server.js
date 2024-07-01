const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const youtubeEndpoint = 'https://www.googleapis.com/youtube/v3/search';

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());

app.get('/api/data', (req, res) => {
    const data = {
        message: 'Dados do BFF para o Frontend'
    };
    res.json(data);
});

// Rota para buscar vídeos no YouTube
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

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Servidor BFF está rodando na porta ${port}`);
});
