$(document).ready(function () {
    $.post('/getProducts', function (table) {
        table = JSON.stringify(table);
        getProducts(table);
    });
});

function getProducts(data){
    data = JSON.parse(data);
    
    for (var i = 0; i < data.length; i++){
        if(!document.getElementById(data[i])){
            const product = document.createElement("li");

            const image = document.createElement("img");
            const productName = document.createElement("p");
            const price = document.createElement("p");
            const category = document.createElement("p");
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

            category.innerText = data[i].category;
            category.className = "category"

            price.innerText = data[i].price + "₺";
            price.className = "price"

            content.innerText = data[i].content
            content.className = "content"

            editButton.href = "/admin/products/" + data[i]._id;
            editButton.className = "editButton";

            info.appendChild(productName);
            info.appendChild(price);
            info.appendChild(content);
            info.appendChild(category);

            product.appendChild(image);
            product.appendChild(info);
            product.appendChild(editButton);


            document.getElementById("products").appendChild(product);
        }
    }
}
