const { verify } = require("../utils/verify");
const  { network} = require("hardhat");
const {developmentNetworks, VRFCoordinator} = require("../helper-hardhat");

// contract constructor arguments
const KEY_HASH = "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc"
const SUBSCRIPTION_ID = "7606"
const CALLBACK_GASLIMIT = "500000"

// LOTTERY COntract address 0xEb9A1d5D364841813aF5ce1775371C875B006C5C

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy, log} = deployments
    const {deployer} = await getNamedAccounts()
    const args = [VRFCoordinator, KEY_HASH, SUBSCRIPTION_ID, CALLBACK_GASLIMIT]
    const lottery = await deploy("Lottery", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1
    })
    // checking if were on development environment before verifying on etherscan

    if(!developmentNetworks.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(lottery.address, args )
    }
    log("----------------------------------------")
}

module.exports.tags = ["all", "Lottery"]