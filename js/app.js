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

function fetchData(url) {
    return fetch(url)
            .then(res => res.json()) 
}

function generateImages(data) {
    gallery.innerHTML = '';
    // limit image array to 50 images
    // const imageArr = data.length > 50 ? data.slice(0, 50) : data;
    const imageArr = limitData(data, 40);
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

const createPost = (title, body) => {
    const li = createElement('li');
    appendTo(li, 'h3', 'textContent', title);
    appendTo(li, 'p', 'textContent', body);
    blogPosts.appendChild(li);
}

const capitalize = text => text.charAt(0).toUpperCase() + text.substring(1);
const addPeriod = text => `${text}.`;
const limitData = (data, limitNumber) => data.length > limitNumber ? data.slice(0, limitNumber) : data;

/*====================================
    Fetch Data
====================================*/

// Fetch images

function fetchImages(url) {
    fetchData(url)
        .then(data => {
            const imageArray = data.message;
            generateImages(imageArray);
        });
}

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

// Fetch Posts

function fetchPosts() {
    fetchData('https://jsonplaceholder.typicode.com/posts')
        .then(data => {
            const posts = limitData(data, 20);
            posts.map(item => {
                const {title, body} = item;
                createPost( capitalize(title), addPeriod(capitalize(body)) );
            });
        });
}

fetchPosts();

/*====================================
    Event Listeners
====================================*/

select.addEventListener('change', fetchBreedImages);
