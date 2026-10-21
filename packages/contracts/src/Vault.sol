// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SecuredVault
 * @notice Demonstrates Checks-Effects-Interactions (CEI) and Reentrancy defense.
 * @dev Week 03 Deliverable for Web3 Track.
 */
contract SecuredVault {
    error InsufficientBalance();
    error TransferFailed();
    error ReentrantCall();

    mapping(address => uint256) public balances;
    uint256 private _status; // 1 = NOT_ENTERED, 2 = ENTERED

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    modifier nonReentrant() {
        if (_status == 2) revert ReentrantCall();
        _status = 2;
        _;
        _status = 1;
    }

    constructor() {
        _status = 1;
    }

    function deposit() external payable {
        if (msg.value == 0) revert InsufficientBalance();
        balances[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
    }

    /**
     * @notice Withdraws all deposited ETH following the Checks-Effects-Interactions pattern.
     */
    function withdraw() external nonReentrant {
        // 1. CHECKS
        uint256 userBalance = balances[msg.sender];
        if (userBalance == 0) revert InsufficientBalance();

        // 2. EFFECTS (State updated BEFORE external call prevents reentrancy)
        balances[msg.sender] = 0;

        // 3. INTERACTIONS
        (bool success, ) = msg.sender.call{value: userBalance}("");
        if (!success) revert TransferFailed();

        emit Withdrawn(msg.sender, userBalance);
    }

    function totalVaultBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
