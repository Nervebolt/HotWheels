// Sign-Up
const signUpForm = document.getElementById('sign-up-form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;

    if (!terms) {
        alert('You must agree to the terms and conditions.');
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Save user data in Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                username: username,
                email: email,
                balance: 200, // Initial balance
                badges: [],
                investments: [],
            });
        })
        .then(() => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Error signing up:', error.message);
        });
});

// Sign-In
const signInForm = document.getElementById('sign-in-form');
signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            alert('Invalid email or password.');
            console.error('Error signing in:', error.message);
        });
});

// Google Sign-In
const googleSignInButton = document.getElementById('google-sign-in');
googleSignInButton.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            if (result.additionalUserInfo.isNewUser) {
                // Save user data in Firestore
                db.collection('users').doc(user.uid).set({
                    username: user.displayName,
                    email: user.email,
                    balance: 200, // Initial balance
                    badges: [],
                    investments: [],
                });
            }
            window.location.href = 'dashboard.html';
        })
        .catch((error) => {
            console.error('Error with Google Sign-In:', error.message);
        });
});

// Sign Out
const signOutButton = document.getElementById('sign-out');
signOutButton.addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});
