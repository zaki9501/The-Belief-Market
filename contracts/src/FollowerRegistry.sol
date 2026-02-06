// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FollowerRegistry
 * @dev Manages NPCs (simulated followers) in The Belief Market
 */
contract FollowerRegistry {
    // NPC structure
    struct NPC {
        uint256 id;
        uint8 authorityBias;    // 0-100
        uint8 fairnessBias;     // 0-100
        uint8 riskBias;         // 0-100
        uint8 optimismBias;     // 0-100
        uint8 individualismBias; // 0-100
        address currentBelief;
        uint256 conviction;     // 0-100
        uint256 conversionRound;
        bool exists;
    }
    
    // Storage
    mapping(uint256 => NPC) public npcs;
    uint256[] public npcIds;
    uint256 public npcCount;
    uint256 private nonce;
    
    // Arena reference
    address public arena;
    
    // Events
    event NPCSpawned(uint256 indexed npcId, uint8 authority, uint8 fairness, uint8 risk);
    event NPCConverted(uint256 indexed npcId, address indexed belief, uint256 conviction);
    event NPCDefected(uint256 indexed npcId, address indexed oldBelief, address indexed newBelief);
    
    modifier onlyArena() {
        require(msg.sender == arena, "Only arena can call");
        _;
    }
    
    constructor(address _arena) {
        arena = _arena;
    }
    
    /**
     * @dev Spawn new NPCs with random biases
     */
    function spawnNPCs(uint256 count) external onlyArena {
        for (uint256 i = 0; i < count; i++) {
            uint256 npcId = npcCount++;
            
            // Generate pseudo-random biases (good enough for hackathon)
            uint256 rand = uint256(keccak256(abi.encodePacked(
                block.timestamp,
                block.prevrandao,
                nonce++,
                npcId
            )));
            
            npcs[npcId] = NPC({
                id: npcId,
                authorityBias: uint8(rand % 100),
                fairnessBias: uint8((rand >> 8) % 100),
                riskBias: uint8((rand >> 16) % 100),
                optimismBias: uint8((rand >> 24) % 100),
                individualismBias: uint8((rand >> 32) % 100),
                currentBelief: address(0),
                conviction: 0,
                conversionRound: 0,
                exists: true
            });
            
            npcIds.push(npcId);
            
            emit NPCSpawned(
                npcId,
                npcs[npcId].authorityBias,
                npcs[npcId].fairnessBias,
                npcs[npcId].riskBias
            );
        }
    }
    
    /**
     * @dev Attempt to persuade an NPC
     * Returns true if successful
     */
    function attemptPersuasion(
        uint256 npcId,
        address beliefToken,
        bytes calldata message
    ) external onlyArena returns (bool) {
        require(npcs[npcId].exists, "NPC does not exist");
        
        NPC storage npc = npcs[npcId];
        
        // Calculate resonance score based on message and biases
        uint256 resonance = _calculateResonance(npcId, message);
        
        // Calculate conversion probability
        uint256 threshold = 50; // Base 50%
        
        // Adjust based on current conviction
        if (npc.currentBelief != address(0)) {
            if (npc.currentBelief == beliefToken) {
                // Already a follower, increase conviction
                npc.conviction = npc.conviction + 10 > 100 ? 100 : npc.conviction + 10;
                return true;
            }
            // Trying to flip - harder based on conviction
            threshold += npc.conviction / 2;
        }
        
        // Random roll
        uint256 roll = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            nonce++,
            npcId,
            beliefToken
        ))) % 100;
        
        // Success if resonance beats threshold and roll
        if (resonance > threshold && roll < resonance) {
            address oldBelief = npc.currentBelief;
            
            npc.currentBelief = beliefToken;
            npc.conviction = resonance / 2;
            npc.conversionRound = block.number;
            
            if (oldBelief != address(0)) {
                emit NPCDefected(npcId, oldBelief, beliefToken);
            } else {
                emit NPCConverted(npcId, beliefToken, npc.conviction);
            }
            
            return true;
        }
        
        return false;
    }
    
    /**
     * @dev Calculate resonance between message and NPC biases
     */
    function _calculateResonance(
        uint256 npcId,
        bytes calldata message
    ) internal view returns (uint256) {
        NPC storage npc = npcs[npcId];
        
        // Simple heuristic based on message hash and biases
        // In production, this would be more sophisticated
        uint256 messageHash = uint256(keccak256(message));
        
        uint256 score = 0;
        score += (messageHash % 100 < npc.authorityBias) ? 20 : 0;
        score += ((messageHash >> 8) % 100 < npc.fairnessBias) ? 20 : 0;
        score += ((messageHash >> 16) % 100 < npc.riskBias) ? 20 : 0;
        score += ((messageHash >> 24) % 100 < npc.optimismBias) ? 20 : 0;
        score += ((messageHash >> 32) % 100 < npc.individualismBias) ? 20 : 0;
        
        return score;
    }
    
    /**
     * @dev Get NPC's current belief
     */
    function getNPCBelief(uint256 npcId) external view returns (address) {
        return npcs[npcId].currentBelief;
    }
    
    /**
     * @dev Get NPC biases (revealed after interaction)
     */
    function getNPCBiases(uint256 npcId) external view returns (
        uint8 authority,
        uint8 fairness,
        uint8 risk,
        uint8 optimism,
        uint8 individualism
    ) {
        NPC storage npc = npcs[npcId];
        return (
            npc.authorityBias,
            npc.fairnessBias,
            npc.riskBias,
            npc.optimismBias,
            npc.individualismBias
        );
    }
    
    /**
     * @dev Get NPC full info
     */
    function getNPC(uint256 npcId) external view returns (
        uint8 authority,
        uint8 fairness,
        uint8 risk,
        uint8 optimism,
        uint8 individualism,
        address currentBelief,
        uint256 conviction
    ) {
        NPC storage npc = npcs[npcId];
        return (
            npc.authorityBias,
            npc.fairnessBias,
            npc.riskBias,
            npc.optimismBias,
            npc.individualismBias,
            npc.currentBelief,
            npc.conviction
        );
    }
    
    /**
     * @dev Get all NPC IDs
     */
    function getAllNPCIds() external view returns (uint256[] memory) {
        return npcIds;
    }
    
    /**
     * @dev Get followers of a belief
     */
    function getFollowersOf(address beliefToken) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < npcIds.length; i++) {
            if (npcs[npcIds[i]].currentBelief == beliefToken) {
                count++;
            }
        }
        
        uint256[] memory followers = new uint256[](count);
        uint256 idx = 0;
        for (uint i = 0; i < npcIds.length; i++) {
            if (npcs[npcIds[i]].currentBelief == beliefToken) {
                followers[idx++] = npcIds[i];
            }
        }
        
        return followers;
    }
    
    /**
     * @dev Get neutral (unconverted) NPCs
     */
    function getNeutralNPCs() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint i = 0; i < npcIds.length; i++) {
            if (npcs[npcIds[i]].currentBelief == address(0)) {
                count++;
            }
        }
        
        uint256[] memory neutrals = new uint256[](count);
        uint256 idx = 0;
        for (uint i = 0; i < npcIds.length; i++) {
            if (npcs[npcIds[i]].currentBelief == address(0)) {
                neutrals[idx++] = npcIds[i];
            }
        }
        
        return neutrals;
    }
}


