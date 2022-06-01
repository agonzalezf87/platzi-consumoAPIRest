const API_URL = 'https://api.thedogapi.com/v1/images/search?limit=3'

const dogButton = document.querySelector('#dogButton')

async function getPicture() {
    let res = await fetch(API_URL)
    let data = await res.json()

    const img1 = document.getElementById('img1')
    const img2 = document.getElementById('img2')
    const img3 = document.getElementById('img3')
    img1.src = data[0].url
    img2.src = data[1].url
    img3.src = data[2].url
}

/* 
fetch(URL)
.then(res => res.json())
.then(data => {
    const img = document.querySelector('img')
    img.src = data[0].url
});
*/

dogButton.addEventListener('click', getPicture)

getPicture()
