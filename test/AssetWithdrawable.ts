import { assert } from "chai";
import BigNumber from "bignumber.js";
import { getTransactionFee } from "./test-util";
import { AddressZero } from "@ethersproject/constants";

describe("AssetWithdrawable", () => {
  let mockContract;
  let tokenA;
  let deployer;
  before(async () => {
    const [signer1] = await ethers.getSigners();
    deployer = signer1;
    tokenA = await (await ethers.getContractFactory("MockERC20")).deploy("TokenA", "AAA", "1000000000000000000000000");
  });
  describe("withdrawAsset", () => {
    const amount = 2000;
    beforeEach(async () => {
      mockContract = await (await ethers.getContractFactory("MockAssetWithdrawable")).deploy();
    });
    describe("Native Asset", () => {
      beforeEach(async () => {
        assert.deepEqual((await mockContract.getNativeBalance()).toString(), "0");
        await deployer.sendTransaction({ to: mockContract.address, value: amount });
        assert.deepEqual((await mockContract.getNativeBalance()).toString(), amount.toString());
      });
      it("should withdraw all balance when withdrawAsset with amount 0 (ETH)", async () => {
        const balance = await deployer.getBalance();
        const transaction = await mockContract.withdrawAsset(AddressZero, 0);
        assert.deepEqual(
          (await deployer.getBalance()).toString(),
          new BigNumber(balance.toString()).plus(amount).minus(await getTransactionFee(transaction)).toString(10),
        );
        assert.deepEqual((await mockContract.getNativeBalance()).toString(), "0");
      });
      it("should withdraw when withdrawAsset for all balance (ETH)", async () => {
        const balance = await deployer.getBalance();
        const transaction = await mockContract.withdrawAsset(AddressZero, amount);
        assert.deepEqual(
          (await deployer.getBalance()).toString(),
          new BigNumber(balance.toString()).plus(amount).minus(await getTransactionFee(transaction)).toString(10),
        );
        assert.deepEqual((await mockContract.getNativeBalance()).toString(), "0");
      });
      it("should withdraw when withdrawAsset for part of balance (ETH)", async () => {
        const balance = await deployer.getBalance();
        const transaction = await mockContract.withdrawAsset(AddressZero, amount / 2);
        assert.deepEqual(
          (await deployer.getBalance()).toString(),
          new BigNumber(balance.toString()).plus(amount / 2).minus(await getTransactionFee(transaction)).toString(10),
        );
        assert.deepEqual((await mockContract.getNativeBalance()).toString(), (amount / 2).toString());
      });
    });
    describe("ERC20", () => {
      beforeEach(async () => {
        assert.deepEqual((await tokenA.balanceOf(mockContract.address)).toString(), "0");
        await tokenA.transfer(mockContract.address, amount);
      });
      it("should withdraw all balance when withdrawAsset with amount 0 (ERC20)", async () => {
        const balance = await tokenA.balanceOf(deployer.address);
        await mockContract.withdrawAsset(tokenA.address, 0);
        assert.equal(+(await tokenA.balanceOf(deployer.address)), +balance + amount);
      });
      it("should withdraw when withdrawAsset for all balance (ERC20)", async () => {
        const balance = await tokenA.balanceOf(deployer.address);
        await mockContract.withdrawAsset(tokenA.address, amount);
        assert.equal(+(await tokenA.balanceOf(deployer.address)), +balance + amount);
      });
      it("should withdraw when withdrawAsset for part of balance (ERC20)", async () => {
        const balance = await tokenA.balanceOf(deployer.address);
        await mockContract.withdrawAsset(tokenA.address, amount / 2);
        assert.equal(+(await tokenA.balanceOf(deployer.address)), +balance + amount / 2);
      });
    });
  });
});
