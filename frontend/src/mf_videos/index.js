let favorites;

async function getFavorites() {
    try {
        const response = await fetch('http://localhost:5000/api/favorites');
        if (!response.ok) {
            throw new Error('Erro ao obter favoritos');
        }
        const data = await response.json();
        return data.favorites || [];
    } catch (error) {
        console.error('Erro ao obter favoritos:', error);
        return [];
    }
}

async function loadFavorites() {
    try {
        const favorites = await getFavorites();
        displayResults(favorites);
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        alert('Erro ao carregar favoritos. Verifique o console para mais detalhes.');
    }
}

async function toggleFavorite(videoId) {
    try {
        const response = await fetch(`http://localhost:5000/api/favorites/${videoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao atualizar favoritos');
        }

        // Atualiza a lista de favoritos após a alteração
        const updatedFavorites = await response.json();
        favorites = updatedFavorites.favorites;

        // Atualiza a interface do usuário após a alteração
        updateUI();

    } catch (error) {
        console.error('Erro ao marcar vídeo como favorito:', error);
    }
}

async function searchVideos() {
    const query = document.getElementById('searchQuery').value.trim();

    try {
        const response = await fetch(`http://localhost:5000/api/youtube-search?q=${query}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar vídeos do YouTube');
        }
        const data = await response.json();

        displayResults(data.items);

    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        alert('Erro ao buscar vídeos. Verifique o console para mais detalhes.');
    }
}

function displayResults(videos) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;

        const videoElement = `
            <div class="elemento-video">
                <h2>${title}</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
                <button class="favorite-btn" data-video-id="${videoId}" onclick="toggleFavorite('${videoId}')">
                    ${favorites && favorites.includes(videoId) ? '<img width="20" height="20" src="https://th.bing.com/th/id/R.9b0f52ad060ca747a4643c99444b7392?rik=Gu8MwQUiUuJNIw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fstar-png-star-vector-png-transparent-image-2000.png&ehk=tPTpccZ5Svh8XPduqc60tWiDArcQil6wZBZgi%2bsePdA%3d&risl=&pid=ImgRaw&r=0" alt="Marcar como Favorito">' : '<img width="20" height="20" src="https://th.bing.com/th/id/R.2fbb988f573f5b5a2f6ffec738b5cf05?rik=TENoIJPNwOQ4kg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fstar-png-star-icon-1600.png&ehk=w%2buR8esLZsa%2f81YqoT4HTF09Zc3aGJSyWGWd204WWno%3d&risl=&pid=ImgRaw&r=0" alt="Desmarcar como Favorito">'}
                </button>
            </div>
        `;

        resultsContainer.innerHTML += videoElement;
    });
}

async function updateUI() {
    try {
        const activeLink = document.querySelector('.menu a.clicked');
        if (!activeLink) return;

        const id = activeLink.id;
        if (id === 'link-videos') {
            await searchVideos();
        } else if (id === 'link-favoritos') {
            await loadFavorites();
        }
    } catch (error) {
        console.error('Erro ao atualizar interface do usuário:', error);
        alert('Erro ao atualizar interface do usuário. Verifique o console para mais detalhes.');
    }
}

async function initializeApp() {
    try {
        favorites = await getFavorites();
        const activeLink = document.querySelector('.menu a.clicked');
    
        if (activeLink) {
            const id = activeLink.id;
        
            if (id === 'link-videos') {
                await searchVideos();
            } else if (id === 'link-favoritos') {
                await loadFavorites();
            }
        } else {
            console.log('Nenhum link clicado foi encontrado.');
        }
    } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

document.getElementById('link-videos').addEventListener('click', function(event) {
    event.preventDefault();
    setActiveLink('link-videos');
});

document.getElementById('link-favoritos').addEventListener('click', function(event) {
    event.preventDefault();
    setActiveLink('link-favoritos');
});

function setActiveLink(linkId) {
    const menuLinks = document.querySelectorAll('.menu a');
    menuLinks.forEach(link => link.classList.remove('clicked'));

    const activeLink = document.getElementById(linkId);
    activeLink.classList.add('clicked');

    updateUI();
}
