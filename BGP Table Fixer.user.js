// ==UserScript==
// @name         BGP Price Cut Table Fixer
// @namespace    http://crashpr.one
// @version      0.4
// @description  Sorts price cut list by date and removes all non-GB entries (see line 34 to mod)
// @author       You
// @match        https://boardgameprices.co.uk/item/pricedrops
// @match        https://boardgameprices.co.uk/item/pricedrops/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Config

    // List of strings (quoted, in lowercase) to filter out from results
    // Example: filterWords = [ "arkham", "star wars", "lord of the rings" ];
    var filterWords = [ ];

    // List of stores (quoted, in lowercase) that are to filter out from results
    // Example filterStores = [ "store one", "store two" ];
    var filterStores = [ ];

    // List of country codes (quoted, in lowercase) that are to be included
    // Example: [ "fr", "de" ];
    var countries = [ "gb" ];

    // Start of actual code
    var topdiv, i, s, spans, gparent;
    var todelete = [];
    var flag = "";
    var store = "";
    var itemName = "";

    // Delete nodes and div before and after
    function deleteLines(todelete, topdiv) {
        var i;

        for (i=0; i < todelete.length; i++ ) {
            todelete[i].nextElementSibling.remove();
            todelete[i].previousElementSibling.remove();
            topdiv.removeChild(todelete[i]);
        }
    }

    topdiv = document.getElementById("searchresultlist");

    // Delete non requested entries...

    // Find nodes to delete based on country or store
    spans = topdiv.getElementsByClassName("storename");
    for (i=0; i < spans.length ; i++) {
        // Grotty way to get the country code for the store
        flag = spans[i].children[0].src.substr(-6, 2).toLowerCase();
        store = spans[i].textContent.toLowerCase();
        if (countries.indexOf(flag) === -1) {
            gparent = spans[i].parentNode.parentNode;
            todelete.push(gparent);
            continue;
        } else if (filterStores.length > 0 ) {
            for (s=0; s < filterStores.length; s++) {
                if (store.includes(filterStores[s])) {
                    gparent = spans[i].parentNode.parentNode;
                    todelete.push(gparent);
                    break;
                }
            }
        }
    }
    deleteLines(todelete, topdiv);

    // Find nodes to delete based on keyword filters

    if (filterWords.length > 0) {
        todelete = [];
        spans = topdiv.getElementsByClassName("name");
        for (i=0 ; i < spans.length ; i++) {
            itemName = spans[i].children[0].textContent.toLowerCase();
            for (s=0; s < filterWords.length; s++ ) {
                if (itemName.includes(filterWords[s])) {
                    gparent = spans[i].parentNode.parentNode;
                    todelete.push(gparent);
                    break;
                }
            }
        }
        deleteLines(todelete, topdiv);
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
    //for (i=0; i < spansArray.length; i++) {
        //console.log(spansArray[i].parentNode.getElementsByTagName("div")[0].textContent.valueOf());
    //}

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
