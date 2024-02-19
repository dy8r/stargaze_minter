const { DirectSecp256k1HdWallet, Registry } = require('@cosmjs/proto-signing');
const { assertIsBroadcastTxSuccess, SigningStargateClient, coins } = require('@cosmjs/stargate');
const { MsgExecuteContract } = require('cosmjs-types/cosmwasm/wasm/v1/tx');
const { stringToPath } = require('@cosmjs/crypto');

const { MNEMONIC, NUM_MINTS, CONTRACT_ADRESS, MINT_PRICE, START_HOUR, START_MINUTE } = require('./constants');

const rpcEndpoint = "https://rpc.stargaze-apis.com";

async function executeContract() {
    const myRegistry = new Registry();
    myRegistry.register("/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract);

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(MNEMONIC, { prefix: "stars" });
    const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry: myRegistry });
    const [{ address: senderAddress }] = await wallet.getAccounts();

    const msgBase64 = Buffer.from(JSON.stringify({ mint: {} })).toString('base64');

    const messages = Array.from({ length: NUM_MINTS }, () => ({
        typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
        value: MsgExecuteContract.fromPartial({
            sender: senderAddress,
            contract: CONTRACT_ADRESS,
            msg: Buffer.from(msgBase64, 'base64'),
            funds: coins(MINT_PRICE * 100000, "ustars"), 
        }),
    }));

    const fee = {
        amount: coins(0, "ustars"), 
        gas: "10000000", 
    };

    const result = await client.signAndBroadcast(senderAddress, messages, fee, "");

    if (result.code !== undefined && result.code !== 0) {
        console.error('Transaction failed:', result);
    } else {
        console.log('Transaction successful:', result);
    }
}



const executeAtTime = async (hour, minute, callback) => {
    const now = new Date();
    let targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    // If the target time is already past, set it for the next day
    if (now > targetTime) {
        targetTime.setDate(targetTime.getDate() + 1);
    }

    const countdownInterval = setInterval(() => {
        const currentTime = new Date();
        const timeLeft = targetTime - currentTime;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            console.log("Minting...");
            callback().catch(console.error);
        } else {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            console.clear();
            console.log(`Time left until execution: ${hours}h ${minutes}m ${seconds}s`);
        }
    }, 1000);
};

executeAtTime(START_HOUR, START_MINUTE, executeContract);

