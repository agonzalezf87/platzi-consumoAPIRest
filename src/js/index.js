const API_URL = 'https://api.thedogapi.com/v1/images/search?limit=3'
const API_KEY = 'f3b59fc0-562d-403f-b3da-e17f330d106f'
const API_URL_FAVOURITES = 'https://api.thedogapi.com/v1/favourites'
const API_URL_UPLOAD = 'https://api.thedogapi.com/v1/images/upload'

const dogButton = document.querySelector('#dogButton')
const spanError = document.querySelector('#dogsError')
const randomSection = document.querySelector('#randomDogs')
const favouritesSection = document.querySelector('#favouriteDogs')
const btnUploadDog = document.querySelector('#btnUploadDog')

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
    let res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    let data = await res.json()
    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        const favArticles = document.querySelectorAll('#favouriteDogs article')
        if(favArticles.length > 0){favArticles.forEach(article => article.remove())}
        if(data.length > 0){
            data.sort((a, b) => {
                let dateA = new Date(a.created_at)
                let dateB = new Date(b.created_at)

                return dateB - dateA
            })
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
            })
        }else {
            favouritesSection.innerHTML += "<p>Add favourite dogs in order to display them here...</p>"
        }
    }
}

async function saveFavouriteDog(id) {
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'X-API-KEY' : API_KEY,
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
    }
    
}

async function deleteFavouriteDog(id) {
    const res = await fetch(`${API_URL_FAVOURITES}/${id}`, {
        method: 'DELETE',
        headers: {
            'X-API-KEY': API_KEY
        }
    })
    const data = await res.json()

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        loadFavouriteDogs()
    }
}

async function uploadDogPic() {
    const form = document.querySelector('#uploadingForm')
    const formData = new FormData(form)

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data', no needed because of FormData Powers!
            'X-API-KEY': API_KEY
        },
        body: formData
    })

    if(res.status !== 200){
        spanError.innerHTML = `Error ${res.status}: ${data.message}`
    }else{
        loadFavouriteDogs()
    }
}

dogButton.onclick = () => loadRandomDogs()
btnUploadDog.onclick = () => uploadDogPic()

loadRandomDogs()
loadFavouriteDogs()