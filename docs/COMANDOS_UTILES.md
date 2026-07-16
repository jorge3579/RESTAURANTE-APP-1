# Comandos Útiles

## Backend

```bash
cd backend
npm install
npm run dev

cd frontend-cliente
npm install
npm start

cd frontend-restaurante
npm install
npm start

docker compose up -d --build
docker compose down

pm2 start backend/src/server.js --name SmartRestaurantQR
pm2 logs SmartRestaurantQR
pm2 restart SmartRestaurantQR
pm2 stop SmartRestaurantQR