const { loadFixture, setBalance } = require("@nomicfoundation/hardhat-network-helpers")
const { expect } = require("chai")
const hre = require("hardhat")
const ethers = hre.ethers

getTxCost = async (txHash) => {
    let receipt = await ethers.provider.getTransactionReceipt(txHash)
    return receipt.effectiveGasPrice.mul(receipt.gasUsed)
}

describe("Testing jackpot", function () {
    async function deployJackpotFixture() {
        const [deployer, user] = await ethers.getSigners()
        const jackpotProxyContract = await ethers.getContractFactory("JackpotProxy", deployer)
        const jackpotContract = await ethers.getContractFactory("Jackpot", deployer)

        let jackpotProxy = await jackpotProxyContract.deploy()
        let jackpot = await jackpotContract.deploy(jackpotProxy.address, {
            value: ethers.utils.parseEther("2"),
        })

        await setBalance(await user.getAddress(), ethers.utils.parseEther("1"))

        console.log(`user: ${await user.getAddress()}`)
        console.log(`deployer: ${await deployer.getAddress()}`)
        console.log(`proxy: ${await jackpotProxy.address}`)
        console.log(`jackpot: ${await jackpot.address}`)

        jackpotProxy = await jackpotProxy.connect(user)
        jackpot = await jackpot.connect(user)

        return { jackpot, jackpotProxy, user }
    }

    it("is Honeypot! (claimPrize(uint))", async function () {
        const { jackpot, jackpotProxy, user } = await loadFixture(deployJackpotFixture)

        balanceBefore = await user.getBalance()
        amount = ethers.utils.parseEther("0.2")

        tx = await jackpotProxy.claimPrize(jackpot.address, { value: amount })
        txCost = await getTxCost(tx.hash)

        balanceAfter = await user.getBalance()
        balanceDiff = amount.add(txCost)

        expect(balanceBefore, balanceAfter.add(balanceDiff)).to.be.equal
    })

    it("is jackpot! (claimPrize(uint256))", async function () {
        const { jackpot, jackpotProxy, user } = await loadFixture(deployJackpotFixture)

        balanceBefore = await user.getBalance()
        amount = ethers.utils.parseEther("0.2")

        tx = await jackpotProxy.claimPrize256(jackpot.address, { value: amount })
        txCost = await getTxCost(tx.hash)

        balanceAfter = await user.getBalance()
        balanceDiff = amount.mul(2).add(txCost)

        expect(balanceBefore, balanceAfter.add(balanceDiff)).to.be.equal
    })
})
