let dark = false;

window.onload = function() {
    value = localStorage.getItem("darkMode",this.dark);
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

    const textLightColor = '#d3d3d3';
    const textDarkColor = 'black'

    const box = document.getElementsByClassName('box');
    const fellowshipImage = document.getElementById('fellowshipImage');
    const text = document.getElementsByClassName('text-name');
        

    if (this.dark) {
        for (let i = 0; i < box.length; i++)
            box[i].style.backgroundColor = '#444';

        for (let i = 0; i < text.length; i++)
            text[i].style.color = textLightColor;
        
        if (fellowshipImage != null) {
            fellowshipImage.src = 'img/fellowship-gray.png';
        }
        
    }
    else {
        for (let i = 0; i < box.length; i++)
            box[i].style.backgroundColor = 'lightyellow';

        for (let i = 0; i < text.length; i++)
            text[i].style.color = textDarkColor;

        if (fellowshipImage != null) {
            fellowshipImage.src = 'img/fellowship.png';
        }
    }
}


