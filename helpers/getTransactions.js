const getTransactions = async (address) => {
    const req = await fetch(`https://testnet.tonapi.io/v2/accounts/${address}/events?initiator=false&subject_only=false&limit=20`, {

    })
    const res = await req.json();

    return res.events
}

module.exports = {
    getTransactions
};