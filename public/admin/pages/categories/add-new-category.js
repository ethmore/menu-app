const form = document.getElementById("form");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name");
    const files = document.getElementById("files");
    const formData = new FormData();

    formData.append("name", name.value);
    formData.append("files", files.files[0]);

    fetch("/newCategoryEntry", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => {
            if (data.status === "OK") {
                // alert(data.message)
                document.getElementById("info").innerText = data.message
                name.value = null
                files.files[0] = null
                files.value = null
            } else {
                document.getElementById("info").innerText = data.message
            }
        })
        .catch((err) => ("Error occured", err));
}
