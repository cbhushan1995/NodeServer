const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const img = document.getElementById('imageele');

const previewBtn = document.getElementById('previewBtn');
let streamStarted = false;
let cameraValue = null
//const [pause] = buttons;


let blobs_recorded = [];
let camera_stream = null
let alertTimer = null


const constraints = {
    audio: false,
    video: {
        width: { ideal: 4096 }, 
        height: { ideal: 2160 } ,
        facingMode: "environment"
    }
};

const draw = () => {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(video, 0, 0);
        ctx.font = "10em Arial";
        ctx.fillStyle = "#000000";
        ctx.kerning = 10;
        let bash64 = btoa(window.localStorage.getItem('deviceID') ?? "")
        // for decoding bash64 string atob(bash64)
        let halfIndex = parseInt((bash64.length)/2) + 1

        let finalBash64 = bash64.slice(0, halfIndex) + "\n" + bash64.slice(halfIndex)

        ctx.fillText("4556545", 40, 300);
    }
}
previewBtn.onclick = function () {
    console.log("previewVideoURL :")
    uploadVideo()
};

const uploadVideo = () => {
    var formData = new FormData();
    formData.append('userVideo', new Blob(blobs_recorded, {type: 'video/mp4'}));

    fetch('http://192.168.179.13:3000/upload-avatar',{
        method: "POST",
        body: formData
    }).then(res => res.text()).then((res)=> {
        console.log(res);
        console.log('video uploaded')
        window.localStorage.setItem("file",res);
        location.href = "./preview_upload.html";
        return res;
    }).catch((e)=>{console.log(e)});
}



function runOCR(url) {
    const worker = new Tesseract.TesseractWorker();
    worker.recognize(url)
        .then(function (result) {
            console.log("recognize result.text :" + result.text)
        }).progress(function (result) {
            console.log("progress progress :" + result["status"] + " (" +
                (result["progress"] * 100) + "%)")
        });
}

setInterval(function () {
    draw();
}, 50);

setInterval(function () {
    // img.src = canvas.toDataURL('image/png');
    // runOCR(canvas.toDataURL('image/png'));
    runOCR(img.src);
}, 10000);

const startStreaming = () => {
    if (streamStarted) {
        video.play();
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
};

const startStream = async (constraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleStream(stream);
};

const recordingVideo = () => {
    // set MIME type of recording as video/webm
    media_recorder = new MediaRecorder(canvas.captureStream(), {
        mimeType: 'video/webm',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000
    });

    // event : new recorded video blob available
    media_recorder.addEventListener('dataavailable', function (e) {
        // write water mark timestamp on frame then save

        blobs_recorded.push(e.data);
    });


    // event : recording stopped & all blobs sent
    media_recorder.addEventListener('stop', function () {
        // showPreview()
    });

    // start recording with each recorded blob having 1 second video
    media_recorder.start(1000);
}

const handleStream = (stream) => {
    camera_stream = stream;
    video.srcObject = stream;
    recordingVideo();
};

const getCameraSelection = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log(JSON.stringify(devices))
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    cameraValue = videoDevices[0].deviceId;
};
video.addEventListener('loadedmetadata', function () {
    scale = 300 / video.videoWidth;

    w = video.videoWidth;
    h = video.videoHeight;

    canvas.width = w;
    canvas.height = h;
    // alert(`height ${video.videoHeight} width ${video.videoWidth}`)
});

getCameraSelection();
startStreaming();