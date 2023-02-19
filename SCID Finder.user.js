// ==UserScript==
// @name         SCID Finder
// @namespace    https://github.com/35e/scid-finder
// @version      0.4
// @description  Search socialclub id associated with the name
// @author       35e
// @match        https://socialclub.rockstargames.com/*
// @grant        GM_addStyle
// ==/UserScript==

// Create button
const btnNode = document.createElement('div');
btnNode.innerHTML = `<button id="scid-search" title="Search SCID">
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="3em" height="3em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="currentColor"/><path d="M10.35 14.01C7.62 13.91 2 15.27 2 18v1c0 .55.45 1 1 1h8.54c-2.47-2.76-1.23-5.89-1.19-5.99zm9.08 4.01c.47-.8.7-1.77.48-2.82c-.34-1.64-1.72-2.95-3.38-3.16c-2.63-.34-4.85 1.87-4.5 4.5c.22 1.66 1.52 3.04 3.16 3.38c1.05.22 2.02-.01 2.82-.48l1.86 1.86a.996.996 0 1 0 1.41-1.41l-1.85-1.87zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2z" fill="currentColor"/></svg>
  </button>`;
document.body.appendChild(btnNode);
btnNode.addEventListener('click', searchUser);

// Search user
async function searchUser() {
  if (!checkLoggedIn()) return;
  const userName = prompt('What is the name of the person?');
  if (userName === null) return;

  const data = await sendRequest(`https://scapi.rockstargames.com/profile/getprofile?nickname=${userName.toLowerCase()}`);

  // Check for errors
  if (data.error) {
    switch (data.error.code) {
      case "401":
        return alert('Authentication token outdated, please refresh the page.');
      case "5001.27":
        return alert('Username is not valid.');
      case "6000.41":
        return alert('Username doesn\'t exist.');
      default:
        return alert('An error occured, please try again.');
    }
  }

  navigator.clipboard.writeText(data.accounts[0].rockstarAccount.rockstarId);
  alert(`SCID copied to clipboard: ${data.accounts[0].rockstarAccount.rockstarId}`);
}

// Check if user is logged in
const checkLoggedIn = () => {
  if (!getCookie('BearerToken')) {
    alert('Make sure you\'re logged in to socialclub');
    return false;
  }
  return true;
};

// Get cookie from document
const getCookie = (type) => {
  const cookies = decodeURIComponent(document.cookie).split(';');
  const cookie = cookies.find(cookie => cookie.trim().startsWith(type));
  return cookie ? cookie.trim().substring(`${type}=`.length) : null;
};

// Save current bearer token
const cachedBearerToken = getCookie('BearerToken');

// Send request
const sendRequest = async (url) => {
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${cachedBearerToken}`,
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest'
    }
  });

  return response.json();
}

// Tampermonkey CSS
GM_addStyle(`
  #scid-search {
    padding: 7px;
    position: fixed;
    right: 15px;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-50%);
    background-color: #fcaf17;
    border: 2px solid #000;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    z-index: 9999;
  }

  #scid-search:hover {
    background-color: #000;
    border-color: #fcaf17;
    color: #fcaf17;
  }
`)
