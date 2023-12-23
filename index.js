
const accountAddress = "0xE862Ca4b9389d9bC306c2367A36B8Bd45f6838Bb";
const sepoliaContractAddress = "0xE862Ca4b9389d9bC306c2367A36B8Bd45f6838Bb";
const infuraProjectId = "3be763d989e54a0e93b760a484fa2aa1";

const web3 = new Web3(new Web3.providers.HttpProvider(`https://sepolia.infura.io/v3/3be763d989e54a0e93b760a484fa2aa1`));

function getBalanceAndSelectedCrypto() {
    const selectedCrypto = document.getElementById("cryptos").value;

    if (selectedCrypto === "ERC20") {
        getErc20Balance();
    } else {
        getEthBalance();
    }

    updateSelectedCrypto();
}

function getEthBalance() {
    web3.eth.getBalance(accountAddress, function (error, balance) {
        if (!error) {
            const balanceInEth = web3.utils.fromWei(balance, "ether");
            const balanceDisplay = document.getElementById("balance-display");
            balanceDisplay.textContent = "Balance: " + balanceInEth + " ETH";
        } else {
            console.error("Balance error:", error);
        }
    });
}

async function getErc20Balance() {
    try {
        const erc20Balance = await getErc20Balance();
        const balanceDisplay = document.getElementById("balance-display");
        balanceDisplay.textContent = `Balance: ${erc20Balance} ERC20`;
    } catch (error) {
        console.error("Error getting ERC20 balance:", error);
    }
}

function sendTransaction() {
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("cryptos").value;
    const recipient = document.getElementById("recipient").value;

    if (recipient && amount && currency) {
        if (web3.utils.isAddress(recipient)) {
            if (currency === "ERC20") {
                sendErc20Transaction(recipient, amount);
            } else {
                sendEthTransaction(recipient, amount);
            }
        } else {
            alert("Invalid Ethereum address");
        }
    } else {
        alert("Please fill in all fields");
    }
}

function sendEthTransaction(recipient, amount) {
    web3.eth.getTransactionCount(accountAddress, function (error, nonce) {
        if (!error) {
            const transaction = {
                from: accountAddress,
                to: recipient,
                value: web3.utils.toWei(amount, "ether"),
                gas: 21000,  // Example gas limit
                nonce: nonce,
            };

            web3.eth.accounts.signTransaction(transaction, "8b5b985a5088ede4144c7edb7059773d4d8ed21864b8f8f7bfb39bb872a75a9f", function (error, signedTx) {
                if (!error) {
                    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
                        .on('transactionHash', function(hash){
                            alert("Transaction sent! Transaction Hash: " + hash);
                        })
                        .on('error', function(error){
                            console.error("Transaction error:", error);
                        });
                } else {
                    console.error("Error signing transaction:", error);
                }
            });
        } else {
            console.error("Error getting nonce:", error);
        }
    });
}

async function sendErc20Transaction(recipient, amount) {
    try {
        const transaction = await sendErc20Transaction(recipient, amount);
        alert("Transaction sent! Transaction Hash: " + transaction.transactionHash);
    } catch (error) {
        console.error("Error sending ERC20 transaction:", error);
    }
}

function updateSelectedCrypto() {
    const selectElement = document.getElementById("cryptos");
    const selectedCryptoDisplay = document.getElementById("crypto-display");
    const selectedCryptoSpan = document.getElementById(selectElement.value);
    const balanceDisplay = document.getElementById("balance-display");

    selectedCryptoDisplay.textContent = selectElement.value;

    document.querySelectorAll("#cryptolist span").forEach(span => {
        span.style.color = "green";
        span.style.fontWeight = "normal";
    });

    selectedCryptoSpan.style.color = "black";
    selectedCryptoSpan.style.fontWeight = "bold";

    getBalanceAndSelectedCrypto();
}

function updateSelectedCryptoFromList(crypto) {
    const selectElement = document.getElementById("cryptos");
    selectElement.value = crypto;
    updateSelectedCrypto();
}

function getEthBalanceFromMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(function (accounts) {
                const currentAddress = accounts[0];
                const currentAddressElement = document.getElementById("current-address");
                currentAddressElement.textContent = currentAddress;

                updateBalanceAndSelectedCrypto(currentAddress);
            })
            .catch(function (error) {
                console.error("Error getting address:", error);
            });
    } else {
        console.error("Metamask (Sepolia) not detected");
    }
}

function getEthBalanceFromInfura(address) {
    web3.eth.getBalance(address, function (error, balance) {
        if (!error) {
            const balanceInEth = web3.utils.fromWei(balance, "ether");
            const balanceDisplay = document.getElementById("balance-display");
            balanceDisplay.textContent = balanceInEth + " ETH";

            updateSelectedCrypto();
        } else {
            console.error("Error getting balance:", error);
        }
    });
}

function updateBalanceAndSelectedCrypto(address) {
    getEthBalanceFromInfura(address);
    updateSelectedCryptoFromList(defaultCrypto);
}

window.onload = function () {
    getEthBalanceFromMetamask();
};
