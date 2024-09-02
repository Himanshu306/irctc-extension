/* global chrome */
import React, { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const IrctcForm = () => {
  const [passengers, setPassengers] = useState(() => {
    const savedPassengers = localStorage.getItem('passengers');
    return savedPassengers ? JSON.parse(savedPassengers) : [{ name: '', age: '', gender: '', nationality: '' }];
  });

  useEffect(() => {
    localStorage.setItem('passengers', JSON.stringify(passengers));
  }, [passengers]);

  const handleChange = (index, field, value) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const addPassengerRow = () => {
    setPassengers([...passengers, { name: '', age: '', gender: '', nationality: '' }]);
  };

  const clearForm = () => {
    localStorage.removeItem('passengers');
    setPassengers([{ name: '', age: '', gender: '', nationality: '' }]);
  };

  const handleSubmit = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        
        // Inject content script and then send a message
        chrome.scripting.executeScript({
          target: { tabId },
          function: fillPassengerDetails,
          args: [passengers]
        }).then(() => {
          // Script injection successful
          chrome.runtime.sendMessage({ action: 'fillForm', passengers }, (response) => {
            console.log('Message sent, response:', response);
          });
        }).catch((error) => {
          console.error('Error injecting content script:', error);
        });
      }
    });
  };
  

  return (
    <div className="App">
      <h3>Passenger Details</h3>
      {passengers.map((passenger, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Passenger Name"
            value={passenger.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) => handleChange(index, 'age', e.target.value)}
          />
          <select value={passenger.gender} onChange={(e) => handleChange(index, 'gender', e.target.value)}>
            <option value="">Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="T">Transgender</option>
          </select>
          <select value={passenger.nationality} onChange={(e) => handleChange(index, 'nationality', e.target.value)}>
            <option value="">Nationality</option>
            <option value="AF">Afghanistan</option>
            <option value="AL">Albania</option>
            <option value="IN">India</option>
          </select>
        </div>
      ))}
      <button onClick={addPassengerRow}>Add Passenger</button>
      <button onClick={handleSubmit}>Fill Form</button>
      <button onClick={clearForm}>Clear Form</button>
    </div>
  );
};

function fillPassengerDetails(passengers) {
  passengers.forEach((details, index) => {
    if (index > 0) {
      const addButton = document.querySelector('div[class*="zeroPadding"] a span:first-child');
      addButton.click();
    }

    // Name
    const nameInput = document.querySelectorAll('p-autocomplete[formcontrolname="passengerName"] input')[index];
    nameInput.value = details.name;
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Age
    const ageInput = document.querySelectorAll('[formcontrolname="passengerAge"]')[index];
    ageInput.value = details.age;
    ageInput.dispatchEvent(new Event('input', { bubbles: true }));
    ageInput.dispatchEvent(new Event('change', { bubbles: true }));

    // Gender
    const genderSelect = document.querySelectorAll('[formcontrolname="passengerGender"]')[index];
    genderSelect.value = details.gender;
    genderSelect.dispatchEvent(new Event('input', { bubbles: true }));
    genderSelect.dispatchEvent(new Event('change', { bubbles: true }));

    // Nationality
    const nationalitySelect = document.querySelectorAll('[formcontrolname="passengerNationality"]')[index];
    nationalitySelect.value = details.nationality;
    nationalitySelect.dispatchEvent(new Event('input', { bubbles: true }));
    nationalitySelect.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Submit the form
  // const form = document.querySelector('form');
  // form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  const continueButton = document.querySelector('button.train_Search.btnDefault[type="submit"]');
  continueButton.click();

  console.log("absmbasbmabs");
}


export default IrctcForm;
