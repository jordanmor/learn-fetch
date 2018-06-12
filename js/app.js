const select = document.getElementById('breeds');
const gallery = document.getElementById('gallery');

// Functions

function fetchData(url) {
    return fetch(url)
            .then(res => res.json()) 
}

function generateImages(data) {
    gallery.innerHTML = '';
    // limit image array to 50 images
    const imageArr = data.length > 50 ? data.slice(0, 50) : data;
    imageArr.map(item => {
        const li = document.createElement('li');
        li.style.backgroundImage = `url(${item})`;
        gallery.appendChild(li);
    });
}

function createOption(value, textContent) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = textContent;
    select.appendChild(option);
}

function generateOptions(data) {
    // Initial Option
    createOption("randomBreeds", "Choose Breed");
    // Populate list of breeds
    data.map(item => {
        createOption(item, item);
    });
}

function fetchImages(url) {
    fetchData(url)
        .then(data => {
            const imageArray = data.message;
            generateImages(imageArray);
        });
}

// Fetch Data

function fetchBreedList() {
    fetchData("https://dog.ceo/api/breeds/list")
        .then(data => {
            const breedList = data.message;
            generateOptions(breedList);
            // Start with random images
            fetchImages("https://dog.ceo/api/breeds/image/random/9");
        })
}

function fetchBreedImages() {
    if (select.value === 'randomBreeds') {
        fetchImages("https://dog.ceo/api/breeds/image/random/9");
    } else {
        const breed = select.value;
        fetchImages(`https://dog.ceo/api/breed/${breed}/images`);
    }
}

fetchBreedList();

// Event Listeners

select.addEventListener('change', fetchBreedImages);
