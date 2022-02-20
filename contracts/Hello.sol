//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;




contract Hello {


string public message= "hola mundo";

//visualizar el sms en la blockchain

function getMessage() public view returns(string memory){
    return message;
}

//envio de un mensaje en la blockchain
function setMessage(string memory _message) public{
    message=_message;
}

}