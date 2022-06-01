const URL = 'https://api.thedogapi.com/v1/images/search'

const dogButton = document.querySelector('#dogButton')

async function getPicture() {
    let res = await fetch(URL)
    let dog = await res.json()

    const img = document.querySelector('img')
    img.src = dog[0].url
}

dogButton.addEventListener('click', getPicture)

getPicture()

/* fetch(URL)
    .then(res => res.json())
    .then(data => {
        const img = document.querySelector('img')
        img.src = data[0].url
    }) */