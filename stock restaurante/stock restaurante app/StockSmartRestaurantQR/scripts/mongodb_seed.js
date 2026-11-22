const database = db.getSiblingDB("StockSmartRestaurantQR_Auth");
database.Users.createIndex({ Username: 1 }, { unique: true });
print("Colección Users preparada. Los usuarios y hashes BCrypt se crean desde BootstrapUsers en appsettings.json.");
