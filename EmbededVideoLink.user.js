// ==UserScript==
// @name         EmbededVideoLink
// @namespace    https://github.com/taktheh/EmbededVideoLink
// @version      0.5.0
// @description  List up links of embeded videos.
// @author       Takamaro the Hentai
// @downloadURL  https://github.com/taktheh/EmbededVideoLink/raw/master/EmbededVideoLink.user.js
// @include      http://*
// @include      https://*
// @exclude      https://drive.google.com/file/d/*
// @exclude      https://disqus.com/*
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  const matchList = [
    '/e/', '/embed/',
    'fembed\.com/v/', 'asianclub\.tv/v/', 'vidoza.net/embed',
    'drive.google.com/.*file/d/',
  ];
  const excludeList = [
    'https://platform.twitter.com'
  ];
  const MSG_MAGIC = "EmVidLi_";
  const frameHrefs = [];

  function getLinkListElement() {
    if (window.EmbededVideoLinkList) {
      return window.EmbededVideoLinkList.lastChild;
    }
    else {
      var div = document.createElement("div");
      var button = document.createElement("button");
      var ul = document.createElement("ul");

      div.id = "EmbededVideoLinkList";
      div.style.cssText =
        "position:fixed;z-index:32767;top:2em;right:0;" +
        "background:white;opacity:0.7;max-width:100%";
      button.textContent = "✖";
      button.onclick = function () {
        document.body.removeChild(window.EmbededVideoLinkList);
      }
      button.style.cssText =
        "all:initial;margin:0;padding:0;font:menu;color:black;line-height:100%;";
      ul.style.cssText = "margin:0;padding:4px;list-style-type:none;";

      div.appendChild(button);
      div.appendChild(ul);
      document.body.appendChild(div);

      return ul;
    }
  }

  function checkEmbededVideo() {
    const matches = matchList.map(s => new RegExp(s));
    const excludes = excludeList.map(s => new RegExp(s));
    const ul = getLinkListElement();

    frameHrefs.forEach(src => {
      if (matches.find(r => r.test(src)) && !excludes.find(r => r.test(src))) {
        const li = document.createElement("li");
        const a = document.createElement("a");

        a.href = src;
        a.textContent = src;
        a.style.cssText = "font:menu;color:gray;";
        li.appendChild(a);
        ul.appendChild(li);
      }
    });
  }

  function receiveEmVidLiMessage(event) {
    if (event.data.substr(0, 8) === MSG_MAGIC) {
      frameHrefs.push(event.data.substr(8));
    }
  }

  if (top === window.self) {
    GM_registerMenuCommand("List up embeded video links", checkEmbededVideo);
    window.addEventListener("message", receiveEmVidLiMessage);
  } else {
    top.postMessage(MSG_MAGIC + location.href, "*");
  }
})();
