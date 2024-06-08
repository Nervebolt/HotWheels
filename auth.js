document.addEventListener('DOMContentLoaded', function () {
    // Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyDcX-U4oFf9czKIx68k_poQvVoDQSAa6iE",
        authDomain: "hotwheels-f1639.firebaseapp.com",
        projectId: "hotwheels-f1639",
        storageBucket: "hotwheels-f1639.appspot.com",
        messagingSenderId: "397253585572",
        appId: "1:397253585572:web:53f959e6f7026b002e5431"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    // Get elements
    const signUpButton = document.getElementById('signUpButton');
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const investmentForm = document.getElementById('investmentForm');
    const adminToggle = document.getElementById('adminToggle');
    
    // Sign up function
    if (signUpButton) {
        signUpButton.addEventListener('click', function () {
            const email = document.getElementById('signUpEmail').value;
            const password = document.getElementById('signUpPassword').value;
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    var user = userCredential.user;
                    console.log("User signed up:", user);
                    return firebase.firestore().collection('users').doc(user.uid).set({
                        email: email,
                        isAdmin: false
                    });
                })
                .catch((error) => {
                    console.error(error.message);
                });
        });
    }

    // Sign in function
    if (signInButton) {
        signInButton.addEventListener('click', function () {
            const email = document.getElementById('signInEmail').value;
            const password = document.getElementById('signInPassword').value;
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    var user = userCredential.user;
                    console.log("User signed in:", user);
                    // Check if the user is admin and show/hide admin features
                    return firebase.firestore().collection('users').doc(user.uid).get();
                })
                .then((doc) => {
                    if (doc.exists && doc.data().isAdmin) {
                        // Show admin features
                        console.log("Admin signed in");
                    } else {
                        // Hide admin features
                        console.log("Regular user signed in");
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        });
    }

    // Sign out function
    if (signOutButton) {
        signOutButton.addEventListener('click', function () {
            firebase.auth().signOut().then(() => {
                console.log("User signed out");
            }).catch((error) => {
                console.error(error.message);
            });
        });
    }

    // Investment function
    if (investmentForm) {
        investmentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const company = document.getElementById('companySelect').value;
            const amount = document.getElementById('investmentAmount').value;
            const user = firebase.auth().currentUser;
            if (user) {
                firebase.firestore().collection('investments').add({
                    userId: user.uid,
                    company: company,
                    amount: amount,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    console.log(`Invested $${amount} in ${company}`);
                }).catch((error) => {
                    console.error(error.message);
                });
            } else {
                console.error('No user signed in');
            }
        });
    }

    // Admin toggle function
    if (adminToggle) {
        adminToggle.addEventListener('click', function () {
            const user = firebase.auth().currentUser;
            if (user) {
                firebase.firestore().collection('users').doc(user.uid).get()
                    .then((doc) => {
                        if (doc.exists && doc.data().isAdmin) {
                            return firebase.firestore().collection('users').doc(user.uid).update({
                                isAdmin: !doc.data().isAdmin
                            });
                        } else {
                            console.error("User is not admin");
                        }
                    }).then(() => {
                        console.log("Admin status toggled");
                    }).catch((error) => {
                        console.error(error.message);
                    });
            } else {
                console.error('No user signed in');
            }
        });
    }
});
