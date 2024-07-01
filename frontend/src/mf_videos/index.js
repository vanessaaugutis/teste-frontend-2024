async function searchVideos() {
    const query = document.getElementById('searchQuery').value;

    try {
        const response = await fetch(`http://localhost:5000/api/youtube-search?q=${query}`);
        const data = await response.json();

        displayResults(data.items);

    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        alert('Erro ao buscar vídeos. Verifique o console para mais detalhes.');
    }
}

function displayResults(videos) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Limpa resultados anteriores

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const thumbnail = video.snippet.thumbnails.default.url;

        const videoElement = `
            <div>
                <h2>${title}</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
        resultsContainer.innerHTML += videoElement;
    });
}