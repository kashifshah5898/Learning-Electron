const { ipcRenderer, remote } = require("electron");
// const { dialog } = remote;
const fs = require("fs");
const path = require("path");

const loginForm = document.getElementById('login-form');
const fileDetailsDiv = document.getElementById('file-details');

// loginForm.addEventListener('submit', (event) => {
  const submitForm=(event)=>{
event.preventDefault();

  const usernameInput = document.getElementById('username');
  const username = usernameInput.value.trim();

  if (username !== '') {
    // Send the username to the main process
    ipcRenderer.send('username-selected', username);
  }
};

ipcRenderer.on('display-username', (event, username) => {
  // const welcomeText = document.createElement('h3');
  // welcomeText.innerHTML = `Welcome ${username}`;
  // fileDetailsDiv.prepend(welcomeText);

  const welcomeText = document.getElementById('display-username');
  welcomeText.innerHTML = `Welcome ${username}`;
  // fileDetailsDiv.prepend(welcomeText);
});

const fileList = document.getElementById("file-list");
document.addEventListener('DOMContentLoaded', () => {
    // ...existing code...
  
    const defaultFilePath = ''; // Set the initial file path to an empty string
    displayFileDetails(defaultFilePath);
  
    // ...existing code...
  });
function displayFiles(directoryPath) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    fileList.innerHTML = ""; // Clear the file list

    files.forEach((file) => {
      const listItem = document.createElement("li");
      listItem.textContent = file;
      listItem.addEventListener("click", () => {
        const filePath = path.join(directoryPath, file);
        displayFileDetails(filePath);
      });

      fileList.appendChild(listItem);
    });
  });
}

function displayFileDetails(filePath) {
  const fileDetailsDiv = document.getElementById("file-details");
  if (!filePath) {
    fileDetailsDiv.textContent = "Please select the file to show details.";
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    fileDetailsDiv.innerHTML = `File Name: ${path.basename(filePath)}<br>
                                Size: ${stats.size} bytes<br>
                                Last Modified: ${stats.mtime}`;
  });
}

// Display the files in the default directory (you can change this)
const defaultDirectoryPath = "./uploads";
displayFiles(defaultDirectoryPath);

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  document.addEventListener("drop", (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    handleDroppedFiles(files);
  });
});

function handleDroppedFiles(files) {
  files.forEach((file) => {
    const filePath = file.path;
    const fileName = path.basename(filePath);
    const destinationPath = path.join(__dirname, "uploads", fileName); // Change the destination path as per your requirement

    fs.copyFile(filePath, destinationPath, (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        alert(`Assignment ${fileName} uploaded successfully!`);
        const uploadsDir = path.join(__dirname, "uploads");
        displayFiles(uploadsDir);
      }
    });
  });
}

// Add an event listener to a button or any element that triggers the file browser
// const browseButton = document.getElementById('browse-button');
// browseButton.addEventListener('click', () => {
//   dialog.showOpenDialog({
//     properties: ['openFile', 'multiSelections'], // Allow multiple file selection
//   })
//     .then((result) => {
//       if (!result.canceled) {
//         const selectedFiles = result.filePaths;
//         handleSelectedFiles(selectedFiles);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// });

const videoElement = document.getElementById("video-element");
const startWebcamButton = document.getElementById("start-webcam-button");
const stopWebcamButton = document.getElementById("stop-webcam-button");

let mediaStream;

startWebcamButton.addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      mediaStream = stream;
      videoElement.srcObject = mediaStream;
    })
    .catch((err) => {
      console.error("Error accessing webcam:", err);
    });
});

stopWebcamButton.addEventListener("click", () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => {
      track.stop();
    });
    videoElement.srcObject = null;
  }
});

const quitButton = document.getElementById('quit-button');

  quitButton.addEventListener('click', () => {
    ipcRenderer.send('quit-app');
  });
  
