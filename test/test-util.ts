const BigNumber = require("bignumber.js");

export async function getTransactionFee (transaction: ethers.Transaction) {
  const transactionReceipt = await (transaction).wait();
  return new BigNumber(transaction.gasPrice.toString()).multipliedBy(
    transactionReceipt.gasUsed.toString(),
  ).toString(10);
}
