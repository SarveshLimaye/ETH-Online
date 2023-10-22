// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "./UserSide_MusicApp.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.0/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts@5.0.0/access/Ownable.sol";
import "https://github.com/tablelandnetwork/evm-tableland/blob/main/contracts/utils/TablelandDeployments.sol";
import "https://github.com/tablelandnetwork/evm-tableland/blob/main/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";


contract RecordSide_MusicApp is UserSide_MusicApp, ERC721, ERC721URIStorage, ERC721Burnable, Ownable,ERC721Holder {

    constructor(address initialOwner)
        ERC721("HarmonyToken", "HMT")
        Ownable(initialOwner)
    {}

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    uint256 public totalRecords = 1;
    mapping(uint256 => Record)public recordIdtoRecord;
    mapping(uint256 => uint256[])public userIdtoRecordsArray;   //mapping2
    mapping(uint256 => bool)public enableRecordData;
    mapping(string => Record) public searchMapping; 
    
    struct Record {
        uint256 recordId;
        string recordName;
        string description;
        uint256 publisher;  // publisher's userId (from UserSide)
        string audioURL;  // audio hash (after uploading to IPFS)
        string bannerURL; // image has for song banner
        string ipfsJsonURI; // json hash after uploading to ipfs 
    }

    function createRecord(string memory _recordName,string memory _description,string memory _audioURL,string memory _bannerURL,string memory _ipfsJsonURI) public payable {
        require(walletAddressToUserId[msg.sender] > 0 && walletAddressToUserId[msg.sender] < totalUsers,"User not registered into the system");
        uint256 _publisher = walletAddressToUserId[msg.sender];
        if(userIdtoRecordsArray[_publisher].length > 5){
            require(msg.value == 180000000000000,"You have only 5 uploads free. For uplaoding more songs, you need to pay 0.00018 ETH (0.3 USD per song)");
            Record memory r1 = Record(totalRecords,_recordName,_description,_publisher,_audioURL,_bannerURL,_ipfsJsonURI);
            safeMint(msg.sender, totalRecords,_ipfsJsonURI);
            recordIdtoRecord[totalRecords] = r1;
            userIdtoRecordsArray[_publisher].push(totalRecords); 
            searchMapping[_recordName] = r1;
            totalRecords++;
        }
        else{
            Record memory r1 = Record(totalRecords,_recordName,_description,_publisher,_audioURL,_bannerURL,_ipfsJsonURI);
            safeMint(msg.sender, totalRecords,_ipfsJsonURI);
            recordIdtoRecord[totalRecords] = r1;
            userIdtoRecordsArray[_publisher].push(totalRecords); 
            searchMapping[_recordName] = r1;
            totalRecords++;
        }
    }

    function mintAudioNFT(uint256 _tokenId,string memory _ipfsURI) public {
        require(walletAddressToUserId[msg.sender] > 0,"User is not registered into the system");
        safeMint(msg.sender,_tokenId,_ipfsURI);
    }

    function getmapping2length (uint256 _userId) public view returns(uint256){
        return userIdtoRecordsArray[_userId].length;
    }

    uint256 public _tableId;
    string private constant _TABLE_PREFIX = "cyptochord_records_table";  
    uint256 public _comments_tableId;
    string private constant _COMMENTS_TABLE_PREFIX = "cyptochord_comments_table";  
    uint256 public totalComments = 1;
    
    function createViewsTable () public payable {
        _tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "record_id integer primary key," 
                "views integer, likes integer,comments integer,ipfs_uri text", 
                _TABLE_PREFIX
            )
        );
    }

    function createCommentsTable () public payable {
        _comments_tableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "comment_id integer primary key," 
                "record_id integer, comment_body text,msg_sender text", 
                _COMMENTS_TABLE_PREFIX
            )
        );
    }

    function enableData (uint256 _recordId,string memory _ipfs_uri) public payable {
        //require(walletAddressToUserId[msg.sender] == recordIdtoRecord[_recordId].publisher,"Only record owner can call this function");
        enableRecordData[_recordId] = true;
        //string memory tableName = "records_metadata";
        //uint256 tableId = 290;
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toInsert(
                _TABLE_PREFIX,
                _tableId,
                "record_id,views,likes,comments,ipfs_uri",
                string.concat(
                    Strings.toString(_recordId), 
                    ",",
                    Strings.toString(0), //views
                    ",",
                    Strings.toString(0), //likes
                    ",",
                    Strings.toString(0), //comments
                    ",",
                    SQLHelpers.quote(_ipfs_uri) //ipfs_uri
                )
            )
        );
    }

    function addComment(uint256 _recordId,uint256 _currComments,string memory _commentBody) public payable {
        TablelandDeployments.get().mutate(
            address(this),
            _comments_tableId,
            SQLHelpers.toInsert(
                _COMMENTS_TABLE_PREFIX,
                _comments_tableId,
                "comment_id,record_id,comment_body,msg_sender",
                string.concat(
                    Strings.toString(totalComments), //comment_id
                    ",",
                    Strings.toString(_recordId), //record_id
                    ",",
                    SQLHelpers.quote(_commentBody), //comment_body
                    ",",
                    SQLHelpers.quote(Strings.toHexString(msg.sender))  //msg_sender
                )
            )
        );
        _currComments++;
        //updateComments(_recordId,_currComments);
        totalComments++;
    }

    function updateLikes (uint256 _recordId,uint256 _updatedValue) public payable {
        //uint256 tableId = 290;
        //string memory tableName = "records_metadata";
        
        string memory setters = string.concat(
            "likes=",
            Strings.toString(_updatedValue)
        );

        string memory filters = string.concat(
            "record_id=",
            Strings.toString(_recordId)
        );
        
        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toUpdate(
                _TABLE_PREFIX,
                _tableId,
                setters,
                filters
            )
        );
    }

    function updateComments (uint256 _recordId,uint256 _updatedValue) public payable {
        //uint256 tableId = 290;
        //string memory tableName = "records_metadata";
        
        string memory setters = string.concat(
            "comments=",
            Strings.toString(_updatedValue)
        );

        string memory filters = string.concat(
            "record_id=",
            Strings.toString(_recordId)
        );

        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toUpdate(
            _TABLE_PREFIX,
            _tableId,
            setters,
            filters
            )
        );
    }

    function updateViews (uint256 _recordId,uint256 _updatedValue) public payable {
        //uint256 tableId = 290;
        //string memory tableName = "records_metadata";
        
        string memory setters = string.concat(
            "views=",
            Strings.toString(_updatedValue)
        );

        string memory filters = string.concat(
            "record_id=",
            Strings.toString(_recordId)
        );

        TablelandDeployments.get().mutate(
            address(this),
            _tableId,
            SQLHelpers.toUpdate(
            _TABLE_PREFIX,
            _tableId,
            setters,
            filters
            )
        );
    }

}