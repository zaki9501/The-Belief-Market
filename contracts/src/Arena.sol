// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BeliefToken.sol";
import "./FollowerRegistry.sol";

/**
 * @title Arena
 * @dev Main game contract for The Belief Market
 * Manages rounds, tracks scores, and distributes prizes
 */
contract Arena {
    // Game state
    enum GameState { NotStarted, Round1, Round2, Round3, Ended }
    GameState public gameState;
    
    // Constants
    uint256 public constant ENTRY_FEE = 1 ether; // 1 MON
    uint256 public constant PERSUASION_TAX = 5; // 5%
    uint256 public constant MAX_FOUNDERS = 10;
    
    // Prize distribution
    uint256 public constant FIRST_PLACE = 50;
    uint256 public constant SECOND_PLACE = 25;
    uint256 public constant THIRD_PLACE = 15;
    uint256 public constant ARENA_FEE = 10;
    
    // Round costs (in belief tokens)
    uint256 public constant ROUND1_PERSUADE_COST = 100 * 10**18;
    uint256 public constant ROUND2_PERSUADE_COST = 250 * 10**18;
    uint256 public constant ROUND3_PERSUADE_COST = 500 * 10**18;
    uint256 public constant FLIP_MULTIPLIER = 2; // 2x cost to flip
    
    // Founder agents
    struct Founder {
        address wallet;
        address beliefToken;
        uint256 followerCount;
        uint256 stakedFollowerCount;
        bool registered;
    }
    
    mapping(address => Founder) public founders;
    address[] public founderList;
    
    // Prize pool
    uint256 public prizePool;
    
    // Follower registry
    FollowerRegistry public followerRegistry;
    
    // Round timing
    uint256 public roundStartTime;
    uint256 public constant ROUND_DURATION = 1 hours;
    
    // Events
    event FounderRegistered(address indexed founder, address beliefToken, string beliefName);
    event RoundStarted(GameState round, uint256 startTime);
    event PersuasionAttempt(address indexed founder, uint256 npcId, bool success);
    event GameEnded(address winner, uint256 prize);
    event PrizeDistributed(address indexed founder, uint256 amount, uint256 rank);
    
    modifier onlyFounder() {
        require(founders[msg.sender].registered, "Not a registered founder");
        _;
    }
    
    modifier inRound(GameState requiredState) {
        require(gameState == requiredState, "Wrong game state");
        _;
    }
    
    constructor() {
        gameState = GameState.NotStarted;
        followerRegistry = new FollowerRegistry(address(this));
    }
    
    /**
     * @dev Register as a founder agent and create belief token
     */
    function registerFounder(
        string memory tokenName,
        string memory tokenSymbol,
        string memory beliefId,
        string memory coreValues,
        string memory promises,
        string memory tradeoffs,
        string memory messagingStyle
    ) external payable {
        require(msg.value >= ENTRY_FEE, "Insufficient entry fee");
        require(!founders[msg.sender].registered, "Already registered");
        require(founderList.length < MAX_FOUNDERS, "Max founders reached");
        require(gameState == GameState.NotStarted, "Game already started");
        
        // Create belief token
        BeliefToken beliefToken = new BeliefToken(
            tokenName,
            tokenSymbol,
            beliefId,
            coreValues,
            promises,
            tradeoffs,
            messagingStyle,
            msg.sender,
            address(this)
        );
        
        founders[msg.sender] = Founder({
            wallet: msg.sender,
            beliefToken: address(beliefToken),
            followerCount: 0,
            stakedFollowerCount: 0,
            registered: true
        });
        
        founderList.push(msg.sender);
        prizePool += msg.value;
        
        emit FounderRegistered(msg.sender, address(beliefToken), tokenName);
    }
    
    /**
     * @dev Start the game (anyone can call once enough founders)
     */
    function startGame() external {
        require(gameState == GameState.NotStarted, "Game already started");
        require(founderList.length >= 2, "Need at least 2 founders");
        
        gameState = GameState.Round1;
        roundStartTime = block.timestamp;
        
        // Spawn initial NPCs
        followerRegistry.spawnNPCs(50);
        
        emit RoundStarted(GameState.Round1, roundStartTime);
    }
    
    /**
     * @dev Advance to next round
     */
    function advanceRound() external {
        require(block.timestamp >= roundStartTime + ROUND_DURATION, "Round not finished");
        
        if (gameState == GameState.Round1) {
            gameState = GameState.Round2;
            followerRegistry.spawnNPCs(30);
        } else if (gameState == GameState.Round2) {
            gameState = GameState.Round3;
            followerRegistry.spawnNPCs(20);
        } else if (gameState == GameState.Round3) {
            gameState = GameState.Ended;
            _distributeWinnings();
        }
        
        roundStartTime = block.timestamp;
        emit RoundStarted(gameState, roundStartTime);
    }
    
    /**
     * @dev Attempt to persuade an NPC
     */
    function persuade(uint256 npcId, bytes calldata message) external onlyFounder {
        require(gameState >= GameState.Round1 && gameState <= GameState.Round3, "Not in active round");
        
        // Get persuasion cost based on round
        uint256 cost = _getPersuasionCost();
        
        // Check if NPC already has a belief (flip cost is higher)
        address currentBelief = followerRegistry.getNPCBelief(npcId);
        if (currentBelief != address(0) && currentBelief != founders[msg.sender].beliefToken) {
            cost = cost * FLIP_MULTIPLIER;
        }
        
        // Deduct tokens from founder
        BeliefToken beliefToken = BeliefToken(founders[msg.sender].beliefToken);
        require(beliefToken.balanceOf(msg.sender) >= cost, "Insufficient belief tokens");
        
        // Transfer cost (tax goes to prize pool)
        uint256 taxAmount = (cost * PERSUASION_TAX) / 100;
        beliefToken.transferFrom(msg.sender, address(this), cost);
        
        // Attempt persuasion (uses on-chain randomness for hackathon)
        bool success = followerRegistry.attemptPersuasion(
            npcId,
            founders[msg.sender].beliefToken,
            message
        );
        
        if (success) {
            // Update follower count
            if (currentBelief != address(0)) {
                // Decrease old belief's count
                for (uint i = 0; i < founderList.length; i++) {
                    if (founders[founderList[i]].beliefToken == currentBelief) {
                        founders[founderList[i]].followerCount--;
                        break;
                    }
                }
            }
            founders[msg.sender].followerCount++;
            
            // Reward NPC with belief tokens
            beliefToken.rewardFollower(address(uint160(npcId)), 10 * 10**18);
        }
        
        emit PersuasionAttempt(msg.sender, npcId, success);
    }
    
    /**
     * @dev Get current persuasion cost
     */
    function _getPersuasionCost() internal view returns (uint256) {
        if (gameState == GameState.Round1) return ROUND1_PERSUADE_COST;
        if (gameState == GameState.Round2) return ROUND2_PERSUADE_COST;
        if (gameState == GameState.Round3) return ROUND3_PERSUADE_COST;
        return 0;
    }
    
    /**
     * @dev Distribute winnings at game end
     */
    function _distributeWinnings() internal {
        // Sort founders by follower count
        address[] memory sorted = _sortFoundersByFollowers();
        
        uint256 firstPrize = (prizePool * FIRST_PLACE) / 100;
        uint256 secondPrize = (prizePool * SECOND_PLACE) / 100;
        uint256 thirdPrize = (prizePool * THIRD_PLACE) / 100;
        
        if (sorted.length >= 1) {
            payable(sorted[0]).transfer(firstPrize);
            emit PrizeDistributed(sorted[0], firstPrize, 1);
        }
        if (sorted.length >= 2) {
            payable(sorted[1]).transfer(secondPrize);
            emit PrizeDistributed(sorted[1], secondPrize, 2);
        }
        if (sorted.length >= 3) {
            payable(sorted[2]).transfer(thirdPrize);
            emit PrizeDistributed(sorted[2], thirdPrize, 3);
        }
        
        emit GameEnded(sorted[0], firstPrize);
    }
    
    /**
     * @dev Sort founders by follower count (simple bubble sort for hackathon)
     */
    function _sortFoundersByFollowers() internal view returns (address[] memory) {
        address[] memory sorted = new address[](founderList.length);
        for (uint i = 0; i < founderList.length; i++) {
            sorted[i] = founderList[i];
        }
        
        for (uint i = 0; i < sorted.length; i++) {
            for (uint j = i + 1; j < sorted.length; j++) {
                if (founders[sorted[j]].followerCount > founders[sorted[i]].followerCount) {
                    address temp = sorted[i];
                    sorted[i] = sorted[j];
                    sorted[j] = temp;
                }
            }
        }
        
        return sorted;
    }
    
    /**
     * @dev Get game state info
     */
    function getGameInfo() external view returns (
        GameState state,
        uint256 pool,
        uint256 founderCount,
        uint256 roundStart,
        uint256 roundEnd
    ) {
        return (
            gameState,
            prizePool,
            founderList.length,
            roundStartTime,
            roundStartTime + ROUND_DURATION
        );
    }
    
    /**
     * @dev Get founder info
     */
    function getFounderInfo(address founder) external view returns (
        address beliefToken,
        uint256 followerCount,
        uint256 stakedFollowerCount
    ) {
        Founder memory f = founders[founder];
        return (f.beliefToken, f.followerCount, f.stakedFollowerCount);
    }
    
    /**
     * @dev Get all founders
     */
    function getAllFounders() external view returns (address[] memory) {
        return founderList;
    }
    
    /**
     * @dev Get leaderboard
     */
    function getLeaderboard() external view returns (
        address[] memory foundersRanked,
        uint256[] memory followerCounts
    ) {
        address[] memory sorted = _sortFoundersByFollowers();
        uint256[] memory counts = new uint256[](sorted.length);
        
        for (uint i = 0; i < sorted.length; i++) {
            counts[i] = founders[sorted[i]].followerCount;
        }
        
        return (sorted, counts);
    }
    
    receive() external payable {
        prizePool += msg.value;
    }
}


