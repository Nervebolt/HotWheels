document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;
    if (user) {
        const badgesList = document.getElementById('badges-list');
        const badges = [
            { id: 'badge1', name: 'Bronze Badge', cost: 50 },
            { id: 'badge2', name: 'Silver Badge', cost: 100 },
            { id: 'badge3', name: 'Gold Badge', cost: 200 }
        ];

        badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.classList.add('badge');
            badgeElement.innerHTML = `
                <h3>${badge.name}</h3>
                <p>Cost: KSH ${badge.cost}</p>
                <button onclick="buyBadge('${badge.id}', ${badge.cost})">Buy</button>
            `;
            badgesList.appendChild(badgeElement);
        });

        window.buyBadge = (badgeId, badgeCost) => {
            const userRef = db.collection('users').doc(user.uid);

            userRef.get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    if (userData.balance >= badgeCost) {
                        const newBalance = userData.balance - badgeCost;
                        userRef.update({
                            balance: newBalance,
                            badges: firebase.firestore.FieldValue.arrayUnion(badgeId)
                        }).then(() => {
                            alert(`Purchased ${badgeId}. New balance is ${newBalance.toFixed(2)}`);
                            window.location.href = 'check-balance.html';
                        }).catch(error => {
                            console.error('Error purchasing badge:', error);
                        });
                    } else {
                        alert('Insufficient balance.');
                    }
                }
            }).catch(error => {
                console.error('Error fetching user data:', error);
            });
        };
    } else {
        window.location.href = 'sign-in.html';
    }
});
