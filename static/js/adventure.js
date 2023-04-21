const greetingContainer = document.getElementById('greeting-container');
const imagesContainer = document.getElementById('images-container');
const carouselContainer = document.querySelector('.carousel');
const saveCollectionContainer = document.querySelector('.save-collection');
const collectionInput = document.querySelector('.collection-input')

function enableSaveButton() {
    document.querySelector('.custom-button').disabled = collectionInput.value == '';
}

function searchText(event) {

    populate(event.currentTarget.value, apiKey, pseId);
}

async function populate(text, apiKey, pseId) {
    const baseURL = 'https://www.googleapis.com/customsearch/v1?';

    //check if keys were set
    

    if (text == '')
        return;
    else if (!apiKey || !pseId)
        document.location.href = 'config';
    else if (!text.includes('paisagem'))
        text += ' paisagem';
    const requestURL = baseURL + 'key=' + apiKey + '&cx=' + pseId + '&searchType=image&num=1&imgSize=xxlarge&q=' + encodeURIComponent(text);
    const request = new Request(requestURL);
    
    const response = await fetch(request);
    const image = await response.json();
    populateSource(image?.items[0].link.replace(/^(.+?\.(png|jpg|svg|gif|bmp)\x2F).*$/i, '$1'));//\x2F -> forward slash

}

function populateSource(link) {
    let htmlDiv = `<div class="image-container">
                        <button type="button" onclick="deleteImage(this)" class="delete-button btn btn-danger"><i class="bi bi-trash"></i></button>
                        <img class="image-search" src="${link}">
                    </div>`;
    carouselContainer.innerHTML += htmlDiv;
    
    carouselContainer.scrollLeft = carouselContainer.scrollWidth;
    handleContainersVisibility();
    showHideIcons();

}

function handleContainersVisibility() {
    greetingContainer.hidden = true;
    imagesContainer.hidden = true;
    saveCollectionContainer.hidden = true;

    if (carouselContainer.childElementCount == 0)
        greetingContainer.hidden = false;
    else if (carouselContainer.childElementCount > 0) {
        imagesContainer.hidden = false;
        saveCollectionContainer.hidden = false;
    }
}

function deleteImage(e) {
    e.parentNode.parentNode.removeChild(e.parentNode);

    handleContainersVisibility();
    showHideIcons();
}

function getSavedImages() {
    collectionInput.value = images[1];
    var arrayOfImages = images[0].split(';');
    if (arrayOfImages)
      arrayOfImages.forEach(image => {
        populateSource(image);
      });
}

getSavedImages();
enableSaveButton();

handleContainersVisibility();