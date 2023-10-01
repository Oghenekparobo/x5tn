let recorder = null;
let uniqueId = null;
let stream = null;
let recording = false;

function startRecording() {
  navigator.mediaDevices
    .getDisplayMedia({
      audio: true,
      video: {
        width: 9999999999,
        height: 9999999999,
      },
    })
    .then(onAccessApproved)
    .catch((error) => {
      console.error("Error accessing media devices:", error);
    });
}

function stopRecording() {
  if (!recorder) {
    console.log("No recorder to stop");
    return;
  }

  console.log("Stopping video recording");

  recorder.stop();
}

function onAccessApproved(mediaStream) {
  stream = mediaStream;

  uniqueId = generateUniqueId();
  const chunks = [];
  const options = {
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: "video/mp4",
  };
  recorder = new MediaRecorder(stream);

  recorder.ondataavailable = function (event) {
    if (event.data.size > 0) {
      // Send video data chunk to the backend
      chunks.push(event.data);
      // sendChunkToBackend(event.data);
    }
  };

  recorder.onstop = function () {
    stream.getTracks().forEach(function (track) {
      if (track.readyState === "live") {
        track.stop();
      }

      // Redirect to the landing page
      window.location.href = `https://x5-seven.vercel.app//recording?${uniqueId}`;
    });

    console.log("Video recording stopped");
    console.log(chunks);
    actualChunks = chunks.splice(0, chunks.length);
    const blob = new Blob(actualChunks, { type: "video/webm; codecs=vp8" });
    // uploadVideoPart(blob); // Upload to server
    sendChunkToBackend(blob);

    if (recording) {
      finalizeVideoUpload();
    }
  };

  recorder.start();
  recording = true;
}

function generateUniqueId() {
  let d = Date.now().toString();
  let filename = "hngx-recorder";
  return filename + d;
}

function sendChunkToBackend(chunks) {
  const file = new File([chunks], `${uniqueId}.mp4`, {
    type: "video/mp4",
  });

  const formData = new FormData();
  formData.append("file", file, `${uniqueId}.mp4`);

  fetch("https://1c29-102-88-35-234.ngrok-free.app/api", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log(response);
      // Handle the response from the server (if needed)
    })
    .catch((error) => {
      console.log(error);
      // Handle errors, if any
    });
}

function finalizeVideoUpload() {
  // Signal to the backend that video recording is complete
  console.log(uniqueId);
  // fetch("YOUR_BACKEND_FINALIZE_URL", {
  //   method: "POST",
  //   body: JSON.stringify({ videoId: uniqueId }),
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // })
  //   .then((response) => {
  //     // Handle the response from the server (if needed)
  //   })
  //   .catch((error) => {
  //     // Handle errors, if any
  //   });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_recording") {
    console.log("About to start recording");
    sendResponse(`Processing: ${message.action}`);
    startRecording();
  }

  if (message.action === "stop_recording") {
    stopRecording();
    sendResponse(`Processed: ${message.action}`);
  }
});
