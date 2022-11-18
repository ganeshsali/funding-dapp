// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Funder {
    
    uint public numOfFunders;
    
    mapping(uint => address) private funders;

    receive() external payable{}

    function transfer() external payable{
        funders[numOfFunders] = msg.sender;
    }

    function withdraw(uint _amount) external {
        require(_amount <= 2 ether, "Cannot Wothdraw");
        payable(msg.sender).transfer(_amount);
    }
}