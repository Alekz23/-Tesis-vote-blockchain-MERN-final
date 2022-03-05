//SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.7.0;
pragma experimental ABIEncoderV2;


contract Vote {
    
    struct Voter {
        uint ci;
        bool voted;
    }

    struct Proposal {
        string name;   // short name (up to 32 bytes)
        uint voteCount; // number of accumulated votes
    }

    mapping(uint => Voter) public voters;

    Proposal[] public proposals;
    
    function AddListas(string[] memory proposalNames) public {
       for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(
                Proposal({
                    name: proposalNames[i],
                    voteCount: 0
                })
            );
        }
    }

    /** 
     * @dev Store the person who vote. And compute the count in proposals
     */
    function vote(uint _proposal, uint _ci) public {
        Voter storage sender = voters[_ci];
        require(!sender.voted, "Already voted.");
        sender.ci = _ci;
        sender.voted = true;
        proposals[_proposal].voteCount += 1;
    }


    /** 
     * @dev Computes the winning proposal taking all previous votes into account.
     * @return winningProposal_ index of winning proposal in the proposals array
     */
    function winningProposal() public view
            returns (uint winningProposal_)
    {
        uint winningVoteCount = 0;
        //Recorremos el array de listas para determinar la lista con un numero mayor de votos
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }else{
                //comprobamos si ha habido un empate entre los candidatos
                if (proposals[p].voteCount == winningVoteCount) {
                winningProposal_ = 99;
            }
            }
        }
    }


    //funcion para conocer las listas que tienen empate
     function empateLists() public view
            returns (string memory empate)
    {
        uint winningVoteCount = 0;
        uint listaMayor=0;
    
        //Recorremos el array de listas para determinar la lista con un numero mayor de votos
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                listaMayor = p;
                
            }else{
                //comprobamos si ha habido un empate entre los candidatos
                if (proposals[p].voteCount == winningVoteCount) {
                empate=string(abi.encodePacked("¡Hay un empate entre la ", proposals[listaMayor].name, " y ",proposals[p].name,"!"));
            }
            }

             
        }
    }

    /** 
     * @dev Calls winnerName() function to get the name od the proposal with the
     * highest count
     * @return winnerName_ the name of the winner
     */
    function winnerName() public view returns (string memory winnerName_)
    {

        if(winningProposal()==99){
            winnerName_=empateLists();
        }else{
            winnerName_ =string(abi.encodePacked(proposals[winningProposal()].name, "  ","  Total de votos: ", 
                    uint2str(proposals[winningProposal()].voteCount)));
        }
        
    }


function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
    
    /** 
     * @dev Calls getStats() function to get the all the proposalt at the block
     * @return proposals_ array
     */
    function getStats() public view returns (Proposal[] memory proposals_) {
        return proposals;
    }
}

