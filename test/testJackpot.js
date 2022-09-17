const { loadFixture, setBalance } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const hre = require("hardhat")
const ethers = hre.ethers

///////////////////////////////////////////////////
/*                  CHALLENGE 0                  */
///////////////////////////////////////////////////
describe("Testing jackpot", function () {
    async function deployJackpotFixture() {
        const deployer = ethers.provider.getSigner(0)
        const user = ethers.provider.getSigner(1)
        const jackpotProxyContract = await ethers.getContractFactory("JackpotProxy", deployer)
        const jackpotContract = await ethers.getContractFactory("Jackpot", deployer)

        jackpotProxy = await jackpotProxyContract.deploy()
        jackpot = await jackpotContract.deploy(jackpotProxy.address, {
            value: ethers.utils.parseEther("2"),
        })

        // await setBalance(await user.getAddress(), ethers.utils.parseEther("0.2"));

        console.log(`user: ${await user.getAddress()}`)
        console.log(`deployer: ${await deployer.getAddress()}`)
        console.log(`proxy: ${await jackpotProxy.address}`)
        console.log(`jackpot: ${await jackpot.address}`)

        // await jackpotProxy.connect(user)
        // await jackpot.connect(user)
        

        return {jackpot, jackpotProxy, user}
    }

    it("is Honeypot!", async function () {
        const {jackpot, jackpotProxy, user} = await loadFixture(deployJackpotFixture)

        
        balanceBefore = await user.getBalance()
        await jackpotProxy.connect(user).claimPrize(jackpot.address, { value: ethers.utils.parseEther("0.2") })
        balanceAfter = await user.getBalance()
        console.log(await ethers.provider.getBalance(user.getAddress()))
        
        expect(balanceAfter < balanceBefore).to.be.true
    })

    it("is jackpot!", async function() {
        const {jackpot, jackpotProxy, user} = await loadFixture(deployJackpotFixture)

        balanceBefore = await user.getBalance()
        await jackpotProxy.connect(user).claimPrize256(jackpot.address, { value: ethers.utils.parseEther("0.2") })
        balanceAfter = await user.getBalance()

        expect(balanceAfter > balanceBefore).to.be.true
        
    })
})
