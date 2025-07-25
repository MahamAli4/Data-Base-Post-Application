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


// Set up  password Visibility toggle
// const togglePassword = document.getElementById('togglePassword');
// const passwordInput = document.getElementById('signup-password');
// const eyeIcon = document.getElementById('eyeIcon');

// if (togglePassword && passwordInput && eyeIcon) {
//     togglePassword.addEventListener('click', () => {
//         const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
//         passwordInput.setAttribute('type', type);
//         eyeIcon.classList.toggle('fa-eye');
//         eyeIcon.classList.toggle('fa-eye-slash');
//     });
// }

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
	try {
		const redirecToo = window.location.hostname === '127.0.0.1'
			? window.location.origin + '/post.html'
			: window.location.origin + '/Data-Base-Post-Application/post.html'

		const { error } = await client.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: redirecToo,
				queryParams: { access_type: 'offline', prompt: 'consent' }
			}
		});
		if (error) {
			Swal.fire({ icon: 'error', title: 'Google Sign-In Failed', text: error.message });
		}
	} catch (error) {
        console.log('Google Login Error', error);
		alert(error.message || 'Google login failed')
	}


});

// LinkedIn Sign-In
document.getElementById('linkedinSignIn')?.addEventListener("click", async () => {
	localStorage.setItem("loginSuccess", "LinkedIn");
	const { error } = await client.auth.signInWithOAuth({
		provider: 'linkedin_oidc',
		options: {
			redirectTo: window.location.origin + '/post.html',
			queryParams: { access_type: 'offline', prompt: 'consent' }
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
			redirectTo: window.location.origin + '/post.html',
			queryParams: { access_type: 'offline', prompt: 'consent' }

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
		const avatar = user.user_metadata.avatar_url || user.user_metadata.picture || './images/images.jpg';

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


// check for returning Google Oauth Redirect 
document.addEventListener('DOMContentLoaded', async () => {
	if (window.location.hash.includes('access_token')) {
		const {
			data: { session },
		} = await client.auth.getSession();
		if (session) window.location.href = 'post.html';
	}
	if (!window.location.pathname.includes('index.html')) {
		loadUserInfo();
	}
})


// Add a post
const addPostBtn = document.getElementById('addPostBtn');
const loaderOverlay = document.getElementById('loader-overlay');
// console.log(loaderOverlay);

function showLoader() {
	loaderOverlay.style.display = 'flex';
}

function hideLoader() {
	loaderOverlay.style.display = 'none';
}


addPostBtn && addPostBtn.addEventListener("click", async () => {
	const userTitle = document.getElementById('post-title').value.trim();
	const userDescription = document.getElementById('postdescrib').value.trim();
	console.log(userTitle, userDescription);

	if (!userTitle || !userDescription) {
		Swal.fire({
			icon: 'warning',
			title: 'Missing Fields',
			text: 'Please enter both a title and a description.',
			confirmButtonColor: '#125b9a',
		});
		return;
	}

	showLoader();
	addPostBtn.disabled = true;

	try {
		const {
			data: { user },
			error: authError,
		} = await client.auth.getUser();

		if (authError || !user) throw authError || new Error('User not found.');

		const { data, error } = await client.from('posts').insert({
			user_id: user.id,
			title: userTitle,
			description: userDescription,
		});

		if (error) {
			console.error(error);
			Swal.fire({
				icon: 'error',
				title: 'Post Failed',
				text: 'There was a problem creating the post.',
				confirmButtonColor: '#125b9a',
			});
		} else {
			Swal.fire({
				icon: 'success',
				title: 'Post Created',
				text: 'Your post has been successfully created!',
				timer: 1500,
				showConfirmButton: false,
			});
			document.getElementById('post-title').value = '';
			document.getElementById('postdescrib').value = '';
		}
	} catch (err) {
		console.error(err);
		Swal.fire({
			icon: 'error',
			title: 'Unexpected Error',
			text: 'Something went wrong. Please try again.',
			confirmButtonColor: '#eb4108ff',
		});
	} finally {
		hideLoader();
		addPostBtn.disabled = false;
	}
});

//read all posts

if (window.location.pathname == '/allblog.html') {
	const current = document.getElementById('current');
	console.log(current);
	// current.style.textDecoration = 'underline';

	try {
		const readAllPosts = async () => {
			const { data, error } = await client.from('posts').select();
			if (data) {
				const box = document.getElementById('containerSection');
				console.log(box);

				box.innerHTML = data
					.map(
						({ id, title, description }) => `<div id='${id}' class="card bg-info text-white bg-transparent p-3" style="width: 18rem;border: 2px solid #bba4f6;color: #bba4f6; border-radius: 10px;box-shadow: 2px 2px 7px #bba4f6;">
						<div class="card-body">
							<h5 class="card-title fs-2 fw-bold text-center">${title}</h5>

							<p class="card-text text-center">${description} </p>

						</div>
					</div>`,
					)
					.join('');
			} else {
				console.log(error);
			}
		};
		readAllPosts();
	} catch (error) {
		console.log(error);
	}
}

//read my posts
const readMyPosts = async () => {
	const {
		data: { user },
	} = await client.auth.getUser();
	const { data, error } = await client.from('posts').select().eq('user_id', user.id);
	console.log(data);
	if (data) {
		const box1 = document.getElementById('containerMyPost');
		console.log(box1);

		box1.innerHTML = data
			.map(
				({ id, title, description }) => `<div id='${id}' class="card bg-info text-white p-2 bg-transparent mt-5" style="width: 18rem;border: 2px solid #bba4f6;color: #bba4f6; border-radius: 10px;box-shadow: 2px 2px 7px #bba4f6;">
						<div class="card-body">
							<h5 class="card-title fs-2 fw-bold">${title}</h5>

							<p class="card-text">${description} </p>

						</div>
						<div class="d-flex gap-2 px-3 py-2">
						<button type="button" onclick="updatePost('${id}','${title}','${description}')" class="btn btn-success">Edit</button>
						<button type="button" onclick="deletePost('${id}')"  class="btn btn-danger">Delete</button></div>
					</div>`,
			)
			.join('');
	} else {
		console.log(error);
	}
};
if (window.location.pathname == '/myblog.html') {
	const active = document.getElementById('active');
	console.log(active);
	// current.style.textDecoration = 'underline red';

	try {
		readMyPosts();
	} catch (error) {
		console.log(error);
	}
}


document.addEventListener("DOMContentLoaded", () => {
	const links = document.querySelectorAll(".nav-link");

	links.forEach((link) => {
		const href = link.getAttribute("href");
		const currentPath = window.location.pathname.split("/").pop();

		if (href === currentPath) {
			link.classList.add("active");
		}
	});
});



//delete a post

async function deletePost(postId) {
	const swalWithBootstrapButtons = Swal.mixin({
		customClass: {
			confirmButton: 'btn btn-success',
			cancelButton: 'btn btn-danger',
		},
		buttonsStyling: false,
	});
	swalWithBootstrapButtons
		.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'No, cancel!',
			reverseButtons: true,
		})
		.then(async (result) => {
			if (result.isConfirmed) {
				try {
					showLoader();
					const response = await client.from('posts').delete().eq('id', postId);
					if (response) {
						hideLoader();
						alert('post has been deleted');
						console.log(response);
						readMyPosts();
					} else {
						console.log(error);
					}
				} catch (error) {
					console.log(error);
				} finally {
					hideLoader();
				}

				swalWithBootstrapButtons.fire({
					title: 'Deleted!',
					text: 'Your file has been deleted.',
					icon: 'success',
				});
			} else if (
				/* Read more about handling dismissals below */
				result.dismiss === Swal.DismissReason.cancel
			) {
				swalWithBootstrapButtons.fire({
					title: 'Cancelled',
					text: 'Your imaginary file is safe :)',
					icon: 'error',
				});
			}
		});
}

//update post

async function updatePost(postId, postTitle, postDescription) {
	const { value: formValues } = await Swal.fire({
		title: 'Update Post',
		html: `
    <label > post title
	<input id="swal-input1" class="swal1-input"  value = '${postTitle}' ></label>
    <label > post description
	<input id="swal-input2" class="swal2-input" style="margin: 0 !important;"   value = '${postDescription}' ></label>
  `,
		focusConfirm: false,
		preConfirm: () => {
			return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value];
		},
	});
	try {
		if (formValues) {
			showLoader();
			const [updatedTitle, updatedDescription] = formValues;
			const { error } = await client
				.from('posts')
				.update({ title: updatedTitle, description: updatedDescription })
				.eq('id', postId);

			if (error) {
				console.log(error);
			} else {
				hideLoader();

				Swal.fire({
					icon: 'success',
					title: 'your post has been updated',
					confirmButtonColor: '#125b9a',
				});
				readMyPosts();
			}
		}
	} catch (error) {
		console.log(error);
	} finally {
		hideLoader();
	}
}


// function getCurrentFileName() {
//   return window.location.pathname.split('/').pop();
// }

// if (getCurrentFileName() === 'allblog.html') {
//   // your code
// }


