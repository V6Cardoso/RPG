const greetingContainer = document.getElementById('greeting-container');
const imagesConainer = document.getElementById('images-container');



function searchText(event) {
    if (!greetingContainer.hidden) {
        greetingContainer.hidden = true;
        imagesConainer.hidden = false;
    }


    //populate(event.currentTarget.value, apiKey, pseId);
}



async function populate(text, apiKey, pseId) {
    const baseURL = 'https://www.googleapis.com/customsearch/v1?';

    //check if keys were set
    if (!apiKey || !pseId)
        document.location.href = 'config';

    /* if (!text.includes('paisagem'))
        text += ' paisagem'; */
    const requestURL = baseURL + 'key=' + apiKey + '&cx=' + pseId + '&searchType=image&num=1&imgSize=xxlarge&q=' + encodeURIComponent(text);
    const request = new Request(requestURL);
    
    const response = await fetch(request);
    const image = await response.json();
    populateSource(image);

}

function populateSource(obj) {

    let imgLinkFormatter = obj.items[0].link.replace(/^(.+?\.(png|jpg|svg|gif|bmp)\x2F).*$/i, '$1');//\x2F -> forward slash

    const container = document.getElementById('images-container');
    container.innerHTML += `
        <div class="imageCollection" style="position:relative;">
            <button type="button" class="delete-button btn btn-danger"><i class="bi bi-trash"></i></button>
            <img class="image" src="${imgLinkFormatter}">
        </div>
    `;

    //document.location.href = 'imageView?link=' + imgLinkFormatter;
}