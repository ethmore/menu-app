$(document).ready(function () {
    //Get Products


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
            // editButton.innerText = "Düzenle";
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
/**$(document).ready(function () {
    //Get Products
    $.get('/getProducts', function (table) {
        table = JSON.stringify(table);
        getProducts(table);
    });

});

function getProducts(data){
    data = JSON.parse(data);
    
    for (var i = 0; i < data.length; i++){
        if(!document.getElementById(data[i])){
            const product = document.createElement("div");
            const productGroup_1 = document.createElement("div");
            const productGroup_2 = document.createElement("div");
            const productGroup_3 = document.createElement("div");
            const productGroup_4 = document.createElement("div");

            const image = document.createElement("img");
            const productName = document.createElement("h4");
            const price = document.createElement("h4");
            const category = document.createElement("h6");
            const content = document.createElement("p");

            const editButton = document.createElement("a");
            
            product.id = data[i]._id;
            product.className = "product-item";
            productGroup_1.className = "product-group";
            productGroup_2.className = "product-group";
            productGroup_3.className = "product-group";
            productGroup_4.className = "product-group";


            image.src = data[i].imagePath;
            image.className = "product-img";

            productName.innerText = data[i].name;

            category.innerText = data[i].category;
            price.innerText = data[i].price + "₺";
            content.innerText = data[i].content

            editButton.href = "/admin/products/" + data[i]._id;
            editButton.innerText = "Düzenle";

            productGroup_1.appendChild(image);
            productGroup_2.appendChild(productName);
            productGroup_2.appendChild(price);
            productGroup_3.appendChild(content);
            productGroup_4.appendChild(category);
            productGroup_4.appendChild(editButton);
            product.appendChild(productGroup_1);
            product.appendChild(productGroup_2);
            product.appendChild(productGroup_3);
            product.appendChild(productGroup_4);


            document.getElementById("products").appendChild(product);
        }
    }
}
 */