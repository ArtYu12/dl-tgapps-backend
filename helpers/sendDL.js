const TonWeb = require("tonweb");
const pkg = require('tonweb-mnemonic');
const dotenv = require('dotenv');
dotenv.config();

const {
    mnemonicToKeyPair
} = pkg;

const { JettonWallet } = TonWeb.token.jetton;

const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', {

}));

async function sendDL(address, amount) {
    const {
        publicKey,
        secretKey
    } = await mnemonicToKeyPair(process.env.TON_WALLET_MNEMONIC.split(" "))

    const WalletClass = tonweb.wallet.all['v4R2'];
    const wallet = new WalletClass(tonweb.provider, {
        publicKey: publicKey,
        wc: 0
    });

    const seqno = (await wallet.methods.seqno().call()) || 0;

    const jettonWallet = new JettonWallet(tonweb.provider, {
        address: new TonWeb.Address("EQClbU_gaUjGvAKinEZPQO6406Pr77Y7jGD8BTb1vy_puwlK")
    });

    const tr = await wallet.methods.transfer({
        secretKey: secretKey,
        toAddress: new TonWeb.Address("EQBvz5J6071g2JFFOykbepvSrrL2RJM_6cIhQPLtNfdfCnac").toString(false, false, false),
        amount: TonWeb.utils.toNano('0.1'),
        seqno: seqno,
        payload: await jettonWallet.createTransferBody({
            jettonAmount: amount,
            toAddress: new TonWeb.utils.Address(address),
            forwardAmount: TonWeb.utils.toNano('0.01'),
            responseAddress: new TonWeb.utils.Address("UQBrKi-UxyCvspTDZaLWrthLmiovK326gSLSKo2vyvzLr-w9")
        }),
        sendMode: 3,
    }).send()
    console.log(tr, address, amount)
    return tr
}

module.exports = {sendDL};