const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")
const { assert } = require("chai")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Raffle unit test", async function () {
          let raffle, vrfCoordinatorV2Mock, deployer
          const chainId = network.config.chainId
          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              raffle = await ethers.getContract("Raffle", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })
          describe("constructor", async function () {
              it("initialised the raffle correctly", async function () {
                  const raffleState = await raffle.getRaffleState()
                  const interval = await raffle.getInterval()
                  assert.equal(raffleState.toString(), "0")
                  assert.equal(interval.toString(), networkConfig[chainId]["interval"])
              })
          })
      })
