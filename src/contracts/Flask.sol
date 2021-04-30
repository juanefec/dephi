pragma solidity ^0.5.0;

contract Flask {
    string public name;
    uint256 public postCount = 0;
    uint256 public userCount = 0;
    mapping(uint256 => Post) public posts;
    mapping(address => User) public users;

    constructor() public {
        name = "Flask";
    }

    struct Post {
        uint256 id;
        string hash;
        string text;
        uint256 timestamp;
        uint256 tipAmount;
        address payable author;
    }

    function uploadPost(string memory _mediaHash, string memory _text, uint256 _timestamp)
        public
    {
        // Make sure the post hash exists
        require(bytes(_mediaHash).length > 0);
        // Make sure post text exists
        require(bytes(_text).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment post id
        postCount++;

        // Add Image to the contract
        posts[postCount] = Post(
            postCount,
            _mediaHash,
            _text,
            _timestamp,
            0,
            msg.sender
        );

        users[msg.sender].ownedPosts.push(postCount);
    }

    function tipImageOwner(uint256 _id) public payable {
        // Make sure the id is valid
        require(_id > 0 && _id <= postCount);
        // Fetch the post
        Post memory _post = posts[_id];
        // Fetch the author
        address payable _author = _post.author;
        // Pay the author by sending them Ether
        address(_author).transfer(msg.value);
        // Increment the tip amount
        _post.tipAmount = _post.tipAmount + msg.value;
        // Update the post
        posts[_id] = _post;
    }

    struct User {
        uint256 id;
        string hash;
        string name;
        string bio;
        uint256 birthday;
        uint256 timestamp;
        address payable author;
        uint256[] ownedPosts;
    }

    function createUser(
        string memory _mediaHash,
        string memory _name,
        string memory _bio,
        uint256 _birthday,
        uint256 _timestamp
    ) public {
        // Make sure the image hash exists
        require(bytes(_mediaHash).length > 0);
        // Make sure image description exists
        require(bytes(_name).length > 0);
        // Make sure image description exists
        require(bytes(_bio).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));

        // Increment user id
        userCount++;

        uint256[] memory _ownedPosts;

        // Add User to the contract
        users[msg.sender] = User(
            userCount,
            _mediaHash,
            _name,
            _bio,
            _birthday,
            _timestamp,
            msg.sender,
            _ownedPosts
        );
    }

    function getUserPosts(address _id) external view returns (
        uint256[] memory
        ) {
      return (
          users[_id].ownedPosts
          );
  }
}
