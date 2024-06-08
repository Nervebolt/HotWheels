document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;
    if (user) {
        const userRef = db.collection('users').doc(user.uid);
        
        userRef.get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('profile-initial').textContent = userData.username.charAt(0).toUpperCase();
                document.getElementById('profile-name').textContent = userData.username;
            } else {
                console.error('No such document!');
            }
        }).catch(error => {
            console.error('Error getting document:', error);
        });

        window.changeUsername = () => {
            const newUsername = prompt('Enter your new username:');
            if (newUsername) {
                userRef.update({
                    username: newUsername
                }).then(() => {
                    alert('Username updated successfully');
                    location.reload();
                }).catch(error => {
                    console.error('Error updating username:', error);
                });
            }
        };

        window.deleteAccount = () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                user.delete().then(() => {
                    userRef.delete().then(() => {
                        alert('Account deleted successfully');
                        window.location.href = 'index.html';
                    }).catch(error => {
                        console.error('Error deleting user data:', error);
                    });
                }).catch(error => {
                    console.error('Error deleting user:', error);
                });
            }
        };
    } else {
        window.location.href = 'sign-in.html';
    }
});
