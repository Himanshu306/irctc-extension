

(function() {
    // Create floating button
    const button = document.createElement('div');
    button.innerText = '+';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.borderRadius = '50%';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
    document.body.appendChild(button);
  
    // Create side window
    const sidebar = document.createElement('div');
    sidebar.style.position = 'fixed';
    sidebar.style.top = '0';
    sidebar.style.right = '-300px'; // Initially hidden off-screen
    sidebar.style.width = '300px';
    sidebar.style.height = '100%';
    sidebar.style.backgroundColor = '#fff';
    sidebar.style.boxShadow = '-2px 0px 5px rgba(0,0,0,0.5)';
    sidebar.style.transition = 'right 0.3s ease';
    sidebar.style.zIndex = '9998'; // Behind the button
    document.body.appendChild(sidebar);
  
    // Load React App into Sidebar
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('index.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    sidebar.appendChild(iframe);
  
    // Toggle sidebar visibility on button click
    button.addEventListener('click', () => {
      if (sidebar.style.right === '0px') {
        sidebar.style.right = '-300px'; // Hide
      } else {
        sidebar.style.right = '0px'; // Show
      }
    });
  })();