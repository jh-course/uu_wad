(function (environment) {
    'use strict';

    /**
     * Beräkna ett elements absoluta position (top)
     */
    var beraknaAbsolutTopPosition = function (element) {
        var topPosition = 0;
        do {
            topPosition += element.offsetTop || 0;
            element = element.offsetParent;
        } while (element);

        return topPosition;
    };

    /**
     * Detektera position på menyn och fäst den till toppen av sidan vid scrollning nedåt.
     */
    var hanteraMenyPositionVidScrollning = function () {
        if (document.body.scrollTop > window.meny.ursprungligMenyPosition) {
            var menyhojd = window.meny.element.offsetHeight + "px";
            window.meny.yttreelement.style.height = menyhojd;
            window.meny.yttreelement.style.minHeight = menyhojd;

            window.meny.element.className = "navigeringbehallare navigeringbehallarefast";

        } else if (document.body.scrollTop < window.meny.ursprungligMenyPosition) {
            window.meny.element.className = "navigeringbehallare";
            window.meny.yttreelement.style.height = "";
            window.meny.yttreelement.style.minHeight = "";
        }
    }

    /**
     * Spara data som används under hela web-sidans livslängd
     */
    var sparaUtgangsvarden = function () {
        window.meny.element = document.getElementById("navigeringbehallare");
        window.meny.yttreelement = document.getElementById("yttrenavigeringbehallare");
        window.meny.ursprungligMenyPosition = beraknaAbsolutTopPosition(window.meny.yttreelement);
    }

    /* Spara utgångsvärden då sidan laddas */
    window.addEventListener("load", sparaUtgangsvarden);

    /* Uppdatera utgångsvärden då fönsterstorlek ändras */
    window.addEventListener("resize", sparaUtgangsvarden);

    /* Lyssna på scroll event och anpassa positionen av menyn */
    window.addEventListener("scroll", hanteraMenyPositionVidScrollning);


})(window.meny = window.meny || {});

    /*
     AJAX är en akronym som står för Asynchronous Javascript and XML.
     
     Det är en samling teknologier som tillsammans används för att
     bygga webapplikationer som kan levera data mellan klient
     och server i en webapplikation. AJAX möjliggör att data 
     uppdateras på klientsidan utan att web-sidan behöver laddas om från
     servern. Dataöverföring kan även initieras från serversidan.
     Teknologierna som AJAX bygger på är JavaScript samt de APIer som
     web-läsaren tillhandahåller, främst XMLHttpRequest samt HTML DOM.
    
     DOM eller Document Object Model
    
     DOM är en träd struktur där HTML-elementen på en web-sida representeras med objekt.
     Modellen går att accessa via API i t.ex. Javascript och det går också att ändra
     modellen via APIt. 


     Väderpresentation är implementerad genom att hämta data via XMLHTTPRequest
     och uppdatera web-sidans html dynamiskt via JavaScript (denna fil). Detta
     görs via DOM.
    */