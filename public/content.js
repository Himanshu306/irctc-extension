
// public/content.js

console.log('Content script injected');

// (function() {
//   // Create floating button
//   const button = document.createElement('div');
//   button.innerText = '+';
//   button.style.position = 'fixed';
//   button.style.bottom = '20px';
//   button.style.right = '20px';
//   button.style.width = '50px';
//   button.style.height = '50px';
//   button.style.backgroundColor = '#007bff';
//   button.style.color = '#fff';
//   button.style.borderRadius = '50%';
//   button.style.display = 'flex';
//   button.style.alignItems = 'center';
//   button.style.justifyContent = 'center';
//   button.style.cursor = 'pointer';
//   button.style.zIndex = '9999';
//   button.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
//   document.body.appendChild(button);

//   // Create side window
//   const sidebar = document.createElement('div');
//   sidebar.style.position = 'fixed';
//   sidebar.style.top = '0';
//   sidebar.style.right = '-300px'; // Initially hidden off-screen
//   sidebar.style.width = '300px';
//   sidebar.style.height = '100%';
//   sidebar.style.backgroundColor = '#fff';
//   sidebar.style.boxShadow = '-2px 0px 5px rgba(0,0,0,0.5)';
//   sidebar.style.transition = 'right 0.3s ease';
//   sidebar.style.zIndex = '9998'; // Behind the button
//   document.body.appendChild(sidebar);

//   // Load React App into Sidebar
//   const iframe = document.createElement('iframe');
//   iframe.src = chrome.runtime.getURL('index.html');
//   iframe.style.width = '100%';
//   iframe.style.height = '100%';
//   iframe.style.border = 'none';
//   sidebar.appendChild(iframe);

//   // Toggle sidebar visibility on button click
//   button.addEventListener('click', () => {
//     if (sidebar.style.right === '0px') {
//       sidebar.style.right = '-300px'; // Hide
//     } else {
//       sidebar.style.right = '0px'; // Show
//     }
//   });
// })();

function fillCaptchaInput(text) {
  const captchaInput = document.querySelector('input[formcontrolname="captcha"]');
  if (captchaInput) {
    captchaInput.value = text;
    captchaInput.dispatchEvent(new Event('input', { bubbles: true }));
    captchaInput.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    console.error('Captcha input element not found');
  }
}

function clickContinueButton() {
  const continueButton = document.querySelector('button.btnDefault.train_Search');
  if (continueButton) {
    continueButton.click();
  } else {
    console.error('"Continue" button not found');
  }
}

function checkPageAndHandleCaptcha() {
  const checkReadyState = () => {
    if (document.readyState === 'complete') {
      const captchaImageElement = document.querySelector('.captcha-img');
      if (captchaImageElement) {
        handleCaptcha();
      } else {
        console.log('Captcha image not found yet');
        setTimeout(checkReadyState, 1000); // Check again after 1 second
      }
    } else {
      setTimeout(checkReadyState, 1000); // Check again after 1 second
    }
  };

  checkReadyState();
}

function handleCaptcha() {
  const captchaImageElement = document.querySelector('.captcha-img');
  if (!captchaImageElement) {
    console.error('Captcha image element not found');
    return;
  }

  const captchaImageData = captchaImageElement.getAttribute('src');
  if (!captchaImageData) {
    console.error('Captcha image data not found');
    return;
  }

  Tesseract.recognize(
    captchaImageData,
    'eng',
    {
      logger: (m) => console.log("OCR Progress:", m),
    }
  ).then(({ data: { text } }) => {
    console.log('Captcha text:', text);
    fillCaptchaInput(text.trim());
    clickContinueButton();
  }).catch((err) => {
    console.error('Error recognizing text from captcha:', err);
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  if (message.action === 'fillForm') {
    checkPageAndHandleCaptcha();
    sendResponse({ status: 'received' });
  }
});
