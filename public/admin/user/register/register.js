const form = document.getElementById("registerForm");
form.addEventListener("submit", submitForm);

function submitForm(e){
    e.preventDefault();

    const firstName = document.getElementById("fName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("pass");

    const formData = new FormData();

    formData.append("firstName", firstName.value);
    formData.append("lastName", lastName.value);
    formData.append("email", email.value);
    formData.append("password", password.value);

    fetch("/register", {
        method: 'POST',
        body: formData,
    }).then(response => response.json())
        .then(data => window.location.href = "/admin")
        .catch((err) => ("Error occured", err));
}
