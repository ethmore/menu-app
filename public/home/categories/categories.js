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
            const category = document.createElement("a");
            const image = document.createElement("img");
            const categoryName = document.createElement("h4");
            // const editButton = document.createElement("a");

            category.id = data[i]._id;
            category.className = "category-item";
            category.href = "/categories/" + data[i]._id;

            image.src = data[i].imagePath;
            image.className = "category-img";

            categoryName.innerText = data[i].name;

            category.appendChild(image);
            category.appendChild(categoryName);

            document.getElementById("categories").appendChild(category);
        }
    }
}
