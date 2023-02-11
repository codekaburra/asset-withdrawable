pragma solidity >=0.8.0;

import "../AssetWithdrawable.sol";

contract MockAssetWithdrawable is AssetWithdrawable {
    receive() external payable {}

    function getNativeBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
