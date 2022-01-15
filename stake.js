

// contract address on Ropsten:
const nftSAddress = '0xb70FecBBaC07bd59F0B0Ff67dA8BD93C85FcAC1E'

// add contract ABI from Remix:


const nftSABI =
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
// Using the 'load' event listener for Javascript to
// check if window.ethereum is available

window.addEventListener('load', function() {
  
  if (typeof window.ethereum !== 'undefined') {
    console.log('window.ethereum is enabled')
    if (window.ethereum.isMetaMask === true) {
      console.log('MetaMask is active')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Is Available!'

      // add in web3 here
      var web3 = new Web3(window.ethereum)

    } else {
      console.log('MetaMask is not available')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Not Available!'
      // let node = document.createTextNode('<p>MetaMask Not Available!<p>')
      // mmDetected.appendChild(node)
    }
  } else {
    console.log('window.ethereum is not found 2')
    let mmDetected = document.getElementById('mm-detected')
    mmDetected.innerHTML += '<p>MetaMask Not Available!<p>'
  }
})


var web3 = new Web3(window.ethereum)

// Grabbing the button object,  

const mmEnable = document.getElementById('mm-connect');

// since MetaMask has been detected, we know
// `ethereum` is an object, so we'll do the canonical
// MM request to connect the account. 
// 
// typically we only request access to MetaMask when we
// need the user to do something, but this is just for
// an example
 
mmEnable.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  // grab mm-current-account
  // and populate it with the current address
  var mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = 'Current Account: ' + ethereum.selectedAddress
}

// grab the button for input to a contract:

const ssSubmit = document.getElementById('ss-input-button');

ssSubmit.onclick = async () => {
  // grab value from input
  
  
  const id = document.getElementById('ss-input-id').value;
  console.log(id)
  
  try{
    var web3 = new Web3(window.ethereum)

    // instantiate smart contract instance
  
    const simpleNFT = new web3.eth.Contract(nftSABI, nftSAddress)
    simpleNFT.setProvider(window.ethereum)

    //  await simpleStorage.methods.store(ssInputValue).send({from: ethereum.selectedAddress})
    await simpleNFT.methods.createStake(id).send({from: ethereum.selectedAddress})

  }
  catch(error){
    console.log('error:', error);
  }
  

}


// get elements to stake a NFT

const ssGetStake = document.getElementById('ss-get-value')

ssGetStake.onclick = async () => {


  var web3 = new Web3(window.ethereum)

  const simpleNFT = new web3.eth.Contract(nftSABI, nftSAddress)
  simpleNFT.setProvider(window.ethereum)



  //var symbol = await simpleNFT.collectionName.call()

  // get the number of contract already minted
  
  let numberOfTokenCreated = await simpleNFT.methods.getNumberOfTokensMinted().call();
  
  // get the number of nft minted by this adress
  let numberOfTokenbyOwner = 0;
  
  
 
  var imagem = [];
  var name = [];
  var price = [];
  var id = [];
  for (let i = 1; i<= numberOfTokenCreated; i++){
	

		let tokenOwner = await simpleNFT.methods.getTokenOwner(i).call();
		
		if (tokenOwner.toUpperCase() === ethereum.selectedAddress.toUpperCase()){
			
			// get url
			let tokenMetaData = await simpleNFT.methods.getTokenMetaData(i).call();
			// get name
			let tokenName = await simpleNFT.methods.getTokenName(i).call();
			// get price
			let tokenPrice = await simpleNFT.methods.getTokenPrice(i).call();
			numberOfTokenbyOwner++;
			let tokenID = i;
			
			imagem.push(tokenMetaData);
			console.log(tokenMetaData);
			name.push(tokenName);
			console.log(tokenName);
			price.push(web3.utils.fromWei(tokenPrice,'ether'));
			console.log(tokenPrice);
			id.push(tokenID);
		
			
			
					
			// get name

			console.log('---------------------------- //  ------------------------')
			

 		}
 }
	
 	$("body #nftImg").html("");
	$(document).ready(function(){	
        var nftMinted = document.getElementById('nftImg') 
		for (var i = 1; i <= numberOfTokenbyOwner; i++) {  
			var  img = "<img src =" + imagem[i-1] + " id= "+" myid"+i+"/> <br>"; 
			var  label1 = "<label for="+"name"+">NFT Name: " + name[i-1] + "</label> <br>";
			var  label2 = "<label for="+"name"+">NFT Price: " + price[i-1] + "</label> <br>";
			var  label3 = "<label for="+"name"+">NFT ID: " + id[i-1] + "</label> <br>";
			 
			$("body #nftImg").append(label1);
			$("body #nftImg").append(label2);
			$("body #nftImg").append(label3);
			$("body #nftImg").append(img);
			console.log(img);
			
			
		}
	  
  })




  const ssDisplayValue = document.getElementById('ss-display-nft-by-contract')

  ssDisplayValue.innerHTML = 'Number of NFT Created on the contract: ' + numberOfTokenCreated

  const ssDisplayNFTAddress = document.getElementById('ss-display-nft-by-address')

  ssDisplayNFTAddress.innerHTML = 'Number of NFT Created by Address: ' + numberOfTokenbyOwner

}


// show NFT stake by the contract

const ssShowStake = document.getElementById('ss-get-staking')

ssShowStake.onclick = async () => {


 

  var web3 = new Web3(window.ethereum)

  const simpleNFT = new web3.eth.Contract(nftSABI, nftSAddress)
  simpleNFT.setProvider(window.ethereum)



  //var symbol = await simpleNFT.collectionName.call()

  // get the number of contract already minted
  
  let numberOfTokenCreated = await simpleNFT.methods.getNumberOfTokensMinted().call();
  
  // get the number of nft minted by this adress
  let numberOfTokenbyOwner = 0;
  var imagem = [];
  var name = [];
  var price = [];
  var id = [];
  for (let i = 1; i<= numberOfTokenCreated; i++){
	

	let tokenOwner = await simpleNFT.methods.getTokenOwner(i).call();
	let original = await simpleNFT.methods.getOriginalOwner(i).call();
	if ( ( tokenOwner.toUpperCase() === nftSAddress.toUpperCase() ) && ( original.toUpperCase() === ethereum.selectedAddress.toUpperCase() )){
	
		// get url
		let tokenMetaData = await simpleNFT.methods.getTokenMetaData(i).call();
		// get name
		let tokenName = await simpleNFT.methods.getTokenName(i).call();
		// get price
		let tokenPrice = await simpleNFT.methods.getTokenPrice(i).call();
			
		let tokenID = i;
		numberOfTokenbyOwner++;
			
		imagem.push(tokenMetaData);
		console.log(tokenMetaData);
		name.push(tokenName);
		console.log(tokenName);
		price.push(web3.utils.fromWei(tokenPrice,'ether'));
		console.log(tokenPrice);
		id.push(tokenID);
		
			
			
					
			// get name

			console.log('---------------------------- //  ------------------------')
			

 		}
 }
	
 	$("body #nftImg").html("");
	$(document).ready(function(){	
        var nftMinted = document.getElementById('nftImg') 
		for (var i = 1; i <= numberOfTokenbyOwner; i++) {  
			var  img = "<img src =" + imagem[i-1] + " id= "+" myid"+i+"/> <br>"; 
			var  label1 = "<label for="+"name"+">NFT Name: " + name[i-1] + "</label> <br>";
			var  label2 = "<label for="+"name"+">NFT Price: " + price[i-1] + "</label> <br>";
			var  label3 = "<label for="+"name"+">NFT ID: " + id[i-1] + "</label> <br>";
			 
			$("body #nftImg").append(label1);
			$("body #nftImg").append(label2);
			$("body #nftImg").append(label3);
			$("body #nftImg").append(img);
			console.log(img);
			
			
		}
	  
  })




  const ssDisplayValue = document.getElementById('ss-display-nft-by-contract')

  ssDisplayValue.innerHTML = 'Number of NFT Created on the contract: ' + numberOfTokenCreated

  const ssDisplayNFTAddress = document.getElementById('ss-display-nft-by-address')

  ssDisplayNFTAddress.innerHTML = 'Number of NFT Created by Address: ' + numberOfTokenbyOwner


}

