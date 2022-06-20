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
    document.getElementById('categoryMedia').src = data["imagePath"]
    document.getElementById('categoryName').value = data["name"]
}

const form = document.getElementById("formUpdate");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    let url = window.location.href.split("/");
    let ID = url.length - 1
    const name = document.getElementById("categoryName");
    const files = document.getElementById("photo");
    const formData = new FormData();

    formData.append("id", url[ID]);
    formData.append("name", name.value);
    formData.append("files", files.files[0]);

    fetch("/categoryUpdate", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                document.getElementById("info").innerText = data.message
            } else if (data.status === "OK-2") {
                // window.location.reload()
                document.getElementById("info").innerText = data.message
                document.getElementById("categoryMedia").src = data.mediaPath
            } else {
                document.getElementById("info").innerText = "Bir hata meydana geldi. Daha sonra tekrar deneyin"
            }

        })
        .catch((err) => ("Error occured", err));
}

let deleteConfirm = 0;
$("#deleteCategory").click(function () {
    if (deleteConfirm === 0) {
        deleteConfirm = 1
        document.getElementById("info").innerText = "Bu kategoriyi ve kategoriye ait tüm ürünleri silmek istediğinize emin misiniz? Onaylamak için tekrar 'Kategoriyi Sil' butonuna tıklayınız"
    } else if (deleteConfirm === 1) {
        let url = window.location.href.split("/");
        let ID = url.length - 1
        const formData = new FormData();

        formData.append("id", url[ID]);

        fetch("/deleteCategory", {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => window.location.href = '/admin/categories')
            .catch((err) => ("Error occured", err));

        deleteConfirm = 0
        document.getElementById("info").innerText = ("Kategori ve kategoriye ait ürünler silindi")
        window.location.href = '/admin/categories';

    } else {
        document.getElementById("info").innerText = ("Sistemde bir arıza oluştu destek ekibi ile iletişime geçiniz")
    }

});

function getProductsByCate(data) {
    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {

        if (!document.getElementById(data[i])) {

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