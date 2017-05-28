(function (environment) {
    'use strict';

    /**
     * Hämtar en textbeskrivning av molnighet från ett numeriskt värde 0 - 8.
     * 
     * 0 = Helt klar himmel, 8 = himmlen fullt täckt av moln.
     */
    environment.getMolnbeskrivning = function getMolnbeskrivning(molnighet) {
        if (molnighet === 0) {
            return "Klart";
        } else if (molnighet < 5) {
            return "Växlande molnighet";
        } else if (molnighet >= 5) {
            return "Mulet";
        }

        return molnighet;
    };

    /**
     * Hämtar värdet på en specifik väderparametrar från SMHIs väderdata i JSON-format
     */
    environment.getVaderParameterVarde = function getVaderParameterVarde(propertyname, propertyvalue, parameterarray) {
        if (parameterarray) {
            var element;
            for (element of parameterarray) {
                if (element[propertyname] === propertyvalue) {
                    return element.values[0];
                }
            }
        }

        return undefined;
    };

    /**
     * Hämtar alla väderparametrar för en bestämd tidpunkt från SMHIs väderdata i JSON-format
     */
    environment.getVaderParametrarForKlockslag = function getVaderParametrarForKlockslag(klockslag, vaderdata) {
        var element;
        for (element of vaderdata['timeSeries']) {
            if (Date.parse(element['validTime']) === klockslag) {
                return element['parameters'];
            }
        }

        return undefined;
    }

    /**
     * Skapar en tabellrad för presentation av väderdata.
     */
    environment.skapaVaderPresentation = function skapaVaderPresentation(klockslag, parametrar) {
        var temperatur = environment.getVaderParameterVarde('name', 't', parametrar) || "-";
        var vindriktning = environment.getVaderParameterVarde('name', 'wd', parametrar) || "0";
        var vindstyrka = environment.getVaderParameterVarde('name', 'ws', parametrar) || "-";
        var molnighet = environment.getVaderParameterVarde('name', 'tcc_mean', parametrar) || "-";

        var vaderbeskrivning =
            "<tr>" +
            "<td>" + new Date(klockslag).getHours() + "</td>" +
            "<td>" + temperatur + "</td>" +
            "<td>" +
            "<style scoped=\"scoped\">" +
            ".vader__vind { float: left }" +
            ".vader__vindriktning { transform: rotate(" + vindriktning + "deg);}" +
            "</style>" +
            "<div class=\"vader__vind\">" +
            "<div class=\"vader__vindriktning\">" +
            "<img src=\"../images/arrow-up.png\"/>" +
            "</div>" +
            "</div>" +
            " (" + vindstyrka + ")" +
            "</td>" +
            "<td>" + environment.getMolnbeskrivning(molnighet) + "</td>" +
            "</tr>";

        return vaderbeskrivning;
    }

    /**
     * Funktion som bygger hela komponenten och placerar in den i DOM.
     */
    var init = function () {
        // Get element by ID

        // Skapa ett request-objekt och definiera en funktion som tar hand om resultat när det finns tillgängligt
        var req = new XMLHttpRequest();
        req.onreadystatechange = function () {
            // Hämta ut elementet ifrån DOM där väderpresentation skall läggas till
            var vaderbehallare = document.getElementById("vaderkomponent");

            if (this.readyState == 4 && this.status == 200) {
                // Bygg ett JSON-objekt av väderdatat från servern
                var vaderdata = JSON.parse(req.responseText);

                var now = Date.now();

                // Idag - tidpunkter
                var morgon = new Date(now).setHours(6, 0, 0, 0);
                var middag = new Date(morgon).setHours(12, 0, 0, 0);
                var kvall = new Date(morgon).setHours(18, 0, 0, 0);
                // Imorgon - tidpunkter
                var imorgonMorgon = new Date(morgon).setHours(new Date(morgon).getHours() + 24, 0, 0, 0);
                var imorgonMiddag = new Date(middag).setHours(new Date(middag).getHours() + 24, 0, 0, 0);
                var imorgonKvall = new Date(kvall).setHours(new Date(kvall).getHours() + 24, 0, 0, 0);

                // Idag - väderparametrar
                var morgonparametrar = environment.getVaderParametrarForKlockslag(morgon, vaderdata);
                var middagparametrar = environment.getVaderParametrarForKlockslag(middag, vaderdata);
                var kvallparametrar = environment.getVaderParametrarForKlockslag(kvall, vaderdata);
                // Imorgon - väderparametrar
                var imorgonMorgonparametrar = environment.getVaderParametrarForKlockslag(imorgonMorgon, vaderdata);
                var imorgonMiddagparametrar = environment.getVaderParametrarForKlockslag(imorgonMiddag, vaderdata);
                var imorgonKvallparametrar = environment.getVaderParametrarForKlockslag(imorgonKvall, vaderdata);

                /*
                Konstruktion av HTML (och CSS) för väderpresentation.

                Jag tolkade instruktionerna så att allt skulle ingå i komponenten, även CSS.
                */

                var vaderrubrik = "<h1>Väder</h1>";

                var vaderbeskrivningIdag =
                    "<div>" +
                    "<style scoped=\"scoped\">" +
                    ".vader__tabell tr, .vader__tabell td, .vader__tabell th {border: solid 1px #cdc9c5; padding: 5px; text-align: left;}" +
                    ".vader__tabell th {border: solid 2px #cdc9c5;font-weight: bold;}" +
                    "</style>" +
                    "<h2>Idag</h2>" +
                    "<table class=\"vader__tabell\">" +
                    "<tr><th>Klockan</th><th>Temperatur</th><th>Vind</th><th>Himmel</th></tr>" +
                    environment.skapaVaderPresentation(morgon, morgonparametrar) +
                    environment.skapaVaderPresentation(middag, middagparametrar) +
                    environment.skapaVaderPresentation(kvall, kvallparametrar) +
                    "</table>" +
                    "</div>";


                var vaderbeskrivningImorgon =
                    "<div>" +
                    "<style scoped=\"scoped\">" +
                    ".vader__tabell tr, .vader__tabell td, .vader__tabell th {border: solid 1px #cdc9c5; padding: 5px; text-align: left;}" +
                    ".vader__tabell th {border: solid 2px #cdc9c5;font-weight: bold;}" +
                    "</style>" +
                    "<h2>Imorgon</h2>" +
                    "<table class=\"vader__tabell\">" +
                    "<tr><th>Klockan</th><th>Temperatur</th><th>Vind</th><th>Himmel</th></tr>" +
                    environment.skapaVaderPresentation(imorgonMorgon, imorgonMorgonparametrar) +
                    environment.skapaVaderPresentation(imorgonMiddag, imorgonMiddagparametrar) +
                    environment.skapaVaderPresentation(imorgonKvall, imorgonKvallparametrar) +
                    "</table>" +
                    "</div>";

                // Lägg in den skapade väderpresentationen i DOM
                vaderbehallare.innerHTML = vaderrubrik + vaderbeskrivningIdag + vaderbeskrivningImorgon;
            }
        };

        // Läs väderdata asynkront
        req.open("GET", "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/18.1489/lat/57.3081/data.json", true);
        req.send();
    };

    // Starta kontruktion av komponenten
    init();

})(window.vader = window.vader || {});

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
