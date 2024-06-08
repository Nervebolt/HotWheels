firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        const userId = user.uid;
        firebase.firestore().collection('users').doc(userId).get().then((doc) => {
            if (doc.exists && doc.data().isAdmin) {
                loadInvestments();
                loadBadges();
                setupEventListeners();
            } else {
                alert('Access denied. Admins only.');
                window.location.href = 'index.html';
            }
        });
    } else {
        window.location.href = 'index.html';
    }
});

function loadInvestments() {
    const investmentsTable = document.getElementById('investments-table').getElementsByTagName('tbody')[0];
    firebase.firestore().collection('investments').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const investment = doc.data();
            const row = investmentsTable.insertRow();
            row.insertCell(0).innerText = investment.userId;
            row.insertCell(1).innerText = investment.company;
            row.insertCell(2).innerText = investment.amount;
            row.insertCell(3).innerText = investment.value;
            row.insertCell(4).innerText = investment.date.toDate().toLocaleString();
        });
    });
}

function loadBadges() {
    const badgeList = document.getElementById('badge-list');
    firebase.firestore().collection('badges').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const badge = doc.data();
            const li = document.createElement('li');
            li.innerText = `${badge.name} - ${badge.description} - ${badge.price} HW Coins`;
            badgeList.appendChild(li);
        });
    });
}

function setupEventListeners() {
    document.getElementById('badge-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const badgeName = document.getElementById('badge-name').value;
        const badgeDescription = document.getElementById('badge-description').value;
        const badgePrice = parseInt(document.getElementById('badge-price').value);

        firebase.firestore().collection('badges').add({
            name: badgeName,
            description: badgeDescription,
            price: badgePrice
        }).then(() => {
            alert('Badge added successfully!');
            window.location.reload();
        }).catch((error) => {
            console.error('Error adding badge: ', error);
        });
    });

    document.getElementById('user-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const userEmail = document.getElementById('user-email').value;
        const userAction = document.getElementById('user-action').value;
        const coinAmount = parseInt(document.getElementById('coin-amount').value);

        firebase.firestore().collection('users').where('email', '==', userEmail).get().then((querySnapshot) => {
            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const userId = doc.id;
                    const userData = doc.data();

                    if (userAction === 'add-coins') {
                        const newBalance = (userData.balance || 0) + coinAmount;
                        firebase.firestore().collection('users').doc(userId).update({ balance: newBalance }).then(() => {
                            alert('HW Coins added successfully!');
                        });
                    } else if (userAction === 'remove-coins') {
                        const newBalance = (userData.balance || 0) - coinAmount;
                        firebase.firestore().collection('users').doc(userId).update({ balance: newBalance }).then(() => {
                            alert('HW Coins removed successfully!');
                        });
                    } else if (userAction === 'delete-account') {
                        firebase.firestore().collection('users').doc(userId).delete().then(() => {
                            alert('User account deleted successfully!');
                        });
                    }
                });
            } else {
                alert('User not found.');
            }
        }).catch((error) => {
            console.error('Error fetching user: ', error);
        });
    });
}

document.getElementById('sign-out').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
        window.location.href = 'index.html';
    });
});
