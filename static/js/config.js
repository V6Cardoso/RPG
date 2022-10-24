function saveGoogleKeys() {
    let apiKey = document.getElementById('api-key').value;
    let pseId = document.getElementById('pse-id').value;

    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('pseId', pseId);
}

function setDefaultValues() {
    document.getElementById('api-key').value = localStorage.getItem("apiKey");
    document.getElementById('pse-id').value = localStorage.getItem("pseId");
}

setDefaultValues();