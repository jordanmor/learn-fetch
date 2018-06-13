/*====================================
    Global
====================================*/

const select = document.getElementById('breeds');
const gallery = document.getElementById('gallery');
const blogPosts = document.getElementById('blog-posts'); 

/*====================================
    Functions
====================================*/

function createElement(element, property = undefined, value = undefined, property2 = undefined, value2 = undefined) {
    const el = document.createElement(element);
    el[property] = value;
    el[property2] = value2;
    return el;
}

function appendTo(parentEl, element, property = undefined, value = undefined, property2 = undefined, value2 = undefined) {
    const el = createElement(element, property, value, property2, value2);
    parentEl.appendChild(el);
    return el;
}

const createPost = numOfLi => {
    for(let i = 0; i < numOfLi; i++) {
        const li = createElement('li');
        appendTo(li, 'h3', 'textContent', 'Blog Post Link');
        appendTo(li, 'p', 'textContent', 'Blog Post Description...........');
        blogPosts.appendChild(li);
    }
}
createPost(8);

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

/*====================================
    Fetch Data
====================================*/

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

/*====================================
    Event Listeners
====================================*/

select.addEventListener('change', fetchBreedImages);
