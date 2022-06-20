var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectId;

//Globals
async function findAll(collection) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("qr-db");
            dbo.collection(collection).find({}).toArray(function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

async function findOneID(collection, ID) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db("qr-db");
            const query = { "_id": ObjectId(ID) };
            dbo.collection(collection).findOne(query, function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

async function findOneCategory(collection, category) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            var dbo = db.db("qr-db");
            const query = { "category": category };
            dbo.collection(collection).find(query).toArray(function (err, result) {
                if (err) return reject(err);
                db.close();

                resolve(result);
            });
        });
    });
}

async function deleteEntry(collection, ID) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            if (collection === "categories") {

                var dbo = db.db("qr-db");

                const filter = { "_id": ObjectId(ID) };
                dbo.collection("categories").findOne(filter, function (fErr, fResult) {
                    if (fErr) return reject(fErr);
                    var categoryName = fResult.name;

                    dbo.collection("products").deleteMany({ category: categoryName }), function (faErr, faResult) {
                        if (faErr) return reject(faErr);
                        console.log(faResult)
                    };
                });

                dbo.collection(collection).deleteOne(filter, function (err, result) {
                    if (err) return reject(err);
                    db.close();
                    resolve(result);
                });

                return;
            }

            dbo.collection(collection).deleteOne(filter, function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

//Category Related
async function insertOneCategory(mediaPath, categoryName) {
    MongoClient.connect(url, function (err, db) {
        const doc = {
            name: categoryName,
            imagePath: mediaPath,
        }
        if (err) throw err;
        var dbo = db.db("qr-db");
        dbo.collection("categories").insertOne(doc, function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
}

async function categoryUpdate(categoryID, mediaPath, categoryName) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("qr-db")
            const filter = { "_id": ObjectId(categoryID) };
            let updateDoc;
            if (mediaPath === "null") {
                updateDoc = {
                    $set: {
                        name: categoryName
                    },
                };
            } else {
                updateDoc = {
                    $set: {
                        imagePath: mediaPath,
                        name: categoryName
                    },
                };
            }
            dbo.collection("categories").updateOne(filter, updateDoc, function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

//Product Related
async function insertProduct(productMedia, productName, productCategory, price, productContent) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("qr-db");

            const doc = {
                name: productName,
                imagePath: productMedia,
                category: productCategory,
                price: price,
                content: productContent,
            }
            dbo.collection("products").insertOne(doc, function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

async function productUpdate(productID, productMedia, productName, productCategory, productPrice, productContent) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("qr-db")
            const filter = { "_id": ObjectId(productID) };
            let updateDoc
            if (productMedia === "null") {
                updateDoc = {
                    $set: {
                        name: productName,
                        category: productCategory,
                        price: productPrice,
                        content: productContent,
                    },
                };
            } else {
                updateDoc = {
                    $set: {
                        imagePath: productMedia,
                        name: productName,
                        category: productCategory,
                        price: productPrice,
                        content: productContent,
                    },
                };
            }

            dbo.collection("products").updateOne(filter, updateDoc, function (err, result) {
                if (err) return reject(err);
                db.close();
                resolve(result);
            });
        });
    });
}

//Test
async function createCollection(collName) {
    try {
        await client.connect();
        const database = client.db("qr-db");

        await database.createCollection(collName);

    } finally {
        await client.close();
    }
}
// createCollection("products").catch(console.dir);

module.exports = { insertOneCategory, findAll, findOneID, categoryUpdate, deleteEntry, insertProduct, productUpdate, findOneCategory };
