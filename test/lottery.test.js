//MOCKS WERE NOT DEPLOYED AND AS SUCH TESTING COULD NOT BE DONE ON THE LOCAL ENVIRONMENT

// const {developmentNetworks}  = require("../helper-hardhat")
// const { expect, assert } = require("chai");
// const { ethers, deployments, getNamedAccounts, network } = require("hardhat");

// !developmentNetworks.includes(network.name) ? describe.skip : 
// describe("Lottery", async function () {
//   let Lottery, deployer
// // before testing the smart contract we want to deploy it
//   beforeEach(async function() {
//     deployer = (await getNamedAccounts()).deployer
//     await deployments.fixture(["all"])
//     Lottery = await ethers.getContract("Lottery", deployer)
//   })
//   describe("startLottery",async function() {
//     const entryFee = await ethers.utils.parseEther("0.1")
//     it("checks the amount funded to be 0.1ether", async function(){
//       await assert.equal(Lottery.getMinAmount(), entryFee)
//     })
//     it("checks the player to be the deployer", async function() {
//       await Lottery.startLottery({value: entryFee})
//       const player = await Lottery.getPlayer(0)
//       await assert.equal(player, deployer)
//     })
//   } )
// });
