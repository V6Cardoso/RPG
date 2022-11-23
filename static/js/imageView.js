function getImage() {
    let imageId = new URL(location.href).searchParams.get('id');

    let imagesJSON = localStorage.getItem('imagesJSON');
    let images = JSON.parse(imagesJSON);

    let image = images.find(x => x.id == imageId).website;

    document.getElementById('image-full').src = image;
    document.getElementById('image-full-link').href = image;
 }

 //getImage();