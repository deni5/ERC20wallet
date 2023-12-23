// Erc20Lib.js

const web3 = new Web3("https://sepolia.infura.io/v3/3be763d989e54a0e93b760a484fa2aa1"); 
const erc20Address = "0xE862Ca4b9389d9bC306c2367A36B8Bd45f6838Bb"; 
const erc20Contract = new web3.eth.Contract(ERC20_ABI, erc20Address);

const ERC20_ABI = [
    {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            { internalType: 'address', name: '_to', type: 'address' },
            { internalType: 'uint256', name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true, internalType: 'address', name: 'from', type: 'address',
            },
            {
                indexed: true, internalType: 'address', name: 'to', type: 'address',
            },
            {
                indexed: false, internalType: 'uint256', name: 'value', type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
];

async function getErc20Balance() {
    const account = await getCurrentAddress();
    const balance = await erc20Contract.methods.balanceOf(account).call();
    return balance;
}

async function sendErc20Transaction(recipient, amount) {
    const account = await getCurrentAddress();
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 200000; 

    const data = erc20Contract.methods.transfer(recipient, amount).encodeABI();

    const transactionObject = {
        from: account,
        to: erc20Address,
        gasPrice: gasPrice,
        gas: gasLimit,
        data: data,
    };

    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, "YOUR_PRIVATE_KEY"); 

    const transaction = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    return transaction;
}

async function getCurrentAddress() {
    return await web3.eth.getCoinbase();
}
