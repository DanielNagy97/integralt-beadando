# Robotfoci


## Tartalomjegyzék
1. [Csapattagok](#Csapattagok)
2. [Technológiák](#Technológiák)
3. [Projekt futtatása](#Projekt-futtatása)
4. [Az alkalmazás használata](#Az-alkalmazás-használata)
5. [Játék](#Játék)
6. [Üzenetek](#Üzenetek)
7. [Error üzenetek](#Error-üzenetek)


## Csapattagok
- _Molnár Fanni_ - [molnar75](https://github.com/molnar75)
- _Soós Tamás_ - [sot981110](https://github.com/sot981110)
- _Nagy Dániel_ - [DanielNagy97](https://github.com/DanielNagy97)


## Technológiák
- **szerver**: [node.js](https://nodejs.org/en/) (JavaScript)
- **kliens**: [React](https://reactjs.org/) (TypeScript)
- **játék megjelenítése**: [html5 canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- **kommunikáció**: [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) (json)


## Projekt futtatása
### Szerver futtatása:
```
cd server
npm install
node index.js
```
Használt portok:
- express: **3001**
- websocket: **9000**

### Kliens futtatása:
```
cd client-app
npm install
npm start
```
A klienst alkalmazást a [http://localhost:3000/](http://localhost:3000/) címen lehet elérni.

Használt portok:
- cliens-app: **3000**
- websocket: **9000**


## Az alkalmazás használata
Az alkalmazást megnyitva egy zöld (success) toast üzenet tájékoztat minket arról, hogy a szerverhez való csatlakozás sikeres volt és él a kapcsolat. Ha az alkalmazás használata során szürke toast üzenetet kapunk, az azt jelöli, hogy a szerverrel való kapcsolat megszakadt. Ilyen esetben az alkalmazás megpróbálja újból felvenni a kapcsolatot a szerverrel. Ha a szerver helyreáll, úgy automatikusan újracsatlakozik a klines.

A játékosnak ki kell választania az ellenfelét, majd egy név megadásával léphet be a játékba.

Játékmódok:
- AI vs AI
- Player vs AI
- Player vs Player

Jelen verzióban az AI vs AI játékra van lehetősége a felhasználónak.
A játékot elindítva megjelenik a játéktér és a felhasználó végignézheti a két AI játékos küzdelmét.

A játékot bármikor elhagyhatjuk a `Quit Game` gomb megnyomásával, ami a főmenübe irányít bennünket.


## Játék
[Gombfoci hivatalos játékszabály](https://web.archive.org/web/20101007112254/http://www.gombfoci.hu/msz/about/jatekszabaly.htm#)

[Egy szemléltető videó az eredeti játékról](https://www.youtube.com/watch?v=fAWbhupbSSo)

A játékosok felváltva lőnek egy-egy kiválasztott button-nal. Ha a labda az ellenfél kapujába csúszik, pontot szerzünk. Egy meccs időtartama 5 perc. Ezalatt az idő alatt kell a játékosoknak a lehető legtöbb pontot összegyűjteni. A legtöbb pontot szerző játékos nyeri a meccset.

### Buttonok kezdő pozíciója:
```javascript
buttons: [
    {color: "red", id: "0", pos: [70, 250]},
    {color: "red", id: "1", pos: [250, 160]},
    {color: "red", id: "2", pos: [250, 340]},
    {color: "red", id: "3", pos: [430, 70]},
    {color: "red", id: "4", pos: [430, 250]},
    {color: "red", id: "5", pos: [430, 430]},
    {color: "blue", id: "0", pos: [930, 250]},
    {color: "blue", id: "1", pos: [750, 160]},
    {color: "blue", id: "2", pos: [750, 340]},
    {color: "blue", id: "3", pos: [570, 70]},
    {color: "blue", id: "4", pos: [570, 250]},
    {color: "blue", id: "5", pos: [570, 430]},
    {color: "white", id: "-1", pos: [500, 250]}
]
```
Ahol a `white` színű button a labda.

### Méretek:
- **pálya**: 1000px x 500px
- **button átmérő**: 20px
- **labda átmérő**: 10px

### A játék időtartama:
Egy meccs időtartama *5 perc*.

## Üzenetek
A kliens és a szerver websocketen kommunikál egymással a 9000-es porton. Az üzenetek `json` dokumentumok formájában kerülnek továbbításra az alábbi szerkezet szerint:
```json
{
    "type": "broadcast",
    "payload": {
        "foo": "bar"
    }
}
```
Minden üzenetnek rendelkeznie kell `type` üzenet-típusjelölő mezővel, illetve egy `payload` mezővel, amelyben a típushoz megfelelő tartalom szerepel.

| Üzenet típusa | Kliens kérés payload | Szerver válasz payload       |
| :------------ | ------------------ | ------------------------------ |
| _newPlayer_   | `{"name": "test"}` | `{"id": "0"}`                  |
| _leaving_     | `{"id": "0"}`      | -                              |
| _playerList_  | `{"id": "0"}`      | `{"list": ["test1", "test2"]}` |
| _create_      | `{"id": "0", "gameType": "player-vs-ai"}` | `{"gameId": "0"}` | 
| _join_        | `{"id": "0", "gameId": "0"}` | `{"gameType": "ai-vs-ai", "gameState": "buttons": []}` |
| _move_        | `{"id": "0", "gameId: "1", "moveAction": {}}` | `{"playerId": "0", "gameStates": [], "score": {}}` |
| _endGame_     | `{"id": "0", "gameId": "0"}` | `{"id": "0", "gameId": "0", "finalScore": {} }` |


Kiegészítések:

1. _join_ szerver válaszában lévő `buttons`:
```json
"buttons": [
    {"color": "red", "id": "0", "pos": [0, 0]}
]
```

2. _move_ kliens kérésében lévő `moveAction`:
```json
"moveAction": {
    "button": {"color": "red", "id": "1"},
    "direction": [124, 141]
}
```

3. _move_ szerver válaszában lévő `gameStates` (a `buttons` tömb felépítése megegyezik az első kiegészítésben leírtakkal):
```json
"gameStates": [
    {
        "gameState": {
            "buttons": []
        },
        "timestamp": 10
    }
]
```

4. `gameType` lehetséges értékei:
    - `"ai-vs-ai"`
    - `"player-vs-ai"`
    - `"player-vs-player"`

5. A `score` és `finalScore` csupán elnevezésben különbözik. Felépítésük a _move_ és _endGame_ szerver válaszokban:
```json
"score": {
    "red": 1,
    "blue": 3
}
``` 

## Error üzenetek
Error üzeneteket a szerver küldhet a kliensnek.

Példa egy error üzenetre:
```json
{
    "type": "error",
    "payload": {
        "errorId": "1",
        "errorDetails": {
            "name": "test"
        }
    }
}
```
Az error üzenetek `type` típusa minden esetben `"error"`,
a `payload` pedig error üzenetek esetében egy olyan objektum, amelyben az `errorCode` mezőben van jelezve az error kódja, az `errorDetails` mező pedig egyedi objektumokat tartalmaz az error indoklására.

| errorId   | errorDetails          | Leírás                                   |
| :-------: | --------------------- | ---------------------------------------- |
| `"1"`     | `{"name": "test"}`    | _Név már létezik_                        |
| `"2"`     | `{"id": "-1"}`        | _A küldött id nem létezik_               |
| `"3"`     | `{"gameId": "0"}`     | _Az id másik meccshez van hozzárendelve_ |
| `"4"`     | `{"gameId": "0"}`     | _Nincs ilyen meccs_                      |
| `"5"`     | `{"gameType": "pvp"}` | _Nem jó gameType megadva_                |
| `"6"`     | `{"gameId": "0"}`     | _Egy player lelépett_                    |

