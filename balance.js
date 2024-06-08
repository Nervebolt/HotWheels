document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;
    if (user) {
        const balanceElement = document.getElementById('balance');
        const userRef = db.collection('users').doc(user.uid);

        userRef.get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                balanceElement.textContent = `KSH ${userData.balance.toFixed(2)}`;
            } else {
                balanceElement.textContent = 'Error fetching balance.';
            }
        }).catch(error => {
            console.error('Error fetching balance:', error);
            balanceElement.textContent = 'Error fetching balance.';
        });
    } else {
        window.location.href = 'sign-in.html';
    }
});
