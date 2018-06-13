/*====================================
    Global
====================================*/

const select = document.getElementById('breeds');
const gallery = document.getElementById('gallery');
const posts = document.getElementById('stories'); 

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

function generateImages(data) {
    gallery.innerHTML = '';
    const array = limitData(data, 40);
    array.map(item => {
        appendTo(gallery, 'li', 'style', `background-image: url(${item})`);
    });
}

function generateOptions(data) {
    // Initial Option
    appendTo(select, 'option', 'value', 'randomBreeds', 'textContent', 'Choose Breed');
    // Populate list of breeds
    data.map(item => {
        appendTo(select, 'option', 'value', item, 'textContent', item);
    });
}

const createPosts = (title, body) => {
    const li = createElement('li');
    appendTo(li, 'h3', 'textContent', title);
    appendTo(li, 'p', 'textContent', body);
    posts.appendChild(li);
}

function createDate() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${dayOfMonth}, ${year}`;
}

console.log(createDate());

const capitalize = text => text.charAt(0).toUpperCase() + text.substring(1);
const addPeriod = text => `${text}.`;
const limitData = (data, limitNumber) => data.length > limitNumber ? data.slice(0, limitNumber) : data;

/*====================================
    Fetch Data
====================================*/

function fetchData(url) {
    return fetch(url)
            .then(res => res.json()) 
}

// Fetch images

function fetchImages(url) {
    fetchData(url)
        .then(data => {
            const imagesArray = data.message;
            generateImages(imagesArray);
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
                createPosts( capitalize(title), addPeriod(capitalize(body)) );
            });
        });
}

fetchPosts();

/*====================================
    Event Listeners
====================================*/

select.addEventListener('change', fetchBreedImages);
