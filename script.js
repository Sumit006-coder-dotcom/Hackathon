// Sample data from your CSV (just a few records for demonstration)
const sampleTransactions = [
    {
        transaction_id: "ddbb2a5c-0731-4d37-8db2-9540cdb8034e",
        timestamp: "2025-03-17T03:37:47",
        sender: "JQIAGBXJ",
        receiver: "MZZWGB4E",
        amount: 5769.29,
        currency: "GBP",
        location: "Fiji",
        is_fraud: 1
    },
    {
        transaction_id: "203010b1-25db-4323-a968-9d6062092e50",
        timestamp: "2025-02-02T09:02:50",
        sender: "LYIQGBJU",
        receiver: "ZLOZGBBE",
        amount: 6981.84,
        currency: "EUR",
        location: "Kenya",
        is_fraud: 1
    },
    {
        transaction_id: "7b573829-188c-4a5a-8da2-4d3fdf5ed8c7",
        timestamp: "2025-01-04T10:14:23",
        sender: "XUHDGBNH",
        receiver: "BYAPGBHJ",
        amount: 12212.46,
        currency: "EUR",
        location: "Belarus",
        is_fraud: 0
    },
    {
        transaction_id: "a843e0f9-1a6d-49cf-aee3-dbf1d5ca6841",
        timestamp: "2025-02-03T18:23:22",
        sender: "QFRMGBWD",
        receiver: "YHATGBOQ",
        amount: 17884.36,
        currency: "INR",
        location: "Wallis and Futuna",
        is_fraud: 0
    }
];

// Load sample transactions into the table
function loadSampleTransactions() {
    const tableBody = document.getElementById('transactions-body');
    tableBody.innerHTML = '';
    
    sampleTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        
        // Highlight fraud transactions
        if (transaction.is_fraud === 1) {
            row.style.backgroundColor = '#ffdddd';
        }
        
        row.innerHTML = `
            <td>${transaction.transaction_id}</td>
            <td>${formatDateTime(transaction.timestamp)}</td>
            <td>${transaction.sender}</td>
            <td>${transaction.receiver}</td>
            <td>${transaction.amount.toFixed(2)}</td>
            <td>${transaction.currency}</td>
            <td>${transaction.location}</td>
            <td>${transaction.is_fraud === 1 ? 'Fraud' : 'Legitimate'}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Format datetime for display
function formatDateTime(datetimeStr) {
    const date = new Date(datetimeStr);
    return date.toLocaleString();
}

// Predict fraud using the Flask API
async function predictFraud() {
    const transactionData = {
        transaction_id: document.getElementById('transaction_id').value,
        timestamp: document.getElementById('timestamp').value,
        sender: document.getElementById('sender').value,
        receiver: document.getElementById('receiver').value,
        amount: parseFloat(document.getElementById('amount').value),
        currency: document.getElementById('currency').value,
        location: document.getElementById('location').value
    };
    
    // Basic validation
    if (!transactionData.amount || isNaN(transactionData.amount)) {
        alert('Please enter a valid amount');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        displayResult(result.prediction);
        
        // Add to transactions table (frontend only)
        addToTransactionsTable(transactionData, result.prediction);
    } catch (error) {
        console.error('Error:', error);
        // Fallback to simple check if API fails
        const isFraud = transactionData.amount > 10000 ? 'Fraud' : 'Not Fraud';
        displayResult(isFraud);
        addToTransactionsTable(transactionData, isFraud);
    }
}

// Display prediction result
function displayResult(prediction) {
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = `Prediction: ${prediction}`;
    
    if (prediction === 'Fraud') {
        resultDiv.className = 'fraud';
    } else {
        resultDiv.className = 'not-fraud';
    }
}

// Add new transaction to the table
function addToTransactionsTable(transaction, prediction) {
    const tableBody = document.getElementById('transactions-body');
    const row = document.createElement('tr');
    
    // Highlight if fraud
    if (prediction === 'Fraud') {
        row.style.backgroundColor = '#ffdddd';
    }
    
    row.innerHTML = `
        <td>${transaction.transaction_id || 'N/A'}</td>
        <td>${transaction.timestamp ? formatDateTime(transaction.timestamp) : 'N/A'}</td>
        <td>${transaction.sender || 'N/A'}</td>
        <td>${transaction.receiver || 'N/A'}</td>
        <td>${transaction.amount.toFixed(2)}</td>
        <td>${transaction.currency || 'N/A'}</td>
        <td>${transaction.location || 'N/A'}</td>
        <td>${prediction}</td>
    `;
    
    // Add to the top of the table
    if (tableBody.firstChild) {
        tableBody.insertBefore(row, tableBody.firstChild);
    } else {
        tableBody.appendChild(row);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadSampleTransactions();
    
    // Set current datetime as default
    const now = new Date();
    document.getElementById('timestamp').value = now.toISOString().slice(0, 16);
});