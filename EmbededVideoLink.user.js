// ==UserScript==
// @name         EmbededVideoLink
// @namespace    https://github.com/taktheh/EmbededVideoLink
// @version      0.4.5
// @description  List up links of embeded videos.
// @author       Takamaro the Hentai
// @downloadURL  https://github.com/taktheh/EmbededVideoLink/raw/master/EmbededVideoLink.user.js
// @include      http://*
// @include      https://*
// @exclude      https://drive.google.com/file/d/*
// @exclude      https://disqus.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const matchList = [
        '/e/', '/embed/',
        'fembed\.com/v/', 'asianclub\.tv/v/', 'vidoza.net/embed',
        'drive.google.com/.*file/d/',
    ];
    const MSG_MAGIC = "EmVidLi_";

    function closeLinkList() {
    }
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
            button.onclick = function() {
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

    function receiveEmVidLiMessage(event) {
        if (event.data.substr(0, 8) === MSG_MAGIC) {
            var ul = getLinkListElement();
            var li = document.createElement("li");
            var a = document.createElement("a");
            var src = event.data.substr(8);

            a.href = src;
            a.textContent = src;
            a.style.cssText = "font:menu;color:gray;";
            li.appendChild(a);
            ul.appendChild(li);
        }
    }

    if (top === window.self) {
        window.addEventListener("message", receiveEmVidLiMessage);
    } else {
        if (matchList.find(s => (new RegExp(s)).test(location.href))) {
            top.postMessage(MSG_MAGIC + location.href, "*");
        }
    }
})();
