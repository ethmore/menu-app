$(document).ready(function () {
    //Get Categories
    $.post('/getCategories', function (table) {
        table = JSON.stringify(table);
        getCategories(table);
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

const form = document.getElementById("newProductForm");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    const productName = document.getElementById("productName");
    const price = document.getElementById("price");
    const productCategory = document.getElementById("productCategory");
    const productContent = document.getElementById("productContent");
    const productMedia = document.getElementById("productMedia");

    const formData = new FormData();
    formData.append("productName", productName.value);
    formData.append("price", price.value);
    formData.append("productCategory", productCategory.value);
    formData.append("productContent", productContent.value);
    formData.append("files", productMedia.files[0]);

    fetch("/newProductEntry", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => {
            if(data.status === "OK"){
                document.getElementById("info").innerText = data.message
                productName.value = null
                price.value = null
                productCategory.value = "disabled"
                productContent.value = null
                productMedia.files[0] = null
                productMedia.value = null
            }else {
                document.getElementById("info").innerText = data.message
            }
        })
        .catch((err) => ("Error occured", err));
}
/* 
const fileInput = document.getElementById("productMedia");
fileInput.addEventListener("change", fileFunc);

function fileFunc(e){
    e.preventDefault();
    let fileName = fileInput.value.substring(fileInput.value.lastIndexOf('\\') + 1);
    document.getElementById("infor").innerText = fileName
} */