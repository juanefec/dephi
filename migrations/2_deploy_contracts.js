const Flask = artifacts.require("Flask");

module.exports = function(deployer) {
  deployer.deploy(Flask);
};
