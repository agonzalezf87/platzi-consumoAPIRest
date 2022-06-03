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

const dogButton = document.querySelector('#dogButton')
const spanError = document.querySelector('#dogsError')
const randomSection = document.querySelector('#randomDogs')
const favouritesSection = document.querySelector('#favouriteDogs')
const btnUploadDog = document.querySelector('#btnUploadDog')

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
            spanError.style.display = 'inline-block'
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${status}: There was an error fetching the dogs!`
        }else {
            randImg1.src = data[0].url
            addfav1.onclick = () => saveFavouriteDog(data[0].id)
    
            randImg2.src = data[1].url
            addfav2.onclick = () => saveFavouriteDog(data[1].id)
            
            randImg3.src = data[2].url
            addfav3.onclick = () => saveFavouriteDog(data[2].id)
        }
    } catch(error) {
        spanError.style.display = 'inline-block'
        spanError.innerHTML = `Error ${error.response.status} ${error.code}: ${error.response.data.message}`
    }
}

async function loadFavouriteDogs() {
    try {
        const {data, status} = await api.get(URL_FAVOURITES)
        if(status !== 200) {
            spanError.style.display = 'inline-block'
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${status}: There was an error fetching the dogs!`
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

                    article.classList.add('dogCard')
                    btn.innerHTML = "<i class='fa-solid fa-heart-circle-minus'></i>"
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
    } catch(error) {
        spanError.style.display = 'inline-block'
        if(error.response){
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${error.response.status} ${error.code}: ${error.response.data.message}`
        }else{
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error: ${error}`
        }
    }
}

async function saveFavouriteDog(id) {
    try {
        await api.post(URL_FAVOURITES, {
            image_id: id,
        })
        loadFavouriteDogs()
    } catch (error) {
        spanError.style.display = 'inline-block'
        if(error.response){
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${error.response.status} ${error.code}: ${error.response.data.message}`
        }else{
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error: ${error}`
        }
    }
}

async function deleteFavouriteDog(id) {
    try {
        await api.delete(`${API_URL_FAVOURITES}/${id}`) 
        loadFavouriteDogs()
    } catch (error) {
        spanError.style.display = 'inline-block'
        if(error.response){
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${error.response.status} ${error.code}: ${error.response.data.message}`
        }else{
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error: ${error}`
        }
    }
}

async function uploadDogPic() {
    const form = document.querySelector('#uploadingForm')
    const formData = new FormData(form)
    
    try {
        await api.post(URL_UPLOAD, formData)
        loadFavouriteDogs()        
    } catch (error) {
        spanError.style.display = 'inline-block'
        if(error.response){
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error ${error.response.status} ${error.code}: ${error.response.data.message}`
        }else{
            spanError.innerHTML = `<i class="fa-regular fa-triangle-exclamation"></i> Error: ${error}`
        }
    }
}

dogButton.onclick = () => loadRandomDogs()
btnUploadDog.onclick = () => uploadDogPic()

loadRandomDogs()
loadFavouriteDogs()