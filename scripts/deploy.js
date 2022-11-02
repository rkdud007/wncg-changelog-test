const { ethers, upgrades } = require("hardhat");
require("dotenv");

async function main() {  

  const FEE_DATA = {
    maxFeePerGas : ethers.utils.parseUnits('100','gwei'),
    maxPriorityFeePerGas : ethers.utils.parseUnits('5','gwei'),
    baseFeePerGas : ethers.utils.parseUnits('20','gwei'),
  };

  // Wrap the provider so we can override fee data.
  const provider = new ethers.providers.FallbackProvider([ethers.provider], 1);
  provider.getFeeData = async () => FEE_DATA;

  const signer = new ethers.Wallet(process.env.PRI_KEY, provider);

  console.log("=== TEST Network Deployment ===");
  let start = new Date();
  const StakingRewards = await ethers.getContractFactory("StakingRewards",signer);
  console.log("Deploying StakingRewards...");
  const s = await upgrades.deployProxy(StakingRewards,
    [
      process.env.STAKEDTOKEN,       // _stakedToken
      process.env.REWARDTOKEN,       // _rewardToken
      process.env.OPERATOR,          // _operator
      process.env.REWARDSVAULT,      // _rewardsVault
      process.env.BALOPERATIONVAULT, // _balOperationVault
      process.env.BALTOKEN,          // _balToken
      process.env.BALANCERMINTER     // _balancerMinter
    ],
    {
      initializer: "initialize",
    }
  );
 
  await s.deployed();
  let end = new Date(); 
  console.log("StakingRewards deployed to:", s.address, "took", end - start, "ms");

  let start1  = new Date(); 
  const DepositToken = await ethers.getContractFactory("DepositToken", signer);
  const dt = await DepositToken.deploy(s.address);
  await dt.deployed();
  let end1 = new Date();
  console.log("DepositToken deployed to:", dt.address, "took", end1 - start1, "ms");

  let start2  = new Date(); 
  const BALRewardPool = await ethers.getContractFactory("BALRewardPool", signer);
  const bp = await BALRewardPool.deploy(dt.address, process.env.BALTOKEN, s.address);
  await bp.deployed();
  let end2 = new Date(); 
  console.log("BALRewardPool deployed to:", bp.address, "took", end2 - start2, "ms");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });