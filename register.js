document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const userType = document.getElementById('user-type').value;
            
            // Validate form
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (password.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            
            if (!userType) {
                alert('Please select an account type');
                return;
            }
            
            // Here you would typically make an API call to your backend
            // For now, we'll simulate a successful registration
            console.log('Registration attempt with:', { name, email, userType });
            
            // Simulate API call delay
            setTimeout(() => {
                // In a real app, you would:
                // 1. Send registration data to your backend
                // 2. Receive a response
                // 3. Redirect to login or dashboard
                
                alert('Registration successful! Redirecting to login...');
                window.location.href = 'login.html';
            }, 1000);
        });
    }
});