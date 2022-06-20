const form = document.getElementById("loginForm");
form.addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();
    const eMail = document.getElementById("email");
    const password = document.getElementById("password");
    const formData = new FormData();

    formData.append("email", eMail.value);
    formData.append("password", password.value);

    /*  fetch("/login", {
         method: 'POST',
         body: formData,
     }).then(response => response.json())
         .then(data => console.log("data"))
         .catch((err) => ("Error occured", err)); */
    fetch("/login", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => {
            if (data === "emptyField") {
                document.getElementById("info").innerText = "Boş alan bırakılamaz"

            } else if (data === "success") {
                document.getElementById("info").innerText = "Başarıyla giriş yapıldı"
                window.location.reload()
            } else if (data === "invalid") {
                document.getElementById("info").innerText = "Girdiğiniz bilgilerden bir ya da birkaçı yanlış"
            }
        })
        .catch((err) => ("Error occured", err));
}
