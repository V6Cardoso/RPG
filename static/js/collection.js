function buildImages() {
    let imagesJSON = localStorage.getItem('imagesJSON');
    let images = JSON.parse(imagesJSON);

    images.forEach(element => {
        let link = document.createElement('a');
        link.classList.add('image-link');
        link.setAttribute('href', 'imageView.html?id=' + element.id);

        let image = document.createElement('img');
        image.classList.add('image');
        image.setAttribute('src', element.website);

        link.appendChild(image);
        document.getElementById('img-collection').appendChild(link);
    });
}

buildImages();