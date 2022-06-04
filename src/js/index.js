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

const URL_GET = '/images'
const URL_FAVOURITES = '/favourites'
const URL_UPLOAD = '/images/upload'

const body = document.querySelector('body')
const dogButton = document.querySelector('#dogButton')
const randomDogs = document.querySelector('#randomDogs')
const randDivScrollLeft = document.querySelector('#randDivScrollLeft')
const randScrollLeft = document.querySelector('#randScrollLeft')
const randDivScrollRight = document.querySelector('#randDivScrollRight')
const randScrollRight = document.querySelector('#randScrollRight')
const favouritesSection = document.querySelector('#favouriteDogs')
const btnUploadDog = document.querySelector('#btnUploadDog')
const fileInput = document.querySelector('#file')

async function loadRandomDogs() {
    randomDogs.scrollLeft = 0
    const randImg1 = document.querySelector('#randImg1')
    const randImg2 = document.querySelector('#randImg2')
    const randImg3 = document.querySelector('#randImg3')
    const addfav1 = document.querySelector('#addFav1')
    const addfav2 = document.querySelector('#addFav2')
    const addfav3 = document.querySelector('#addFav3')
    try {
        const {data, status} = await api.get(`${URL_GET}/search?limit=3`)
        if(status !== 200) {
            body.appendChild(popError(null, status))
            window.setTimeout(removeError,5000)
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
        window.setTimeout(removeError,5000)
    }
}

async function loadFavouriteDogs() {
    try {
        const {data, status} = await api.get(URL_FAVOURITES)
        if(status !== 200) {
            body.appendChild(popError(null, status))
            window.setTimeout(removeError,5000)
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
        const scrRight = document.createElement('div')
        const scrLeft = document.createElement('div')
        const btnRight = document.createElement('a')
        const btnLeft = document.createElement('a')
        const icnRight = document.createElement('i')
        const icnLeft = document.createElement('i')
        
        icnLeft.classList.add('fa-solid', 'fa-circle-chevron-left')
        icnRight.classList.add('fa-solid', 'fa-circle-chevron-right')
        btnLeft.setAttribute('href', 'javascript:void(0)')
        btnRight.setAttribute('href', 'javascript:void(0)')
        btnLeft.appendChild(icnLeft)
        btnRight.appendChild(icnRight)
        
        scrLeft.classList.add('scroll', 'left')
        scrRight.classList.add('scroll', 'right')
        
        scrLeft.appendChild(btnLeft)
        scrRight.appendChild(btnRight)

        favouritesSection.appendChild(scrLeft)
        favouritesSection.appendChild(scrRight)

        btnLeft.onclick = () => smoothScroll(favouritesSection, 'left')
        btnRight.onclick = () => smoothScroll(favouritesSection, 'right')
    } catch(error) {
        body.appendChild(popError(error, null))
        window.setTimeout(removeError,5000)
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
        window.setTimeout(removeError,5000)
    }
}

async function deleteFavouriteDog(id) {
    try {
        await api.delete(`${URL_FAVOURITES}/${id}`) 
        loadFavouriteDogs()
    } catch (error) {
        body.appendChild(popError(error, null))
        window.setTimeout(removeError,5000)
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
        window.setTimeout(removeError,5000)
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
    if(errorDiv){
        errorDiv.remove()
    }
}

const loadPreview = (evt) => {
    try {
        const divPreview = document.querySelector('#uploadPreview')
        const [file] = fileInput.files
        if(file){
            divPreview.style.backgroundImage = `url(${URL.createObjectURL(file)})`
            divPreview.style.display = 'inline-block'
        }
    } catch (error) {
        body.appendChild(popError(error, null))
        window.setTimeout(removeError,5000)
    }
}

var randomScrolled = 0

const smoothScroll = (container, direction) => {
    let articles = container.getElementsByTagName('article')
    let limit = (articles.length * 320) - 320
    switch (direction) {
        case 'right':
            if(randomScrolled === 0 || randomScrolled < limit){
                randomScrolled += 320
            }else if(randomScrolled === limit){
                randomScrolled = 0
            }
            container.scroll({
                top: 0,
                left: randomScrolled,
                behavior: "smooth"
            })
            break;
            
        case 'left':
            if(randomScrolled === limit || randomScrolled > 0){
                randomScrolled -= 320
            }else if(randomScrolled === 0){
                randomScrolled = limit
            }
            container.scroll({
                    top: 0,
                    left: randomScrolled,
                    behavior: "smooth"
                })    
            break;
    }
}

dogButton.onclick = () => loadRandomDogs()
btnUploadDog.onclick = () => uploadDogPic()
fileInput.onchange = () => loadPreview()

randDivScrollLeft.onclick = () => smoothScroll(randomDogs, 'left')
randDivScrollRight.onclick = () => smoothScroll(randomDogs, 'right')

loadRandomDogs()
loadFavouriteDogs()