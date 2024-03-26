//SPDX-License-Identifier: MIT


pragma solidity ^0.8.20;
import "forge-std/Script.sol";
import "../src/Swoosh.sol";
import "../test/TestERC20.sol";
contract SwooshScript is Script {
    function run() external {
        address MY_ADDRESS=0x8A39c0e68E2055B0f0b4e137d8c940b9b3442390;
        address CONTRACT_ADDRESS=0xAF36427be959C24CA7181A489a69c3Eb64Bc565C;
        address ERC20_ADDRESS=0xddF708D211E453354FE5BE80EfE3147b3634DDad;
        vm.startBroadcast();
        TestERC20 erc20 = TestERC20(ERC20_ADDRESS);
        erc20.mint(MY_ADDRESS, 2000 * 10 ** 18);
        console.log("MY BALANCE",erc20.balanceOf(ERC20_ADDRESS), "CONTRACT BALANCE", erc20.balanceOf(MY_ADDRESS));
        // erc20.mint(address(0x4CF3A5491721a07110207f2e8cC23EFD0cD0ceF6), 200000 * 10 ** 18);
        // Swoosh swoosh = Swoosh(0x39A23022abF01500ae70B0c1774D41525A266c0C);
        // swoosh.deposit(500);
        // address[] memory from = new address[](1);
        // from[0] = address(0x0615368FFDb0e41Bc081838BEef812D2eBC62626);
        // from[1] = address(0x31d5a8709bE7f3cE42efc21A72718acf1D57a890);
        // erc20.approve(address(swoosh), 10000 * 10 ** 18);
        // swoosh.deposit(5000 * 10 ** 18);
        // swoosh.deposit{value: 0.1 * 10 ** 18}();
        // swoosh.request(from, 0.001 * (10 ** 18), "Uber to EthDenver", "https://pbs.twimg.com/profile_images/1754347069534359552/SB3kuTBl_200x200.jpg");
        // swoosh.request(from, 30 * (10 ** 18), "Uber", "");
        // swoosh.request(from, 30 * (10 ** 18), "IFKYK", ""); 
        // swoosh.request(from, 30 * (10 ** 18), "tee hee hee", "");
        // swoosh.request(from, 30 * (10 ** 18), "Taco", "");
        // swoosh.request(from, 30 * (10 ** 18), "Chinese", "");
        // swoosh.request(from, 69 * (10 ** 18), "luv yall", "");
        // swoosh.request(from, 0.001 * (10 ** 18), "Uber to EthDenver", "https://pbs.twimg.com/profile_images/1754347069534359552/SB3kuTBl_200x200.jpg");
        // swoosh.request(from, 30 * (10 ** 18), "Uber", ""); 
        // swoosh.request(from, 30 * (10 ** 18), "IFKYK", "");
        // swoosh.request(from, 30 * (10 ** 18), "tee hee hee", "");
        // swoosh.request(from, 30 * (10 ** 18), "Taco", "");
        // swoosh.request(from, 30 * (10 ** 18), "Chinese", "");
        // swoosh.request(from, 69 * (10 ** 18), "luv yall", "");

  }
}  