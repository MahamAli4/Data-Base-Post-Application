const wrapper = document.querySelector('.warraper');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink && registerLink.addEventListener("click", () => {
    wrapper.classList.add('active');
});
loginLink && loginLink.addEventListener("click", () => {
    wrapper.classList.remove('active');
});

const supabaseUrl = 'https://zxqzjpgemwltbbbajglz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4cXpqcGdlbXdsdGJiYmFqZ2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0Mzg4NDQsImV4cCI6MjA2NzAxNDg0NH0.wwSR-8zVPuTFApgNumLGZJn9a6roc3-BjOKxADy-7sw';

const { createClient } = supabase;
const client = createClient(supabaseUrl, supabaseKey);


// Sign Up
const signupBtn = document.getElementById('signupBtn');
signupBtn &&
    signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');

        if (email && password) {
            try {
                const { data, error } = await client.auth.signUp({
                    email: email.value,
                    password: password.value,
                });

                if (error) {
                    throw error;
                }

                // ✅ Success Alert
                Swal.fire({
                    icon: 'success',
                    title: 'Signed Up!',
                    text: 'You have successfully signed up!',
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    window.location.href = 'post.html';
                });

            } catch (error) {
                console.error('Signup error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Signup Failed!',
                    text: error.message || 'Something went wrong!',
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Fields',
                text: 'Please fill all fields.',
            });
        }
    });


// Login
const loginBtn = document.getElementById('loginBtn');
loginBtn &&
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');

        if (email && password) {
            try {
                const { data, error } = await client.auth.signInWithPassword({
                    email: email.value,
                    password: password.value,
                });

                if (error) {
                    console.error('Login Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: error.message || 'Invalid credentials.',
                    });
                    return;
                }

                if (data?.session) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged In!',
                        text: 'Login successful!',
                        showConfirmButton: false,
                        timer: 1500,
                    }).then(() => {
                        window.location.href = 'post.html';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'Please check your credentials.',
                    });
                }

            } catch (error) {
                console.error('Login error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed!',
                    text: error.message || 'Something went wrong!',
                });
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'Empty Fields',
                text: 'Please fill all fields.',
            });
        }
    });


// Google Sign-In

document.getElementById('googleSignIn')?.addEventListener("click", async () => {
    localStorage.setItem("loginSuccess", "Google");
    const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/post.html'
        }
    });
    if (error) {
        Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: error.message });
    }
});

// LinkedIn Sign-In
document.getElementById('linkedinSignIn')?.addEventListener("click", async () => {
    localStorage.setItem("loginSuccess", "LinkedIn");
    const { error } = await client.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
            redirectTo: window.location.origin + '/post.html'
        }
    });
    if (error) {
        Swal.fire({ icon: 'error', title: 'LinkedIn Sign-In Failed', text: error.message });
    }
});

// Facebook Sign-In
document.getElementById('facebookSignIn')?.addEventListener("click", async () => {
    localStorage.setItem("loginSuccess", "Facebook");
    const { error } = await client.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            redirectTo: window.location.origin + '/post.html'
        }
    });
    if (error) {
        Swal.fire({ icon: 'error', title: 'Facebook Sign-In Failed', text: error.message });
    }
});

async function loadUserInfo() {
    const { data: { user } } = await client.auth.getUser();
    console.log(user); // Debugging

    if (user) {
        const userInfo = document.getElementById('userInfo');
        const name = user.user_metadata.full_name || user.user_metadata.name || user.email.split('@')[0];
        const avatar = user.user_metadata.avatar_url || user.user_metadata.picture || 'https://via.placeholder.com/150';

        userInfo.innerHTML = `
          <img src="${avatar}" alt="User Image">
          <div>
            <span class="name">${name}</span>
            <span class="email">${user.email}</span>
          </div>
        `;
    }
}

loadUserInfo();


// Logout
const logOutBtn = document.getElementById('logout-btn');
logOutBtn &&
    logOutBtn.addEventListener("click", async () => {
        try {
            const { error } = await client.auth.signOut();
            if (error) throw error;

            Swal.fire({
                icon: 'success',
                title: 'Logged Out!',
                text: 'You have been logged out.',
                showConfirmButton: false,
                timer: 1200,
            }).then(() => {
                window.location.href = 'index.html';
            });

        } catch (error) {
            console.error('Logout error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed!',
                text: error.message || 'Something went wrong!',
            });
        }
    });