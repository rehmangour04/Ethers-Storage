const ethers = require("ethers")
// const solc = require("solc")
const fs = require("fs")
require("dotenv").config()
async function main() {
    let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
    const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
    let wallet = new ethers.Wallet.fromEncryptedJsonSync(encryptedJson, process.env.PRIVATE_KEY_PASSWORD);
    wallet = await wallet.connect(provider);
    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    const binary = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    )
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
    console.log("Deploying, please wait...")
    const contract = await contractFactory.deploy()
    const deploymentReceipt = await contract.deployTransaction.wait(1)
    console.log(`Contract deployed to ${contract.address}`)
    let currentFavoriteNumber = await contract.retrieve()
    console.log(`Current Favorite Number: ${currentFavoriteNumber}`)
    console.log("Updating favorite number...")
    let transactionResponse = await contract.store(7)
    let transactionReceipt = await transactionResponse.wait()
    currentFavoriteNumber = await contract.retrieve()
    console.log(`New Favorite Number: ${currentFavoriteNumber}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
 