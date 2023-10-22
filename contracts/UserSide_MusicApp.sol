// SPDX-License-Identifier: MIT

pragma solidity >=0.8.2 <0.9.0;

contract UserSide_MusicApp{

    uint256 public totalUsers = 1;
    mapping(uint256 => string[])public userIdtoIntrests; // mapping1
    mapping(uint256 => User)public userIdtoUser;
    mapping(address => uint256)public walletAddressToUserId;

    struct User{
        uint256 userId;
        string name;
        string nickName;
        string description;
        string profileImg;
        string email;
        address walletAddress;
    }

    // create user
    function createUser (string memory _name,string memory _nickName,string memory _description,string memory _profileImg,string memory _email) public {
        require(walletAddressToUserId[msg.sender] == 0,"User with this wallet address is already registered into the system");
        User memory u1 = User(totalUsers,_name,_nickName,_description,_profileImg,_email,msg.sender);
        userIdtoUser[totalUsers] = u1;
        walletAddressToUserId[msg.sender] = totalUsers;
        totalUsers++;
    }

    // update user
    function updateUser(string memory _name,string memory _nickName,string memory _description,string memory _profileImg) public {
        uint256 tempUserId = walletAddressToUserId[msg.sender];
        userIdtoUser[tempUserId].name = _name;
        userIdtoUser[tempUserId].nickName = _nickName;
        userIdtoUser[tempUserId].description = _description;
        userIdtoUser[tempUserId].profileImg = _profileImg;
    }

    function captureUserIntrests(uint256 _userId,string memory _userIntrest) public {
        userIdtoIntrests[_userId].push(_userIntrest);
    }

    function getmapping1length(uint256 _userId) public view returns(uint256){
        return userIdtoIntrests[_userId].length;
    }

}