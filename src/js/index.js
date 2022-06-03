const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1'
})
api.defaults.headers.common['X-API-KEY'] = 'f3b59fc0-562d-403f-b3da-e17f330d106f'
axios.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
        Object.assign(config.headers, config.data.getHeaders());
    }
    return config;
});

const URL_GET = '/images/search?limit=3'
const URL_FAVOURITES = '/favourites'
const URL_UPLOAD = '/images/upload'

const spanError = document.querySelector('#dogsError')
const dogButton = document.querySelector('#dogButton')
const randomSection = document.querySelector('#randomDogs')
const favouritesSection = document.querySelector('#favouriteDogs')
const btnUploadDog = document.querySelector('#btnUploadDog')
const body = document.querySelector('body')

async function loadRandomDogs() {
    const randImg1 = document.querySelector('#randImg1')
    const randImg2 = document.querySelector('#randImg2')
    const randImg3 = document.querySelector('#randImg3')
    const addfav1 = document.querySelector('#addFav1')
    const addfav2 = document.querySelector('#addFav2')
    const addfav3 = document.querySelector('#addFav3')
    try {
        const {data, status} = await api.get(URL_GET)
        if(status !== 200) {
            body.appendChild(popError(null, status))
        }else {
            randImg1.src = data[0].url
            addfav1.onclick = () => saveFavouriteDog(data[0].id)
    
            randImg2.src = data[1].url
            addfav2.onclick = () => saveFavouriteDog(data[1].id)
            
            randImg3.src = data[2].url
            addfav3.onclick = () => saveFavouriteDog(data[2].id)
        }
    } catch(error) {
        body.appendChild(popError(error, null))
    }
}

async function loadFavouriteDogs() {
    try {
        const {data, status} = await api.get(URL_FAVOURITES)
        if(status !== 200) {
            body.appendChild(popError(null, status))
        }else {
            favouritesSection.innerHTML = ''
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
                    const btnIcon = document.createElement('i')

                    btnIcon.classList.add('fa-solid','fa-heart-circle-minus')

                    article.classList.add('dogCard')
                    btn.type = 'button'
                    btn.classList.add('dogCard__btn')
                    btn.onclick = () => deleteFavouriteDog(dog.id)
                    btn.appendChild(btnIcon)
            
                    img.src = dog.image.url
                    img.classList.add('dogCard__image')
                    
                    article.appendChild(img)
                    article.appendChild(btn)
        
                    favouritesSection.appendChild(article)
                })
            }else {
                favouritesSection.innerHTML += "<p>Add favourite dogs in order to display them here...</p>"
            }
        }
    } catch(error) {
        body.appendChild(popError(error, null))
    }
}

async function saveFavouriteDog(id) {
    try {
        await api.post(URL_FAVOURITES, {
            image_id: id,
        })
        loadFavouriteDogs()
    } catch (error) {
        body.appendChild(popError(error, null))
    }
}

async function deleteFavouriteDog(id) {
    try {
        await api.delete(`${URL_FAVOURITES}/${id}`) 
        loadFavouriteDogs()
    } catch (error) {
        body.appendChild(popError(error, null))
    }
}

async function uploadDogPic() {
    const form = document.querySelector('#uploadingForm')
    const formData = new FormData(form)
    
    try {
        await api.post(URL_UPLOAD, formData)
        loadFavouriteDogs()        
    } catch (error) {
        body.appendChild(popError(error, null))
    }
}

const popError = (error, status) => {
    const errorDiv = document.createElement('div')
    const icon = document.createElement('i')
    icon.classList.add('fa-solid', 'fa-circle-exclamation')
    errorDiv.appendChild(icon)

    if(status){
        let text = document.createTextNode(`Error ${status}: There was an error fetching the dogs!`)
        errorDiv.appendChild(text)
        errorDiv.classList.add('errorMessage')
    }else if(error.response){
        let text = document.createTextNode(`Error ${error.response.status} ${error.code}: ${error.response.data.message}`)
        errorDiv.appendChild(text)
        errorDiv.classList.add('errorMessage')
    }else {
        let text = document.createTextNode(`Error: ${error}`)
        errorDiv.appendChild(text)
        errorDiv.classList.add('errorMessage')
    }

    return errorDiv
}

const removeError = () => {
    let errorDiv = document.querySelector('.errorMessage')
    console.log(errorDiv)
    if(errorDiv){
        errorDiv.remove()
    }
}

dogButton.onclick = () => loadRandomDogs()
btnUploadDog.onclick = () => uploadDogPic()

loadRandomDogs()
loadFavouriteDogs()