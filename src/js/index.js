const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=2&api_key=f3b59fc0-562d-403f-b3da-e17f330d106f'
const API_URL_FAVORITES = 'https://api.thedogapi.com/v1/favourites?limit=3&api_key=f3b59fc0-562d-403f-b3da-e17f330d106f'

const dogButton = document.querySelector('#dogButton')
const spanError = document.querySelector('#randomDogsError')

async function loadRandomDogs() {
    let res = await fetch(API_URL_RANDOM)
    let data = await res.json()

    if(res.status !==  200){
        spanError.innerHTML = `Hubo un error: ${res.status}`
    }else{
        const img1 = document.getElementById('img1')
        const img2 = document.getElementById('img2')
        img1.src = data[0].url
        img2.src = data[1].url
    }
}

async function loadFavoritesDogs() {
    let res = await fetch(API_URL_FAVORITES)
    let data = await res.json()

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{

    }
}
dogButton.addEventListener('click', loadRandomDogs)

loadRandomDogs()
loadFavoritesDogs()