// Initialize local storage for users if it doesn't exist
        if(!localStorage.getItem('gymUsers')) {
            localStorage.setItem('gymUsers', JSON.stringify([]));
        }
        
        // Generate bubbles for background
        function createBubbles() {
            const bubbles = document.querySelector('.bg-bubbles');
            for (let i = 0; i < 15; i++) {
                const li = document.createElement('li');
                li.style.left = Math.random() * 100 + '%';
                li.style.width = Math.random() * 100 + 20 + 'px';
                li.style.height = li.style.width;
                li.style.animationDelay = Math.random() * 20 + 's';
                li.style.animationDuration = Math.random() * 20 + 10 + 's';
                bubbles.appendChild(li);
            }
        }
        
        createBubbles();
        
        function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            toast.innerHTML = type === 'success' 
                ? `<i class="fas fa-check-circle"></i> ${message}`
                : `<i class="fas fa-exclamation-circle"></i> ${message}`;
            toast.className = `toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
        
        function showRegister() {
            document.getElementById("loginContainer").style.display = "none";
            document.getElementById("registerContainer").style.display = "block";
        }
        
        function showLogin() {
            document.getElementById("registerContainer").style.display = "none";
            document.getElementById("loginContainer").style.display = "block";
        }
        
        function validateUsername() {
            const username = document.getElementById("regUsername").value;
            const errorElement = document.getElementById("regUsernameError");
            
            if (username.length === 0) {
                errorElement.textContent = "";
                errorElement.classList.remove("show", "valid");
                return false;
            }
            
            // Username must be 4-20 chars, contain letters, numbers, and special chars
            const hasNumber = /[0-9]/.test(username);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(username);
            const isValidLength = username.length >= 4 && username.length <= 20;
            
            if (!isValidLength) {
                errorElement.textContent = "Username must be 4-20 characters";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
                return false;
            }
            
            if (!hasNumber || !hasSpecialChar) {
                errorElement.textContent = "Username must contain numbers and special chars";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
                return false;
            }
            
            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('gymUsers'));
            const usernameExists = users.some(user => user.username === username);
            
            if (usernameExists) {
                errorElement.textContent = "Username already exists";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
                return false;
            }
            
            errorElement.textContent = "Username is valid!";
            errorElement.classList.add("show", "valid");
            return true;
        }
        
        function validateEmailField(fieldId, errorId) {
            const email = document.getElementById(fieldId).value;
            const errorElement = document.getElementById(errorId);
            
            if (email.length === 0) {
                errorElement.textContent = "";
                errorElement.classList.remove("show", "valid");
                return false;
            }
            
            const isValid = validateEmail(email);
            
            if (!isValid) {
                errorElement.textContent = "Please enter a valid email address";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
                return false;
            }
            
            // For registration, check if email already exists
            if (fieldId === 'regEmail') {
                const users = JSON.parse(localStorage.getItem('gymUsers'));
                const emailExists = users.some(user => user.email === email);
                
                if (emailExists) {
                    errorElement.textContent = "Email already registered";
                    errorElement.classList.add("show");
                    errorElement.classList.remove("valid");
                    return false;
                }
            }
            
            errorElement.textContent = "Email is valid!";
            errorElement.classList.add("show", "valid");
            return true;
        }
        
        function checkPasswordStrength() {
            const password = document.getElementById("regPassword").value;
            const strengthBar = document.getElementById("strengthBar");
            const errorElement = document.getElementById("regPasswordError");
            let strength = 0;
            
            if (password.length === 0) {
                strengthBar.style.width = "0%";
                errorElement.textContent = "";
                errorElement.classList.remove("show", "valid");
                return false;
            }
            
            // Criteria
            const hasUpperCase = /[A-Z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            const isValidLength = password.length >= 8;
            
            if (password.length > 0) strength += 20;
            if (isValidLength) strength += 20;
            if (hasUpperCase) strength += 20;
            if (hasNumber) strength += 20;
            if (hasSpecialChar) strength += 20;
            
            strengthBar.style.width = strength + '%';
            
            if (strength < 40) {
                strengthBar.style.background = '#ff4757';
                errorElement.textContent = "Password is weak";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
            } else if (strength < 80) {
                strengthBar.style.background = '#ffa502';
                errorElement.textContent = "Password is moderate";
                errorElement.classList.add("show");
                errorElement.classList.remove("valid");
            } else {
                strengthBar.style.background = '#2ed573';
                errorElement.textContent = "Password is strong!";
                errorElement.classList.add("show", "valid");
            }
            
            return strength >= 80;
        }
        
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function login() {
            let email = document.getElementById("loginEmail").value;
            let password = document.getElementById("loginPassword").value;
            let isValid = true;
            
            // Validate email
            if (!validateEmail(email)) {
                document.getElementById("loginEmailError").textContent = "Please enter a valid email address";
                document.getElementById("loginEmailError").classList.add("show");
                isValid = false;
            } else {
                document.getElementById("loginEmailError").classList.remove("show");
            }
            
            // Validate password
            if (password === "") {
                document.getElementById("loginPasswordError").textContent = "Please enter your password";
                document.getElementById("loginPasswordError").classList.add("show");
                isValid = false;
            } else {
                document.getElementById("loginPasswordError").classList.remove("show");
            }
            
            if (!isValid) {
                showToast("Please fix the errors to continue", "error");
                return;
            }
            
            // Check credentials against localStorage
            const users = JSON.parse(localStorage.getItem('gymUsers'));
            const user = users.find(u => u.email === email && u.password === password);
            
            if (!user) {
                showToast("Invalid email or password", "error");
                return;
            }
            
            // Simulate loading
            const btn = document.querySelector('#loginContainer .btn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> LOGGING IN...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = 'LOGIN';
                btn.disabled = false;
                
                // Store current user in session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                
                showToast(`Login successful! Welcome back, ${user.name}`);
                
                // Redirect to next page
                window.location.href = "page2/Main2.html";
            }, 1500);
        }
        
        function register() {
            let name = document.getElementById("regName").value;
            let username = document.getElementById("regUsername").value;
            let email = document.getElementById("regEmail").value;
            let password = document.getElementById("regPassword").value;
            let terms = document.getElementById("agreeTerms").checked;
            let isValid = true;
            
            // Validate name
            if (name === "") {
                document.getElementById("regNameError").textContent = "Please enter your full name";
                document.getElementById("regNameError").classList.add("show");
                isValid = false;
            } else {
                document.getElementById("regNameError").classList.remove("show");
            }
            
            // Validate username
            if (!validateUsername()) {
                isValid = false;
            }
            
            // Validate email
            if (!validateEmailField('regEmail', 'regEmailError')) {
                isValid = false;
            }
            
            // Validate password
            if (!checkPasswordStrength()) {
                isValid = false;
            }
            
            // Validate terms
            if (!terms) {
                document.getElementById("termsError").textContent = "You must agree to the terms and conditions";
                document.getElementById("termsError").classList.add("show");
                isValid = false;
            } else {
                document.getElementById("termsError").classList.remove("show");
            }
            
            if (!isValid) {
                showToast("Please fix the errors to continue", "error");
                return;
            }
            
            // Simulate loading
            const btn = document.querySelector('#registerContainer .btn');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CREATING ACCOUNT...';
            btn.disabled = true;
            
            // Create new user object
            const newUser = {
                id: Date.now().toString(),
                name: name,
                username: username,
                email: email,
                password: password,
                joinDate: new Date().toISOString()
            };
            
            // Add user to localStorage
            setTimeout(() => {
                const users = JSON.parse(localStorage.getItem('gymUsers'));
                users.push(newUser);
                localStorage.setItem('gymUsers', JSON.stringify(users));
                
                btn.innerHTML = 'SIGN UP';
                btn.disabled = false;
                
                // Automatically log in the user after registration
                sessionStorage.setItem('currentUser', JSON.stringify(newUser));
                
                // Show success message and redirect
                showToast("Registration successful! Redirecting...");
                
                // Clear registration form
                document.getElementById("regName").value = "";
                document.getElementById("regUsername").value = "";
                document.getElementById("regEmail").value = "";
                document.getElementById("regPassword").value = "";
                document.getElementById("agreeTerms").checked = false;
                document.getElementById("strengthBar").style.width = "0%";
                
                // Clear validation messages
                document.querySelectorAll('.validation-message').forEach(el => {
                    el.classList.remove("show", "valid");
                });
                
                // Redirect to next page after a short delay
                setTimeout(() => {
                    window.location.href = "page2/Main2.html";
                }, 1500);
                
            }, 1500);
        }
        
        function socialLogin(provider) {
            showToast(`Social login with ${provider.charAt(0).toUpperCase() + provider.slice(1)} is not implemented in this demo`);
            // In a real app, this would redirect to OAuth login
        }
        
        // Check if there are any registered users
        window.onload = function() {
            const users = JSON.parse(localStorage.getItem('gymUsers'));
            if (users.length > 0) {
                console.log(`${users.length} users found in local storage`);
            } else {
                console.log('No registered users found');
            }
            
            // Check if user is already logged in
            if(sessionStorage.getItem('currentUser')) {
                window.location.href = "page2/Main2.html";
            }
        }

       