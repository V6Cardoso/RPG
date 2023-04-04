
async function populate(text, apiKey, pseId) {
    const baseURL = 'https://www.googleapis.com/customsearch/v1?';

    //check if keys were set
    if (!apiKey || !pseId)
        document.location.href = 'config';

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

    document.location.href = 'imageView?link=' + newObj.website;
}