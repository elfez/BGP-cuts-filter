// ==UserScript==
// @name         BGP Table Fixer
// @namespace    http://crashpr.one
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://boardgameprices.co.uk/item/pricedrops
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function sortSpans(a, b) {
        var aText = a.parentNode.getElementsByTagName("div")[0].textContent.valueOf();
        var bText = b.parentNode.getElementsByTagName("div")[0].textContent.valueOf();
        console.log(aText, bText);
        if (aText > bText) return -1;
        if (aText < bText) return 1;
        return 0;
    }

    var topdiv, i, spans, gparent;
    var todelete = [];

    topdiv = document.getElementById("searchresultlist");

    // Delete non-UK stores...

    // Find nodes to delete
    spans = topdiv.getElementsByClassName("storename");
    for (i=0; i < spans.length ; i++) {
        if (! spans[i].children[0].src.includes("/img/flags/GB.png")) {
            gparent = spans[i].parentNode.parentNode;
            todelete.push(gparent);
        }
    }

    // Delete nodes and div before and after
    for (i=0; i < todelete.length; i++ ) {
        todelete[i].nextElementSibling.remove();
        todelete[i].previousElementSibling.remove();
        topdiv.removeChild(todelete[i]);
    }

    // Sort by date

    spans = topdiv.getElementsByClassName("storename");
    // Convert to Array
    var spansArray = Array.prototype.slice.call(spans, 0);
    spansArray.sort(function(a, b) {
        var aText = a.parentNode.getElementsByTagName("div")[0].textContent.valueOf();
        var bText = b.parentNode.getElementsByTagName("div")[0].textContent.valueOf();
        //console.log(aText, bText);
        if (aText > bText) return -1;
        if (aText < bText) return 1;
        return 0;
    })
    for (i=0; i < spansArray.length; i++) {
        console.log(spansArray[i].parentNode.getElementsByTagName("div")[0].textContent.valueOf());
    }

    var gparentPrev, gparentNext;

    for (i=0; i < spansArray.length; i++) {


        gparent = spansArray[i].parentNode.parentNode;
        gparentPrev = gparent.previousElementSibling;
        gparentNext = gparent.nextElementSibling;

        topdiv.appendChild(gparentPrev);
        topdiv.appendChild(gparent);
        topdiv.appendChild(gparentNext);

    }

})();