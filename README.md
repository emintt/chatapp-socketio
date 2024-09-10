## 1. Chat app/website using Socket.IO

Pääominaisuudet:

- Käyttäjää pyydetään nimi liittyessään huoneeseen. Nimi näkyy käyttäjän viestien vieressä.
- Huoneet:
  - Käyttäjät voivat liittyä tiettyihin huoneisiin, ja viestit näkyvät vain kyseisessä huoneessa.
  - Käyttäjät voivat luoda huoneen.

Taustapalvelin: express, pug template
Huoneet toteutetaan join()-menetelmällä. Viestit lähetetään kaikille huoneessa oleville käyttäjille käyttäen socket.to(room).emit.

Screenshots:
![Add name](/screenshots/add-name.png)
![Create room](/screenshots/create-room.png "create room")
![Room chat name](/screenshots/room-chat.png "2 rooms")
![Disconnect](/screenshots/disconnect.png "one person left the room")

## 2. Namespaces in Socket.IO

Yhdessä socket-palvelimessa voi olla useita namespaces. Ne ovat samankaltaisia kuin reitit (routes) ja mahdollistavat sovelluksen logiikan jakamisen erillisiin osiin. Esimerkiksi voi olla /chat ja /admin namespaces, joissa kummassakin käsitellään eri toiminnot ja käyttäjäryhmät erikseen.

Rooms on namespacesin alikanavia. Se on osaa namespaceksessa.
Namespaces voisi käyttää sovelluksessa sitten, että vain auktorisoitu käyttäjä pääse esimerkiksi admin kanavalle.
