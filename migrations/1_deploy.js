const Staff = artifacts.require("./Staff.sol");
const Crowdsale = artifacts.require("./Crowdsale.sol");
const PromoCodes = artifacts.require("./PromoCodes.sol");
const DiscountPhases = artifacts.require("./DiscountPhases.sol");
const DiscountStructs = artifacts.require("./DiscountStructs.sol");

module.exports = function (deployer) {
    deployer.deploy(Staff)
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => deployer.deploy(DiscountPhases, Staff.address))
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => deployer.deploy(DiscountStructs, Staff.address))
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => deployer.deploy(PromoCodes, Staff.address))
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => deployer.deploy(Crowdsale,
            [
                parseInt(process.env.START_DATE),
                parseInt(process.env.CROWDSALE_START_DATE),
                parseInt(process.env.END_DATE),
                parseInt(process.env.TOKEN_DECIMALS),
                parseInt(process.env.TOKEN_RATE),
                parseInt(process.env.TOKENS_FOR_SALE_CAP) * (10 ** parseInt(process.env.TOKEN_DECIMALS)),
                parseFloat(web3.toWei(parseFloat(process.env.MIN_PURCHASE_IN_ETH), 'ether')),
                parseFloat(web3.toWei(parseFloat(process.env.MAX_INVESTOR_CONTRIBUTION_IN_ETH), 'ether')),
                parseInt(process.env.PURCHASED_TOKENS_CLAIM_DATE),
                parseInt(process.env.BONUS_TOKENS_CLAIM_DATE),
                parseInt(process.env.REFERRAL_BONUS_PERCENT)
            ],
            [
                process.env.ETH_FUNDS_WALLET,
                PromoCodes.address,
                DiscountPhases.address,
                DiscountStructs.address,
                Staff.address
            ]))
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => PromoCodes.deployed())
        .then(p => {
            console.log("PromoCodes.setCrowdsale");
            return p.setCrowdsale(Crowdsale.address)
        })
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => DiscountStructs.deployed())
        .then(d => {
            console.log("DiscountStructs.setCrowdsale");
            return d.setCrowdsale(Crowdsale.address)
        })
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => Staff.deployed())
        .then(s => {
            const staff = process.env.STAFF_ADDR;
            if (staff.length > 0) {
                console.log("Add staff", staff);
                return s.addStaff(staff);
            }
            console.log("Skip staff");
        })
        .then(() => new Promise(r => setTimeout(r, 60000)))
        .then(() => Staff.deployed())
        .then(s => {
            const owner = process.env.OWNER_ADDR;
            if (owner.length > 0) {
                console.log("Transfer ownership", owner);
                return s.transferOwnership(owner);
            }
            console.log("Skip transfer ownership");
        })
        .then(() => {
            console.log("===============================================================");
            console.log("CROWDSALE_CONTRACT_ADDRESS=" + Crowdsale.address);
            console.log("PROMO_CODES_CONTRACT_ADDRESS=" + PromoCodes.address);
            console.log("DISCOUNT_PHASES_CONTRACT_ADDRESS=" + DiscountPhases.address);
            console.log("DISCOUNT_STRUCTS_CONTRACT_ADDRESS=" + DiscountStructs.address);
            console.log("===============================================================");
            throw "finished!";
        })
        .catch((e) => console.log("error:", e));
};
