// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetWithdrawable is Ownable {
    using SafeERC20 for IERC20;

    /**
     * @dev Withdraw ETH or ERC20 from this smart contract address
     * @param _token ERC20 address , 0 for ETH
     * 
     * @notice Can only be called by the owner.
     */
    function withdrawAsset(address _token, uint256 _amount) external payable onlyOwner {
        if (_token == address(0)) {
            uint256 balance = address(this).balance;
            if (balance > 0) {
                if (_amount == 0) {
                    (bool sent, ) = payable(msg.sender).call{value: balance}("");
                    require(sent, "AssetWithdrawable:withdrawAsset: Failed to send Ether");
                } else {
                    (bool sent, ) = payable(msg.sender).call{value: _amount}("");
                    require(sent, "AssetWithdrawable:withdrawAsset: Failed to send Ether");
                }
            }
        } else {
            uint256 balance = IERC20(_token).balanceOf(address(this));

            if (_amount == 0) {
                _amount = balance;
            }
            IERC20(_token).transfer(owner(), _amount);
        }
    }
}
