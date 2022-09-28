$(document).ready(function () {
    $.post('/getCategories', function (table) {
        table = JSON.stringify(table);
        getCategories(table);

        let url = window.location.href.split("/");
        let ID = url.length - 1
        $.post("/getProduct", { id: url[ID] }, function (productData) {
            fillProductData(productData);
            document.getElementById("productCategory").value = productData.category;
        });
    });
});

function getCategories(data) {
    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {
        if (!document.getElementById(data[i])) {
            const table = document.getElementById("productCategory")
            const option = document.createElement("option");
            option.value = data[i].name;
            option.innerText = data[i].name;

            table.appendChild(option);
        }
    }
}

function fillProductData(productData) {
    document.getElementById("productPhoto").src = productData.imagePath;
    document.getElementById("productName").value = productData.name;
    document.getElementById("price").value = productData.price;
    document.getElementById("productCategory").value = productData.category;
    document.getElementById("productContent").value = productData.content;
}

const form = document.getElementById("editProductForm");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    let url = window.location.href.split("/");
    let ID = url.length - 1

    const productName = document.getElementById("productName");
    const price = document.getElementById("price");
    const productCategory = document.getElementById("productCategory");
    const productContent = document.getElementById("productContent");
    const productMedia = document.getElementById("productMedia");

    const formData = new FormData();
    formData.append("id", url[ID]);
    formData.append("productName", productName.value);
    formData.append("price", price.value);
    formData.append("productCategory", productCategory.value);
    formData.append("productContent", productContent.value);
    formData.append("files", productMedia.files[0]);

    fetch("/productUpdate", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => {

            if (data.status === "OK") {
                document.getElementById("info").innerText = data.message

            } else if (data.status === "OK-2") {
                document.getElementById("info").innerText = data.message
                document.getElementById("productPhoto").src = data.mediaPath

            } else {
                document.getElementById("info").innerText = "Try again later"
            }
        })
        .catch((err) => ("Error occured", err));
}


let deleteConfirm = 0;
$("#deleteProduct").click(function () {
    if (deleteConfirm === 0) {
        deleteConfirm = 1
        document.getElementById("info").innerText = ("Click again to 'DELETE' button to delete product")
    } else if (deleteConfirm === 1) {
        let url = window.location.href.split("/");
        let ID = url.length - 1
        const formData = new FormData();

        formData.append("id", url[ID]);

        fetch("/deleteProduct", {
            method: 'POST',
            body: formData,
        }).then(response => response.json())
            .then(data => window.location.href = '/admin/products')
            .catch((err) => ("Error occured", err));

        deleteConfirm = 0
        document.getElementById("info").innerText = ("Product Deleted")
        window.history.go(-1)

    } else {
        document.getElementById("info").innerText = ("A problem occured. Please contact with developer team")
    }
});
