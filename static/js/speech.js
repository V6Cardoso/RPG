const recordButton = document.getElementById('record-button');
const stopRecordingButton = document.getElementById('stop-recording-button');
const inputText = document.getElementById("search-input");

class speechApi {

    constructor() {
  
      const SpeechToText = window.SpeechRecognition || window.webkitSpeechRecognition
  
      this.speechApi = new SpeechToText()
      this.output = inputText.output 
      this.speechApi.continuous = true
      this.speechApi.lang = "pt-BR"
      
      this.speechApi.onresult = (e) => {
        var resultIndex = e.resultIndex
        var transcript = e.results[resultIndex][0].transcript
  
        inputText.value = transcript;
        analyseText(transcript);
      }
    }
  
    start() {
      this.speechApi.start()
    }
  
    stop() {
      this.speechApi.stop()
    }
}

var speech = new speechApi();

function record() {
    stopRecordingButton.hidden = false;
    recordButton.hidden = true;
    inputText.value = '';
    speech.start();
}

function stopRecording() {
    recordButton.hidden = false;
    stopRecordingButton.hidden = true;
    speech.stop();
}