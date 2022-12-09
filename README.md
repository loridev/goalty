# Goalty
## What is Goalty?
Goalty is an application that aims to centralize goal-based loyalty cards (ex: Buy 10 coffees for a free one) in a single app. This is made via NFC tags linked to the application users.
## Why Goalty?
- All loyalty cards in a single place
- Safer for companies (harder to cheat than carton cards)
- Works like contactless payments (familiar to everyone)
## The Tech Stack
### Frontend
- [React Native](https://reactnative.dev) - Mobile application
- [Google Maps API](https://developers.google.com/maps) - API to display maps and locations
- [Socket.io](https://socket.io/) - Low-latency webSocket communication for messaging
### Backend
- [NodeJS](https://nodejs.org/)
- [Express](https://expressjs.com/) - NodeJS backend framework
- [PostgreSQL](https://www.postgresql.org/) - Relational Database
- [Prisma](https://www.prisma.io/) - ORM
## Getting started
**Quick note**: This app does NOT work in iOS devices
### Frontend
#### Installing dependencies
```bash
npm i
```
#### Running the application (an android device has to be connected via USB, the android studio emulator won't work because it has no NFC hardware)
```bash
npm run android
```
*The app can take up to 5 minutes to build since it has to compile JavaScript code into native*
### Backend
#### Environment variables
- **SERVER_PORT:** The port the server will run in
- **DATABASE_URL:** The connection URL for the database
- **TOKEN_KEY:** The key that will be used to encrypt the tokens
#### Installing dependencies
```bash
npm i
```
#### Running the application
```bash
npm run dev
```
Your server by default should be running in [http://localhost:[ENV-PORT]/]
