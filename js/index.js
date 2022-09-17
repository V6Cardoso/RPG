function disableButton() {
    if(document.getElementById("search-input").value === "") { 
        document.getElementById('search-button').hidden = true; 
    } else { 
        document.getElementById('search-button').hidden = false;
    }
}


async function populate(text) {
    const baseURL = 'https://www.googleapis.com/customsearch/v1?';
    const apiKey = localStorage.getItem('apiKey');
    const pseId = localStorage.getItem('pseId');

    //check if keys were set
    if (!apiKey || !pseId)
        document.location.href = 'config.html';

    if (!text.includes('landscape'))
        text += ' landscape';
    const requestURL = baseURL + 'key=' + apiKey + '&cx=' + pseId + '&searchType=image&num=1&imgSize=xxlarge&q=' + encodeURIComponent(text);
    const request = new Request(requestURL);
    
    const response = await fetch(request);
    const image = await response.json();
    populateSource(image);

}

function populateSource(obj) {
    let imagesJSON = localStorage.getItem('imagesJSON');
    let images = JSON.parse(imagesJSON);
    if (images == null)
        images = [];

    let newObj = { id: images.length, website: obj.items[0].link.replace(/^(.+?\.(png|jpg|svg|gif|bmp)\x2F).*$/i, '$1') };//\x2F -> forward slash

    images.push(newObj);
    console.log(images);
    const imagesNewJSON = JSON.stringify(images);
    console.log(imagesNewJSON);
    localStorage.setItem('imagesJSON', imagesNewJSON);

    document.location.href = 'imageView.html?id=' + newObj.id;
}