const recordStart = document.getElementById('record-start');
const recordStop = document.getElementById('record-stop');
const downloadLink = document.getElementById('record-download');
const videoElement = document.querySelector('video');
let startDate;

window.onload = screenCapture();

function screenCapture() {
  recordStart.onclick = async function recordStream() {
    try {
      let mediaStream = await navigator.mediaDevices.getDisplayMedia({video:true});

      videoElement.srcObject = mediaStream;
      videoElement.onloadedmetadata = function(e) {
        initRecording(videoElement, mediaStream);
      };
    } catch (error) {
      console.log('Unable to acquire screen capture: ' + error);
    }
  }
}

function initRecording(videoElement, mediaStream) {
  const recorder = new MediaRecorder(mediaStream, {
    mimeType: 'video/webm'
  });

  console.log('start recording');

  startDate = new Date();
  recorder.start();
  recordStart.classList.toggle('disabled');
  recordStop.classList.remove('disabled');
  downloadLink.classList.add('hidden');
  videoElement.classList.toggle('active');
  videoElement.play();

  recordStop.onclick = function() {
    console.log('stop recording');
    recorder.stop();
    recordStart.classList.toggle('disabled');
    recordStop.classList.toggle('disabled');
    videoElement.classList.toggle('active');
  }

  recorder.ondataavailable = function(event) {
    const data = getVideoData(event);
    const recordedBlob = new Blob(data, { type: 'video/webm' });
    const downloadUrl = URL.createObjectURL(recordedBlob);
    const fileDate = getFileDate()

    downloadLink.href = downloadUrl;
    downloadLink.download = `screencap${fileDate}.webm`;
    downloadLink.classList.toggle('hidden');
  }
}

function getVideoData(event) {
  let data = [];

  if (event.data.size > 0) {
    data.push(event.data);
  }

  return data;
}

function getFileDate() {
  return startDate.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).replace(/\W|!\d/g, '')
    + '@' +
    startDate.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).replace(/\W|!\d/g, '');
}
