feather.replace();

const controls = document.querySelector('.controls');
const cameraOptions = document.querySelector('.video-options>select');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const buttons = [...controls.querySelectorAll('button')];
const alertsContainer = document.querySelector('.alertsContainer')
const previewButtons = document.querySelector('.previewButtons')
const uploadButton = document.querySelector('.upload')
const retakeButton = document.querySelector('.retake')

let streamStarted = false;
let cameraValue = null
const [pause] = buttons;

let blobs_recorded = [];
let camera_stream = null
let alertTimer = null

// const constraints = {
//   audio: false,
//   video: {
//     width: {
//       min: 1280,
//       ideal: 1920,
//       max: 2560,
//     },
//     height: {
//       min: 720,
//       ideal: 1080,
//       max: 1440
//     },
//     facingMode: 'environment', // Or 'user'
//   }
// };

var constraints = {
  video: {
    width: { min: 320, ideal: 320 },
    height: { min: 240 },
    frameRate: 60,
    facingMode: "environment",
  }
};


const showAlertMessage = (message, isSuccess) => {
  let style = isSuccess ? "alert-success" : "alert-warning"
  alertsContainer.innerHTML = ''
  alertsContainer.innerHTML = `<div class="alert ${style} alert-dismissible fade show">
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
     ${message}
    </div>`
  clearTimeout(alertTimer)
  alertTimer = setTimeout(() => {
      alertsContainer.innerHTML = ''
      clearTimeout(alertTimer)
  },8000)
}


const startStreaming = () => {
  if (streamStarted) {
    video.play();
    pause.classList.remove('d-none');
    return;
  }
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      ...constraints,
      deviceId: {
        exact: cameraValue
      }
    };
    startStream(updatedConstraints);
  }
};

const pauseStream = () => {
  media_recorder.stop();
  video.pause();
  pause.classList.add('d-none');
};

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  // screenshotImage.src = canvas.toDataURL('image/webp');
  // screenshotImage.classList.remove('d-none');
};


const startStream = async (constraints) => {
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  handleStream(stream);
};

const recordingVideo = () => {
  // set MIME type of recording as video/webm
    media_recorder = new MediaRecorder(camera_stream, { mimeType: 'video/webm' });

    // event : new recorded video blob available 
    media_recorder.addEventListener('dataavailable', function(e) {
    blobs_recorded.push(e.data);
    });

    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function() {
      // create local object URL from the recorded video blobs
      let video_local = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/mp4' }));
      //download_link.href = video_local;
      // uploadVideo();
      showPreview()
    });

    // start recording with each recorded blob having 1 second video
    media_recorder.start(1000);
}


const handleStream = (stream) => {
  camera_stream = stream;
  video.srcObject = stream;
  pause.classList.remove('d-none');
  pause.classList.remove('pause');
  recordingVideo();
};


const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  console.log(JSON.stringify(devices))
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  cameraValue = videoDevices[0].deviceId;
};


const uploadVideo = () => {
  var formData = new FormData();
  formData.append('userVideo.mp4', new Blob(blobs_recorded, {type: 'video/mp4'}));
  showAlertMessage("Please wait while uploading video",false)
  fetch('http://192.168.18.13:3000/upload-avatar',{
    method: "POST",
    body: formData
  }).then((res)=> {
    console.log(res);
    console.log('video uploaded')
    previewButtons.classList.add('d-none');
    showAlertMessage("Video Upload successfully",true)
    setTimeout(()=>{retakeProcess()}, 2000)
    return res;
  }).catch((e)=>{console.log(e)});
}


function toggleControls() {
  if (video.hasAttribute("controls")) {
     video.removeAttribute("controls")   
  } else {
     video.setAttribute("controls","controls")   
  }
}

const showPreview = () => {
  camera_stream.getTracks().forEach(track => track.stop());
  video.srcObject = null
  let previewVideo = URL.createObjectURL(new Blob(blobs_recorded, { type: 'video/mp4' }));
  video.src = previewVideo;
  toggleControls()
  video.play();
  previewButtons.classList.remove('d-none');
}


const retakeProcess = () => {
  video.src = null
  blobs_recorded = []
  previewButtons.classList.add('d-none');
  toggleControls()
  startStreaming();
}

pause.onclick = pauseStream;
uploadButton.onclick = uploadVideo
retakeButton.onclick = retakeProcess
previewButtons.classList.add('d-none');
getCameraSelection();
startStreaming();