document.addEventListener('DOMContentLoaded', () => {
    const user = auth.currentUser;
    if (user) {
        const scoresList = document.getElementById('scores-list');
        const userRef = db.collection('users').doc(user.uid);

        userRef.get().then(doc => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.investments && userData.investments.length > 0) {
                    userData.investments.forEach(investment => {
                        const investmentElement = document.createElement('div');
                        investmentElement.classList.add('investment');
                        investmentElement.innerHTML = `
                            <h3>Investment in ${investment.company}</h3>
                            <p>Amount: KSH ${investment.amount}</p>
                            <p>Profit/Loss: ${investment.profitLossPercent}%</p>
                            <p>Date: ${new Date(investment.timestamp.seconds * 1000).toLocaleDateString()}</p>
                        `;
                        scoresList.appendChild(investmentElement);
                    });
                } else {
                    scoresList.innerHTML = '<p>No investments found.</p>';
                }
            } else {
                scoresList.innerHTML = '<p>Error fetching investments.</p>';
            }
        }).catch(error => {
            console.error('Error fetching investments:', error);
            scoresList.innerHTML = '<p>Error fetching investments.</p>';
        });
    } else {
        window.location.href = 'sign-in.html';
    }
});
