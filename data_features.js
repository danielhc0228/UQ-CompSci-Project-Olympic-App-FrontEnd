const API_BASE_URL = 'https://deco3801-developersx4.uqcloud.net/api';

async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

async function submitRegistration() {
    try {
        const email = document.querySelector('input[name="uname"]').value;
        const password = document.querySelector('input[name="psw"]').value;
        const data = { email, password };

        console.log('Sending registration data:', data);
        const response = await postData(`${API_BASE_URL}/users/register`, data);

        if (response.status === 200) {
            alert('Registration successful! Redirecting to login page...');
            window.location.href = 'login.html';
        } else {
            throw new Error(await response.text());
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed!');
    }
}

async function loginUser() {
    try {
        const email = document.querySelector('input[name="uname"]').value;
        const password = document.querySelector('input[name="psw"]').value;
        const data = { email, password };

        console.log('Sending login data:', data);
        const response = await postData(`${API_BASE_URL}/users/login`, data);

        if (response.status === 200) {
            alert('Login successful! Redirecting to Profile page...');
            
            localStorage.clear();
            localStorage.setItem('userEmail', email);

            window.location.href = 'profile.html';
        } else {
            throw new Error(await response.text());
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Login failed! Please check your credentials.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');

    // Check if we are on the registration or login page
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });

        // Check if the user is already logged in
        const userEmail = localStorage.getItem('userEmail');
        if (userEmail) {
            // User is already logged in, redirect to profile page
            window.location.href = 'profile.html';
            return; // Important to exit the function here to prevent further code execution
        }
    }

    // Check if we are on the Profile page
    const inputUserName = document.getElementById('inputUserName');
    const inputUserAccount = document.getElementById('inputUserAccount');

    if (inputUserName && inputUserAccount) {
        const userEmail = localStorage.getItem('userEmail');
        console.log('User email from localStorage:', userEmail);

        if (!userEmail) {
            alert('Please login first!');
            window.location.href = 'login.html';
            return;
        }

        inputUserName.value = userEmail;

        fetch(`${API_BASE_URL}/users/getUserByEmail?email=${userEmail}`)
        .then(response => {
            console.log('API response:', response);
            return response.json();
        })
        .then(data => {
            console.log('User data from API:', data);
            if (data && data.user_id) {
                inputUserAccount.value = data.user_id;
                // Update the UserID in the sidenav
                const userIdHeader = document.getElementById('userid');
                if (userIdHeader) {
                    userIdHeader.textContent = "User ID: " + data.user_id;
                }
            } else {
                console.error('Failed to fetch user ID from the server.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const logoutButton = document.getElementById('logoutLink');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.clear();
            alert('Logged out successfully!');
            window.location.href = 'signin.html';
        });
    }
});




