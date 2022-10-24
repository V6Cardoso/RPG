let dark = false;

window.onload = function() {
    value = localStorage.getItem("darkMode");
    this.dark = (value === 'true');

    if (document.getElementById('darkmode') != null)
        document.getElementById('darkmode').checked = this.dark;

    darkMode();
 }


function darkMode() {

    if (document.getElementById('darkmode') != null) {
        this.dark = document.getElementById('darkmode').checked;
        localStorage.setItem('darkMode', this.dark);
    }

    const lightColor = '#d3d3d3';
    const textDarkColor = 'black'
    const grayishColor = 'gray';

    const box = document.getElementsByClassName('box');
    const fellowshipImage = document.getElementById('fellowshipImage');
    const text = document.getElementsByClassName('text-name');
    const image = document.getElementsByClassName('image');
        

    if (this.dark) {
        for (let i = 0; i < box.length; i++)
            box[i].style.backgroundColor = '#444';

        for (let i = 0; i < text.length; i++)
            text[i].style.color = lightColor;
        
        for (let i = 0; i < image.length; i++)
            image[i].style['border-color'] = lightColor;
        
        if (fellowshipImage != null) {
            fellowshipImage.src = 'img/fellowship-gray.png';
        }
        
    }
    else {
        for (let i = 0; i < box.length; i++)
            box[i].style.backgroundColor = 'lightyellow';

        for (let i = 0; i < text.length; i++)
            text[i].style.color = textDarkColor;
        
        for (let i = 0; i < image.length; i++)
            image[i].style['border-color'] = grayishColor;

        if (fellowshipImage != null) {
            fellowshipImage.src = 'img/fellowship.png';
        }
    }
}




