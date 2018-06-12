const select = document.getElementById('breeds');
const gallery = document.getElementById('gallery');

// Functions

function fetchData(url) {
    return fetch(url)
            .then(res => res.json()) 
}

const limitArray = (arr, numOfItems) => {
    if (arr.length > numOfItems) {
        arr.splice(numOfItems);
        return arr; 
    } else {
        return arr;
    }
};

function generateImages(data) {
    gallery.innerHTML = '';
    const imageArr = limitArray(data, 50);
    imageArr.map(item => {
        const li = document.createElement('li');
        const imageEl = document.createElement('img');
        imageEl.src = item;
        li.appendChild(imageEl);
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

// Fetch Data

function fetchBreedList() {
    fetchData("https://dog.ceo/api/breeds/list")
        .then(data => {
            const breedList = data.message;
            generateOptions(breedList);
            fetchRandomImages();
        })
}

function fetchRandomImages() {
    fetchData("https://dog.ceo/api/breeds/image/random/9")
        .then(data => {
            const imageArray = data.message;
            generateImages(imageArray);
        });
}

function fetchBreedImages() {
    if (select.value === 'randomBreeds') {
        fetchRandomImages();
    } else {
    const breed = select.value;
    fetchData(`https://dog.ceo/api/breed/${breed}/images`)
        .then(data => {
            const imageArray = data.message;
            generateImages(imageArray);
        });
    }
}

fetchBreedList();

// Event Listeners

select.addEventListener('change', fetchBreedImages);
