require("hardhat").ethers;

async function main () {
  const AssetWithdrawable = await ethers.getContractFactory("AssetWithdrawable");
  const contract = await AssetWithdrawable.deploy();
  await contract.deployed();
  console.log(`contract is deployed to ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
