//DOM elements
const form = document.querySelector('search-form');
const input = document.querySelector('search-term');


//Openweather API key
const apikey = '5b7ccc5ba81d4d27f0fdd40dc0cbe778'

//Event listener
form.addEventListener('submit' , ev => {
    ev.preventDefault()
})
