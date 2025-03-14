function login() {
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    // Send login data to Flask backend
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `login=${encodeURIComponent(login)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Вхід успішний!");
            window.location.href = "/home";  // Redirect to the home route
        } else {
            document.getElementById("error-message").textContent = data.message;

            // If user is not found, ask if they want to create an account
            if (data.message === "User not found. Please register.") {
                if (confirm("Would you like to create a new account?")) {
                    const newLogin = prompt("Enter desired login:");
                    const newPassword = prompt("Enter desired password:");

                    // Send registration data to backend
                    fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: `login=${encodeURIComponent(newLogin)}&password=${encodeURIComponent(newPassword)}`
                    })
                    .then(response => response.json())
                    .then(regData => {
                        if (regData.success) {
                            alert("Account created successfully! You can now log in.");
                        } else {
                            alert(regData.message);
                        }
                    })
                    .catch(error => console.error('Error:', error));
                }
            }
        }
    })
    .catch(error => console.error('Error:', error));
}
