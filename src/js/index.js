const API_URL_RANDOM = 'https://api.thedogapi.com/v1/images/search?limit=3&api_key=f3b59fc0-562d-403f-b3da-e17f330d106f'
const API_URL_FAVOURITES = 'https://api.thedogapi.com/v1/favourites?api_key=f3b59fc0-562d-403f-b3da-e17f330d106f'

const dogButton = document.querySelector('#dogButton')
const spanError = document.querySelector('#dogsError')
const randomSection = document.querySelector('#randomDogs')
const favouritesSection = document.querySelector('#favouriteDogs')

/* const saveFavButtons = document.querySelectorAll('#randomDogs article button') */

async function loadRandomDogs() {
    let res = await fetch(API_URL_RANDOM)
    let data = await res.json()
    
    if(res.status !==  200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        data.forEach(dog => {
            const dogArticle = document.createElement('article')
            const img = document.createElement('img')
            const saveFav = document.createElement('button')

            saveFav.setAttribute('type','button')
            saveFav.innerHTML = 'Save dog in favourites'
            saveFav.addEventListener('click', saveFavouriteDogs)
        
            img.setAttribute('src', dog.url)
            img.setAttribute('id', dog.id)
            img.setAttribute('alt', 'Random dog picture')

            dogArticle.appendChild(img)
            dogArticle.appendChild(saveFav)

            randomSection.appendChild(dogArticle)
        })
    }
}

async function reLoadRandomDogs() {
    let res = await fetch(API_URL_RANDOM)
    let data = await res.json()
    /* Pending... */
    if(res.status !==  200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        const dogImgs = document.querySelectorAll('#randomDogs article img')
        data.forEach(dog => {
            dogImgs.forEach(img => {
                img.setAttribute('src', dog.url)
                img.setAttribute('id', dog.id)
            })
            console.log(dogImgs)
        })
    }
}

async function loadFavouriteDogs() {
    let res = await fetch(API_URL_FAVOURITES)
    let data = await res.json()
    console.log(data)
    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        if(data.length > 0){
            data.forEach(dog => {
                const article = document.createElement('article')
                const img = document.createElement('img')
                const btn = document.createElement('button')
                btn.innerHTML = "Remove from favourites"
                btn.type = 'button'
        
                img.src = dog.image.url
        
                article.appendChild(img)
                article.appendChild(btn)
    
                favouritesSection.appendChild(article)
                console.log(article)
            })
        }else {
            favouritesSection.innerHTML += "<p>Add favourite dogs in order to display them here...</p>"
        }
    }
}

async function saveFavouriteDogs() {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image_id: ''
        }),
    })
    let data = await res.json()

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }
    
    console.log(res)
}

dogButton.addEventListener('click', reLoadRandomDogs)
/* saveFavButtons.forEach(button => button.addEventListener('click', saveFavouriteDogs)) */

loadRandomDogs()
loadFavouriteDogs()