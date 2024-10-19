const {mint} = require("../helpers/mintSbt");
const main = async () => {
    const minted = await mint(1, "UQBrKi-UxyCvspTDZaLWrthLmiovK326gSLSKo2vyvzLr-w9")

    console.log(minted)
}

main()