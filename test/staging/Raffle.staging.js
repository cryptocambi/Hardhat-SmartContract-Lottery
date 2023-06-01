const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { assert, expect } = require("chai")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit test", function () {
          let raffle, raffleEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              raffle = await ethers.getContract("Raffle", deployer)
              raffleEntranceFee = await raffle.getEntranceFee()
          })

          describe("FulfillRandomWord", function () {
              it("works with live chainlink keepers and Chainlink VRF, we get a random winner", async () => {
                  const startingTimeStamp = await raffle.getLastTimeStamp()
                  const accounts = await ethers.getSigners()
                  await new Promise(async (resolve, reject) => {
                      raffle.once("WinnerPicked", async () => {
                          console.log("Winner event as been fired!")
                      })

                      try {
                          const recentWinner = await raffle.recentWinner()
                          const raffleState = await raffle.getRaffleState()
                          const winnerEndingBalance = await accounts[0].getBalance()
                          const endingTimeStamp = await raffle.getLastTimeStamp()

                          await expect(raffle.getPlayer(0).to.be.reverted)
                          assert.equal(recentWinner.toString, accounts[0].address)
                          assert.equal(raffleState, 0)
                          assert.equal(
                              winnerEndingBalance.toString(),
                              winnerStartingBalance.add(raffleEntranceFee).toSting()
                          )
                          assert.equal(endingTimeStamp > startingTimeStamp)
                          resolve()
                      } catch (error) {
                          reject(error)
                          console.log(error)
                      }
                  })
                  await raffle.enterRaffle({ value: raffleEntranceFee })
                  const winnerStartingBalance = await accounts[0].getBalance()
              })
          })
      })
