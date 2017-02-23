-------------------------STRUCTURE OVERVIEW------------------------------------

Sidan är baserad på en enda html-sida, vilken laddar in olika partials baserat
på när användaren trycker på länkar i sidebaren. 
Environment-variabler används för att kontrollera vilka länkar som är synliga för användaren,
samt vilken partial som är laddad.  

Länkarna till olika views ligger i nav-elementet i index.html. Via angular kopplas 
funktioner till dessa länkar. Dessa funktioner skall i framtiden göra ajax-anrop
till servern innan de byter den partial som visas. 

I index.html finns ett div-html vars tag innehåller Angular-direktivet ng-witch.
Det är detta som används för att byta mellan olika partials. Switch-satsen är
kopplad till environment-variabeln displayPartial. När denna variabel får t.ex.
värdet "register" så kommer register-partialen att visas. 

-------------------------ADD NEW PAGE-------------------------------------------

För att lägga till en ny partial till sidan, följ följande steg:

1. Skapa dess html-fil, lagra den i partials-mappen
2. Skapa ett skript i scripts-mappen som innehåller all logik
   som behövs för att ladda sidan. Detta bör inkludera en funktion
   som hämtar all nödvändig information för sidan från servern.
   För lättläslighet, namnge gärna denna funktion något i stil 
   med loadXPage. För att kunna manipulera Angular-variabler kommer
   ni behöva ta in $scope som ett argument. Se register.js/login.js för 
   användning.
3. Lägg in en ny partial i ng-switch satsen i index.html. 
4. Lägg in en ny länk till denna sida i sidebar-menyn.
   Sätt dess ng-click attribut till något i stil med loadX(). Om denna länk
   inte alltid ska vara synlig, lägg till ett ng-show attribut med passande
   uttryck. 
5. I index.js, se exemplen för hur loadRegister och loadLogin-funktionerna
   kopplas till sina korresponderanda funktioner i register.js/login.js
   för att se hur ni kopplar loadX till korrekt funktion.
6. I slutet av index.js, lägg till controller-kod för er partial.
   detta är kod som kommer köras varje gång som partialen faktiskt
   laddas, vilket sker EFTER att ni har satt displayPartial till
   korresponderande värde. 

