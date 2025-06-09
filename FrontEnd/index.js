const APILINK = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9ec624b9e398aa1eb27c127b51628c93&page=1';
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?&api_key=9ec624b9e398aa1eb27c127b51628c93&query=";

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

// Add loading state
function showLoading() {
    main.innerHTML = '<div class="loading">Loading...</div>';
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    main.innerHTML = `<div class="error">${message}</div>`;
}

function returnMovies(url) {
    showLoading();
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(function (data) {
            hideLoading();
            if (data.results.length === 0) {
                showError('No movies found');
                return;
            }
            data.results.forEach(element => {
                const div_card = document.createElement('div');
                div_card.setAttribute('class', 'card');

                const div_row = document.createElement('div');
                div_row.setAttribute('class', 'row');

                const div_column = document.createElement('div');
                div_column.setAttribute('class', 'column');

                const image = document.createElement('img');
                image.setAttribute('class', 'thumbnail');
                image.setAttribute('id', 'image');
                image.setAttribute('alt', element.title);

                const title = document.createElement('h3');
                title.setAttribute('id', 'title');

                const centerDiv = document.createElement('div');
                centerDiv.style.textAlign = 'center';

                title.innerHTML = `${element.title}`;
                image.src = IMG_PATH + element.poster_path;

                // Add error handling for images
                image.onerror = function () {
                    this.src = 'path/to/fallback-image.jpg'; // Add a fallback image
                };

                centerDiv.appendChild(image);
                div_card.appendChild(centerDiv);
                div_card.appendChild(title);
                div_column.appendChild(div_card);
                div_row.appendChild(div_column);
                main.appendChild(div_row);
            });
        })
        .catch(error => {
            hideLoading();
            showError('Error fetching movies: ' + error.message);
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    main.innerHTML = '';

    const searchItem = search.value;

    if (searchItem) {
        returnMovies(SEARCHAPI + searchItem);
        search.value = '';
    }
});

// Load initial movies when page loads
document.addEventListener('DOMContentLoaded', () => {
    returnMovies(APILINK);
});