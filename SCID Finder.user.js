// ==UserScript==
// @name         SCID Finder
// @namespace    https://github.com/35e/scid-finder
// @version      0.1
// @description  Search socialclub id associated with the name
// @author       35e
// @match        https://socialclub.rockstargames.com/*
// @grant        GM_addStyle
// ==/UserScript==

// Add btn to DOM
(function() {
  let btnNode = document.createElement('div')
  btnNode.innerHTML = '<button id="scid-search">Get SCID</button>'
  document.body.appendChild(btnNode)
  btnNode.addEventListener('click', searchUser)
})()

// Declare variables
let profileUrl = ''

// Main function
async function searchUser() {
  let userName = prompt('What is the name of the person?')
  if (userName === null) return
  profileUrl = `https://scapi.rockstargames.com/profile/getprofile?nickname=${userName.toLowerCase()}`

  let data = await sendRequest()

  if (data.status !== true) {
    return alert('User not found')
  }

  navigator.clipboard.writeText(data.accounts[0].rockstarAccount.rockstarId)
  alert(`SCID copied to clipboard: ${data.accounts[0].rockstarAccount.rockstarId}`)
}

// Request
let sendRequest = async () => {
  let response = await fetch(profileUrl, {
    headers: new Headers({
      'Authorization': `Bearer ${getCookie('BearerToken')}`,
      'Content-Type': 'application/json',
      'x-requested-with': 'XMLHttpRequest'
    })
  })

  return response.json()
}

// Get cookie
let getCookie = (type) => {
  return decodeURIComponent(document.cookie).split(';')
    .find(e => e.includes(type))
    .replace(` ${type}=`, '')
}

// Tampermonkey CSS
GM_addStyle(`
  #scid-search {
    position: fixed;
    right: 10px;
    bottom: 10px;
    background-color: #fcaf17;
    padding: 10px;
    border-radius: 5px;
    border: 0;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  #scid-search:hover {
    transform: scale(1.1);
  }
`)
