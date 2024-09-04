/* global chrome */
console.log('Content script injected');

// Replace with your OCR.Space API key
const OCR_API_KEY = 'K88247964288957';
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

function base64ToBlob(base64, mime) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mime });
}

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

async function handleCaptcha() {
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

  const base64Data = captchaImageData.split(',')[1];
  const mimeType = 'image/jpeg';

  const imageBlob = base64ToBlob(base64Data, mimeType);

  const formData = new FormData();
  formData.append('apikey', OCR_API_KEY);
  formData.append('language', 'eng');
  formData.append('isOverlayRequired', 'false');
  formData.append('file', imageBlob, 'captcha.jpg');

  try {
    console.log("captchaImageData", captchaImageData);
    const response = await fetch(OCR_SPACE_URL, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    const text = data.ParsedResults[0].ParsedText;
    console.log('Captcha text:', text);
    fillCaptchaInput(text.trim());
    clickContinueButton();
  } catch (err) {
    console.error('Error recognizing text from captcha:', err);
  }
}

function checkPageAndHandleCaptcha() {
  console.log('called checkPageAndHandleCaptcha');

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in content script:', message);
  if (message.action === 'fillForm') {
    checkPageAndHandleCaptcha();
    sendResponse({ status: 'received' });
  }
});
