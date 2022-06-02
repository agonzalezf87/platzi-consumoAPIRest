const API_URL = 'https://api.thedogapi.com/v1/images/search?limit=3'
const API_KEY = 'api_key=f3b59fc0-562d-403f-b3da-e17f330d106f'
const API_URL_FAVOURITES = 'https://api.thedogapi.com/v1/favourites'

const dogButton = document.querySelector('#dogButton')
const spanError = document.querySelector('#dogsError')
const randomSection = document.querySelector('#randomDogs')
const favouritesSection = document.querySelector('#favouriteDogs')


async function loadRandomDogs() {
    let res = await fetch(API_URL)
    let data = await res.json()
    
    if(res.status !==  200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        const randArticles = document.querySelectorAll('#randomDogs article')
        if(randArticles.length > 0){randArticles.forEach(article => article.remove())}
        data.forEach(dog => {
            const dogArticle = document.createElement('article')
            const img = document.createElement('img')
            const saveFav = document.createElement('button')

            saveFav.type = 'button'
            saveFav.innerHTML = 'Save dog in favourites'
            saveFav.onclick = () => saveFavouriteDog(dog.id)
        
            img.src = dog.url
            img.id = dog.id
            img.alt = 'Random dog picture'

            dogArticle.appendChild(img)
            dogArticle.appendChild(saveFav)

            randomSection.appendChild(dogArticle)
        })
    }
}

async function loadFavouriteDogs() {
    let res = await fetch(`${API_URL_FAVOURITES}?${API_KEY}`)
    let data = await res.json()
    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        const favArticles = document.querySelectorAll('#favouriteDogs article')
        if(favArticles.length > 0){favArticles.forEach(article => article.remove())}
        if(data.length > 0){
            data.forEach(dog => {
                const article = document.createElement('article')
                const img = document.createElement('img')
                const btn = document.createElement('button')
                btn.innerHTML = "Remove from favourites"
                btn.type = 'button'
                btn.onclick = () => deleteFavouriteDog(dog.id)
        
                img.src = dog.image.url
        
                article.appendChild(img)
                article.appendChild(btn)
    
                favouritesSection.appendChild(article)
                /* console.log(article) */
            })
        }else {
            favouritesSection.innerHTML += "<p>Add favourite dogs in order to display them here...</p>"
        }
    }
}

async function saveFavouriteDog(id) {
    const res = await fetch(`${API_URL_FAVOURITES}?${API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_id: id
        }),
    })
    const data = await res.json()

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        loadFavouriteDogs()
        /* console.log('Dog added to favourites.') */
    }
    
}

async function deleteFavouriteDog(id) {
    const res = await fetch(`${API_URL_FAVOURITES}/${id}?${API_KEY}`, {
        method: 'DELETE',
    })
    const data = await res.json()

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        loadFavouriteDogs()
        /* console.log('Dog deleted from favourites.') */
    }
}

dogButton.onclick = () => loadRandomDogs()

loadRandomDogs()
loadFavouriteDogs()