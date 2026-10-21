# ⛓️ Genesis Web3 & Smart Contracts Workspace

This package contains protocol-grade Foundry smart contracts for the **Web3 Engineering Track**.

## Quick Start
```bash
# 1. Run unit tests with detailed traces
forge test -vvv

# 2. Check storage slot layout and gas snapshots
forge inspect GenesisToken storageLayout
forge snapshot

# 3. Test reentrancy defense
forge test --match-test test_reentrancy_attack_reverts

# 4. Deploy to Base Sepolia
source ../../.env
forge script script/Deploy.s.sol:DeployScript --rpc-url $BASE_SEPOLIA_RPC --broadcast --verify
```
