/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
  console.log("IRCTC Form Renderer Extension Installed");
});


// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log("request.imageData", request.imageData);
//   if (request.action === "startOCR") {
//       const worker = new Worker(chrome.runtime.getURL('worker.js'));

//       worker.onmessage = function(event) {
//           sendResponse(event.data);
//       };

//       worker.postMessage({
//           // any data you want to send to the worker
//           cmd: 'recognize',
//           imageData: request.imageData,
//           options: { /* options */ }
//       });

//       return true; // Keep the message channel open for sendResponse
//   }
// });
