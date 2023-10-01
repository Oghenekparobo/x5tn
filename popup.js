document.addEventListener("DOMContentLoaded", () => {
  // recording video logic
  const startRecording = document.querySelector("#start_video");
  const stopRecording = document.querySelector("#stop_video");

  // eventListeners
  startRecording.addEventListener("click", () => {
    console.log("start");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "start_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "runtime error");
          }
        }
      );
    });
  });

  stopRecording.addEventListener("click", () => {
    console.log("stop");
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "stop_recording" },
        function (response) {
          if (!chrome.runtime.lastError) {
            console.log(response);
          } else {
            console.log(chrome.runtime.lastError, "runtime error");
          }
        }
      );
    });
  });
  // togggle logic
  const cameraToggle = document.getElementById("camera-toggle");
  const videoToggle = document.getElementById("video-toggle");
  const cameraStatus = document.getElementById("camera-status");
  const videoStatus = document.getElementById("video-status");

  let isCameraOn = false;
  let isVideoOn = false;

  cameraToggle.addEventListener("click", () => {
    isCameraOn = !isCameraOn;
    updateToggle(cameraToggle, isCameraOn);
    updateStatus(cameraStatus, isCameraOn);
  });

  videoToggle.addEventListener("click", () => {
    isVideoOn = !isVideoOn;
    updateToggle(videoToggle, isVideoOn);
    updateStatus(videoStatus, isVideoOn);
  });

  function updateToggle(toggleElement, isOn) {
    const toggleButton = toggleElement.querySelector(".toggle-button");
    const newPosition = isOn ? "30px" : "0";
    toggleButton.style.transform = `translateX(${newPosition})`;
  }

  function updateStatus(statusElement, isOn) {
    console.log(isOn);
    //   statusElement.textContent = isOn ? "On" : "Off";
  }
});
