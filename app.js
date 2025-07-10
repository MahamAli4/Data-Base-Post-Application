const supabaseUrl='https://zxqzjpgemwltbbbajglz.supabase.co';
const supabaseKey ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cXpqcGdlbXdsdGJiYmFqZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzg4NDQsImV4cCI6MjA2NzAxNDg0NH0.wwSR-8zVPuTFApgNumLGZJn9a6roc3-BjOKxADy-7sw';

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);


// Handle signup form submission
const signupBtn = document.getElementById('signupBtn');
signupBtn &&
	signupBtn.addEventListener('click', async () => {
		const email = document.getElementById('signup-email');
		const password = document.getElementById('signup-password');

		if (email && password) {
			try {
				const { data, error } = await client.auth.signUp({
					email: email.value,
					password: password.value,
				});
				if (data) window.location.href = 'post.html';
				if (error) throw error;
			} catch (error) {
				console.error('Signup error:', error);
				if (error.message.includes('invalid format')) {
					alert('Please enter a valid email address');
				}
			}
		} else {
			alert('Please fill all fields');
		}
	});

// Handle login form submission
const loginBtn = document.getElementById('loginBtn');
loginBtn &&
	loginBtn.addEventListener('click', async () => {
		const email = document.getElementById('login-email');
		const password = document.getElementById('login-password');

		if (email && password) {
			try {
				const { data, error } = await client.auth.signInWithPassword({
					email: email.value,
					password: password.value,
				});
				if (data) window.location.href = 'post.html';
				if (error) throw error;
			} catch (error) {
				console.error('Login error:', error);
				if (error.message.includes('invalid format')) {
					alert('Please enter a valid email address');
				}
			}
		} else {
			alert('Please fill all fields');
		}
	});

const wrapper = document.querySelector('.warraper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink.addEventListener("click",()=>{
    wrapper.classList.add('active');
})
loginLink.addEventListener("click",()=>{
    wrapper.classList.remove('active');
})