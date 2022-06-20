$(document).ready(function () {
    let url = window.location.href.split("/");
    let ID = url.length - 1
    $.post("/getCategory", { id: url[ID] }, function (categoryData) {
        getCategory(categoryData);

        let categoryHTML = document.getElementById('categoryNameHeader').innerText;
        $.post("/getProductsByCategory", { category: categoryHTML }, function (categoryData) {
            table = JSON.stringify(categoryData);
            getProductsByCate(table);
        });
    });
});


function getCategory(data) {
    document.getElementById('categoryNameHeader').innerText = data["name"]
    // document.getElementById('categoryMedia').src = data["imagePath"]

    let a = document.getElementById('background')
    a.style.backgroundImage = "url(" + data["imagePath"] + ")"

}

/* 
function getProductsByCate(data) {
    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {

        if (!document.getElementById(data[i])) {

            const product = document.createElement("li");

            const image = document.createElement("img");
            const productName = document.createElement("p");
            const price = document.createElement("p");
            const content = document.createElement("p");
            const info = document.createElement("div");

            const editButton = document.createElement("a");

            product.id = data[i]._id;
            product.className = "product-item";

            info.className = "productInfo"

            image.src = data[i].imagePath;
            image.className = "product-img";

            productName.innerText = data[i].name;
            productName.className = "productName"

            price.innerText = data[i].price + "₺";
            price.className = "price"

            content.innerText = data[i].content
            content.className = "content"

            editButton.href = "/admin/products/" + data[i]._id;
            // editButton.innerText = "Düzenle";
            editButton.className = "editButton";

            info.appendChild(productName);
            info.appendChild(content);
            info.appendChild(price);


            product.appendChild(image);
            product.appendChild(info);
            product.appendChild(editButton);


            document.getElementById("products").appendChild(product);
        }
    }
} */


function getProductsByCate(data) {
    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {

        if (!document.getElementById(data[i])) {

            const product = document.createElement("li");

            const image = document.createElement("img");
            const productName = document.createElement("p");
            const price = document.createElement("p");
            const content = document.createElement("p");
            const info = document.createElement("div");

            product.id = data[i]._id;
            product.className = "product-item";

            info.className = "productInfo"

            image.src = data[i].imagePath;
            image.className = "product-img";

            productName.innerText = data[i].name;
            productName.className = "productName"

            price.innerText = data[i].price + "₺";
            price.className = "price"

            content.innerText = data[i].content
            content.className = "content"

            info.appendChild(productName);
            info.appendChild(content);
            info.appendChild(price);


            product.appendChild(image);
            product.appendChild(info);

            document.getElementById("products").appendChild(product);
        }
    }
}