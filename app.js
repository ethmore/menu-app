require("dotenv").config();
require("./app/config/db.config").connect();
const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require('cookie-parser')
const path = require('path');
const fileUpload = require('express-fileupload');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const fs = require('fs')
const webp = require('webp-converter');

const db = require('./db')
const User = require("./app/models/user.model");
const Role = require("./app/models/role.model");
const auth = require("./middleware/auth");

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser())
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


//Page responders
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/home/categories/categories.html'));

})

app.get('/admin', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/admin.html'));
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/user/register/register.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/user/login/login.html'));
})

app.get('/categories/:category', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/home/products/products.html'));
});



//Page responders (Category Related)
app.get('/admin/categories', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/categories/categories.html'));
})

app.get('/admin/categories/add-new', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/categories/add-new-category.html'));
})

app.get('/admin/categories/:edit', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/categories/category-edit.html'));
});

//Request responders (Category Related)
app.post('/getCategories', function (req, res) {
  db.findAll("categories").then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/getCategory', (req, res) => {
  db.findOneID("categories", req.body.id).then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post("/newCategoryEntry", auth, async function (req, res) {
  //Media not provided
  if (!req.files || Object.keys(req.files).length === 0) {
    res.json({ message: "HATA! Görsel dosyasını doğru seçtiğinizden emin olun!" });
    return
  }

  //Media provided but unsupported format
  fileExt = path.extname(req.files.files.name);
  if ((fileExt !== ".jpg") && (fileExt !== ".jpeg") && (fileExt !== ".png") && (fileExt !== ".svg") && (fileExt !== ".bmp")) {
    res.json({ message: "HATA! Desteklenmeyen format! Dosyanın: jpg, jpeg, png, svg veya bmp formatlarından biri olduğuna emin olun" });
    return
  }

  //Media provided
  let file = await uploadConvertDelete(req.files.files);
  let categoryName = req.body.name
  let mediaPath = '/admin/upload/' + file;

  db.insertOneCategory(mediaPath, categoryName).then(function (result) {
    res.json({ status: "OK", message: "Successfully uploaded files" });
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post("/categoryUpdate", auth, async function (req, res) {
  let categoryID = req.body.id;
  let categoryName = req.body.name;

  //Media not provided
  if (!req.files || Object.keys(req.files).length === 0) {
    let mediaPath = "null"

    db.categoryUpdate(categoryID, mediaPath, categoryName).then(function (result) {
      res.json({ status: "OK", message: "Kategori başlığı düzenlendi!" });
    }).catch((err) => setImmediate(() => { throw err; }));

    return
  }

  //Media provided but unsupported format
  fileExt = path.extname(req.files.files.name);
  if ((fileExt !== ".jpg") && (fileExt !== ".jpeg") && (fileExt !== ".png") && (fileExt !== ".svg") && (fileExt !== ".bmp")) {
    res.json({ message: "HATA! Desteklenmeyen format! Dosyanın: jpg, jpeg, png, svg veya bmp formatlarından biri olduğuna emin olun" });
    return
  }

  //Media provided
  let file = await uploadConvertDelete(req.files.files);
  let mediaPath = '/admin/upload/' + file;

  db.categoryUpdate(categoryID, mediaPath, categoryName).then(function (result) {
    res.json({ status: "OK-2", message: "Kategori düzenlendi!", mediaPath: mediaPath});
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/deleteCategory', auth, (req, res) => {
  let ID = req.body.id;
  db.deleteEntry("categories", ID).then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});


//Page responders (Product Related)
app.get('/admin/products', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/products/products.html'));
})

app.get('/admin/products/add-new', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/products/add-product.html'));
})

app.get('/admin/products/:edit', auth, (req, res) => {
  res.sendFile(path.join(__dirname + '/public/admin/pages/products/product-edit.html'));
})

//Request responders (Product Related)
app.post('/getProducts', auth, function (req, res) {
  db.findAll("products").then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/getProduct', auth, (req, res) => {
  db.findOneID("products", req.body.id).then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/getProductsByCategory', (req, res) => {
  db.findOneCategory("products", req.body.category).then(function (result) {

    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/newProductEntry', auth, async (req, res) => {
  //Media not provided
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ message: "HATA! Görsel dosyasını doğru seçtiğinizden emin olun!" });
    return
  }

  //Media provided but unsupported format
  let fileExt = path.extname(req.files.files.name);
  if ((fileExt !== ".jpg") && (fileExt !== ".jpeg") && (fileExt !== ".png") && (fileExt !== ".svg") && (fileExt !== ".bmp")) {
    res.status(400).json({ message: "HATA! Desteklenmeyen format! Dosyanın: jpg, jpeg, png, svg veya bmp formatlarından biri olduğuna emin olun" });
    return
  }

  //Media provided
  let file = await uploadConvertDelete(req.files.files);
  const productMedia = '/admin/upload/' + file;
  const productName = req.body.productName;
  const productCategory = req.body.productCategory;
  const price = req.body.price;
  const productContent = req.body.productContent;

  db.insertProduct(productMedia, productName, productCategory, price, productContent).then(function (result) {
    res.status(200).json({ status: "OK", message: "Ürün Başarıyla Eklendi. Ürün eklemeye devam edebilirsiniz" });
  }).catch((err) => setImmediate(() => { throw err; }));

});

app.post("/productUpdate", auth, async function(req, res){
  let productID = req.body.id;
  let productName = req.body.productName;
  let price = req.body.price;
  let category = req.body.productCategory;
  let content = req.body.productContent;

  //Media not provided
  if (!req.files || Object.keys(req.files).length === 0) {
    let productMedia = "null";

    db.productUpdate(productID, productMedia, productName, category, price, content).then(function (result) {
      res.json({ status: "OK", message: "Ürün bilgileri düzenlendi!" });
    }).catch((err) => setImmediate(() => { throw err; }));

    return
  }

  //Media provided but unsupported format
  fileExt = path.extname(req.files.files.name);
  if ((fileExt !== ".jpg") && (fileExt !== ".jpeg") && (fileExt !== ".png") && (fileExt !== ".svg") && (fileExt !== ".bmp")) {
    res.json({ message: "HATA! Desteklenmeyen format! Dosyanın: jpg, jpeg, png, svg veya bmp formatlarından biri olduğuna emin olun" });
    return
  }

  //Media provided
  let file = await uploadConvertDelete(req.files.files);
  let productMedia = '/admin/upload/' + file;

  db.productUpdate(productID, productMedia, productName, category, price, content).then(function (result) {
    res.json({ status: "OK-2", message: "Ürün bilgileri düzenlendi!", mediaPath: productMedia});
  }).catch((err) => setImmediate(() => { throw err; }));
});

app.post('/deleteProduct', auth, (req, res) => {
  let ID = req.body.id;
  db.deleteEntry("products", ID).then(function (result) {
    res.send(result)
  }).catch((err) => setImmediate(() => { throw err; }));
});

// Register
app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(email && password && firstName && lastName)) {
      res.status(400).send("All input is required - (register)");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedUserPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(), // sanitize
      password: encryptedUserPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "5h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).json("emptyField");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "5h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.cookie("token", user.token);
      res.cookie("email", email);
      return res.status(200).json("success");
    }
    return res.status(400).json("invalid");
  } catch (err) {
    console.log(err);
  }
});

async function uploadConvertDelete(file) {
  let uploadPath = __dirname + '/public/admin/upload/' + file.name;
  //convert
  let bareName = file.name.substring(0, file.name.lastIndexOf('.'));
  let webpName = bareName + ".webp"
  let webpOutputPath = __dirname + '/public/admin/upload/' + webpName

  await file.mv(uploadPath)
  await webp.cwebp(uploadPath, webpOutputPath, "-q 10", logging = "-v");
  fs.unlinkSync(uploadPath);

  return webpName;
}

module.exports = app;






