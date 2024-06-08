document.getElementById("invest-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const investmentAmount = parseFloat(document.getElementById("investment-amount").value);
    const selectedCompany = document.getElementById("investment-company").value;

    if (isNaN(investmentAmount) || investmentAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        alert("You must be signed in to invest.");
        return;
    }

    const userId = user.uid;

    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${selectedCompany}&interval=5min&apikey=PNV0O85CFIE745CM`)
        .then(response => response.json())
        .then(data => {
            if (data["Error Message"]) {
                throw new Error("Failed to fetch stock data. Please try again later.");
            }

            const timeSeries = data["Time Series (5min)"];
            const latestTime = Object.keys(timeSeries)[0];
            const closePrice = parseFloat(timeSeries[latestTime]["4. close"]);

            firebase.firestore().collection("users").doc(userId).get().then(doc => {
                if (doc.exists) {
                    const userData = doc.data();
                    let currentBalance = userData.balance || 0;

                    if (currentBalance < investmentAmount) {
                        alert("Insufficient balance.");
                        return;
                    }

                    const investmentValue = investmentAmount / closePrice;
                    currentBalance -= investmentAmount;

                    const investment = {
                        userId: userId,
                        company: selectedCompany,
                        amount: investmentAmount,
                        value: investmentValue,
                        date: new Date(),
                        status: "active"
                    };

                    firebase.firestore().collection("investments").add(investment).then(() => {
                        firebase.firestore().collection("users").doc(userId).update({
                            balance: currentBalance
                        }).then(() => {
                            alert(`Investment successful! You invested ${investmentAmount} HW coins in ${selectedCompany}.`);
                            window.location.reload();
                        });
                    });
                }
            });
        })
        .catch(error => {
            console.error(error);
            alert("Failed to fetch stock data. Please try again later.");
        });
});
