// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BeliefToken
 * @dev ERC20 token representing a belief system in The Belief Market
 * Each Founder Agent mints their own belief token when creating a belief
 */
contract BeliefToken is ERC20, Ownable {
    // Belief metadata
    string public beliefId;
    string public coreValues;
    string public promises;
    string public tradeoffs;
    string public messagingStyle;
    
    // Economics
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    uint256 public constant TREASURY_SHARE = 40; // 40%
    uint256 public constant FOLLOWER_POOL_SHARE = 30; // 30%
    uint256 public constant STAKING_POOL_SHARE = 20; // 20%
    uint256 public constant BURN_SHARE = 10; // 10%
    
    // Pools
    uint256 public treasuryBalance;
    uint256 public followerPoolBalance;
    uint256 public stakingPoolBalance;
    
    // Staking
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public stakeTimestamp;
    uint256 public totalStaked;
    
    // Arena reference
    address public arena;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount, uint256 slashAmount);
    event BeliefAdapted(string newValues, string newPromises, string newTradeoffs, string newStyle);
    
    modifier onlyArena() {
        require(msg.sender == arena, "Only arena can call");
        _;
    }
    
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _beliefId,
        string memory _coreValues,
        string memory _promises,
        string memory _tradeoffs,
        string memory _messagingStyle,
        address _founder,
        address _arena
    ) ERC20(_name, _symbol) Ownable(_founder) {
        beliefId = _beliefId;
        coreValues = _coreValues;
        promises = _promises;
        tradeoffs = _tradeoffs;
        messagingStyle = _messagingStyle;
        arena = _arena;
        
        // Distribute initial supply
        uint256 treasury = (INITIAL_SUPPLY * TREASURY_SHARE) / 100;
        uint256 followerPool = (INITIAL_SUPPLY * FOLLOWER_POOL_SHARE) / 100;
        uint256 stakingPool = (INITIAL_SUPPLY * STAKING_POOL_SHARE) / 100;
        uint256 toBurn = (INITIAL_SUPPLY * BURN_SHARE) / 100;
        
        treasuryBalance = treasury;
        followerPoolBalance = followerPool;
        stakingPoolBalance = stakingPool;
        
        _mint(address(this), treasury + followerPool + stakingPool);
        _mint(address(0xdead), toBurn); // Burn
        
        // Transfer treasury control to founder
        _transfer(address(this), _founder, treasury);
    }
    
    /**
     * @dev Stake tokens to show commitment
     */
    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        _transfer(msg.sender, address(this), amount);
        stakedBalance[msg.sender] += amount;
        stakeTimestamp[msg.sender] = block.timestamp;
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }
    
    /**
     * @dev Unstake tokens (with potential slash if defecting)
     */
    function unstake(uint256 amount, bool isDefecting) external {
        require(stakedBalance[msg.sender] >= amount, "Insufficient staked balance");
        
        uint256 slashAmount = 0;
        if (isDefecting) {
            slashAmount = (amount * 10) / 100; // 10% slash for defection
        }
        
        stakedBalance[msg.sender] -= amount;
        totalStaked -= amount;
        
        uint256 returnAmount = amount - slashAmount;
        _transfer(address(this), msg.sender, returnAmount);
        
        if (slashAmount > 0) {
            // Slashed tokens go to staking pool
            stakingPoolBalance += slashAmount;
        }
        
        emit Unstaked(msg.sender, returnAmount, slashAmount);
    }
    
    /**
     * @dev Reward a follower from the follower pool
     */
    function rewardFollower(address follower, uint256 amount) external onlyArena {
        require(followerPoolBalance >= amount, "Insufficient follower pool");
        followerPoolBalance -= amount;
        _transfer(address(this), follower, amount);
    }
    
    /**
     * @dev Distribute staking rewards
     */
    function distributeStakingRewards() external onlyArena {
        require(totalStaked > 0, "No stakers");
        // Rewards distributed proportionally to stakers
        // Implementation simplified for hackathon
    }
    
    /**
     * @dev Adapt belief (costs tokens, only owner/founder can call)
     */
    function adaptBelief(
        string memory _newValues,
        string memory _newPromises,
        string memory _newTradeoffs,
        string memory _newStyle
    ) external onlyOwner {
        coreValues = _newValues;
        promises = _newPromises;
        tradeoffs = _newTradeoffs;
        messagingStyle = _newStyle;
        
        emit BeliefAdapted(_newValues, _newPromises, _newTradeoffs, _newStyle);
    }
    
    /**
     * @dev Get belief metadata
     */
    function getBeliefMetadata() external view returns (
        string memory,
        string memory,
        string memory,
        string memory
    ) {
        return (coreValues, promises, tradeoffs, messagingStyle);
    }
}

