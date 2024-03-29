$(document).ready(function () {
    $.post('/getCategories', function (table) {
        table = JSON.stringify(table);
        getCategories(table);
    });
});

function getCategories(data){
    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++){
        if(!document.getElementById(data[i])){
            const category = document.createElement("a");
            const image = document.createElement("img");
            const categoryName = document.createElement("h4");
            
            category.id = data[i]._id;
            category.className = "category-item";
            category.href = "/admin/categories/" + data[i]._id;

            image.src = data[i].imagePath;
            image.className = "category-img";

            categoryName.innerText = data[i].name;

            category.appendChild(image);
            category.appendChild(categoryName);
            document.getElementById("categories").appendChild(category);
        }
    }

    const addCategory = document.createElement("a");
    const addCategoryImg = document.createElement("img");
    const addCategoryText = document.createElement("h3");

    addCategory.id = "add-category";
    addCategory.href = "/admin/categories/add-new";
    addCategoryImg.src = "/media/add-circle-outline.svg"
    addCategoryImg.alt = "+"
    addCategoryText.innerText = "New Category"

    addCategory.appendChild(addCategoryImg);
    addCategory.appendChild(addCategoryText);

    document.getElementById("categories").appendChild(addCategory);
}
