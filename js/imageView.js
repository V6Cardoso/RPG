function getImage() {
    let imageId = localStorage.getItem("selectedImageId");

    let imagesJSON = localStorage.getItem('imagesJSON');
    let images = JSON.parse(imagesJSON);

    let image = images.find(x => x.id == imageId).website;

    document.getElementById('image-full').src = image;
 }

 getImage();