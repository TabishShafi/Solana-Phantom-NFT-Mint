
import './App.css';
import { Connection, Keypair,Signer, LAMPORTS_PER_SOL, clusterApiUrl ,PublicKey, Transaction, TransactionInstruction,sendAndConfirmTransaction ,SystemProgram} from '@solana/web3.js';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useWallet, WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {Token, AccountLayout , TOKEN_PROGRAM_ID, MintLayout} from '@solana/spl-token';

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  getPhantomWallet()
]


const opts = {
  preflightCommitment: "processed"
}

const network = clusterApiUrl('devnet');
const connection = new Connection(network, opts.preflightCommitment);

function App() {

  const wallet = useWallet();
  
const airdrop =async(fromWallet)=> {
    console.log("From Wallet Public Key", fromWallet.publicKey.toString());
    console.log("Requesting Airdrop");
    var fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL,
    );


    //wait for airdrop confirmation
    await connection.confirmTransaction(fromAirdropSignature);
    console.log("Airdrop Confirmed", LAMPORTS_PER_SOL.toString());

  }

  const createToken = async ()=>{

    var fromWallet = Keypair.generate();
     console.log("From Wallet Address: ", fromWallet.publicKey.toString());
    var mintWallet = Keypair.generate();
    console.log("Mint Wallet public address", mintWallet.publicKey.toString());
    
    // const mintRent = await connection.getMinimumBalanceForRentExemption(
    //   MintLayout.span,
    // );

    // var newTransaction = Token.create(
    //   TOKEN_PROGRAM_ID,
    //   fromWallet.publicKey,
    //   wallet.publicKey,
    //   wallet.publicKey,
    // )
  
      // await sleep(10000);

    // var mintWallet = Keypair.generate();
    // await airdrop(mintWallet);
    //   console.log("mint wallet public key", mintWallet.publicKey);

    let tx = new Transaction();
    tx.add(
      // create account
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: fromWallet.publicKey,
        space: MintLayout.span,
        lamports: await Token.getMinBalanceRentForExemptMint(connection),
        programId: TOKEN_PROGRAM_ID,
      }),
      // init mint
      Token.createInitMintInstruction(
        TOKEN_PROGRAM_ID, // program id, always token program id
        fromWallet.publicKey, // mint account public key
        0, // decimals
        wallet.publicKey, // mint authority (an auth to mint token)
        null // freeze authority (we use null first, the auth can let you freeze user's token account)
      ),
       // create account
     SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintWallet.publicKey,
      space: AccountLayout.span,
      lamports: await Token.getMinBalanceRentForExemptAccount(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint Account 

    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      fromWallet.publicKey,
      mintWallet.publicKey,
      wallet.publicKey,
    ),


    Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      fromWallet.publicKey,
      mintWallet.publicKey,
      wallet.publicKey,
      [],
      1
    )
    
    );
      let { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    // tx.setSigners([wallet.publicKey, fromWallet.publicKey]);
    
  
    tx.partialSign(fromWallet);
    tx.partialSign(mintWallet);


  let signed = await wallet.signTransaction(tx);
  let signature = await connection.sendRawTransaction(signed.serialize());

   
  console.log("From Wallet Public Key ", fromWallet.publicKey.toString());
  console.log("transfer transaction done signature below");
  console.log('SIGNATURE', signature);

//  let tx1 = new Transaction();
//     tx1.add(
    
//     );


//     tx1.recentBlockhash = blockhash;
//     tx1.feePayer = wallet.publicKey;
    
//     tx1.partialSign(mintWallet);


//     let signed1 = await wallet.signTransaction(tx1);
//     let signature1 = await connection.sendRawTransaction(signed1.serialize());

   
   
//     console.log("Mint account created Transaction signature below");
//     console.log('SIGNATURE', signature1);

//  let token = (await connection.getParsedAccountInfo(wallet.publicKey, "singleGossip")).value.data;
//   console.log(token);
  //   let tx2 = new Transaction();
  //   tx2.add(
     
  //   // Mint to Our Account

  //   Token.createMintToInstruction(
  //     TOKEN_PROGRAM_ID,
  //     fromWallet.publicKey,
  //     mintWallet.publSicKey,
  //     wallet.publicKey,
  //     [],
  //     1
  //   )
    
  //   );
    

  //   tx2.recentBlockhash = blockhash;
  //   tx2.feePayer = wallet.publicKey;
    
  //    tx2.partialSign(fromWallet,mintWallet);
  //  console.log("before Signature");

  //   let signed2 = await wallet.signTransaction(tx2);
  //   console.log("after Signature");
  //   let signature2 = await connection.sendRawTransaction(signed2.serialize());

   
   
  //   console.log("Nft Minted Check wallet");
  //   console.log('SIGNATURE', signature2);


  //  let tokenMintData =  await connection.getParsedAccountInfo(wallet.publicKey,
  //     "singleGossip");

  //     console.log("token Mint data returned ", tokenMintData);
    //  const newTransaction= SystemProgram.createAccount({
    //     fromPubkey: wallet.publicKey,
    //     newAccountPubkey: fromWallet.publicKey,
    //     lamports: mintRent,
    //     space: AccountLayout.span,
    //     programId: TOKEN_PROGRAM_ID,
    //   })
     
    //    console.log(newTransaction.programId.toString());


    // const mintTransaction = new Transaction().add(
    //   newTransaction
    // )

    

    // const mintTransaction =Token.createInitMintInstruction(
    //       TOKEN_PROGRAM_ID,
    //       fromWallet.publicKey,
    //       0,
    //       wallet.publicKey,
    //       null,
    //     );
  
      

  //         // Sign transaction, broadcast, and confirm
  // var signature = await sendAndConfirmTransaction(
  //   connection,
  //   mintTransaction,
  //   [fromWallet],
  //   {commitment: 'confirmed'},
  // );
  // console.log("transfer transaction done signature below");
  // // console.log('SIGNATURE', signature);
  //     var instructions = [];

  //     instructions.push(
  //       SystemProgram.transfer({
  //         fromPubkey: wallet.publicKey,
  //         toPubkey: TOKEN_PROGRAM_ID,
  //         lamports: 2300000 // 0.0023 SOL per file (paid to arweave)
  //           // await getAssetCostToStore(files),
  //       }),
  //     );

    //  instructions.push(new TransactionInstruction(
    //   SystemProgram.createAccount({
    //     fromPubkey: wallet.publicKey,
    //     newAccountPubkey: fromWallet.publicKey,
    //     lamports: mintRent,
    //     space: MintLayout.span,
    //     programId: TOKEN_PROGRAM_ID,
    //   }),)
    // ) 

    // instructions.push( new TransactionInstruction(
    //   Token.createInitMintInstruction(
    //     TOKEN_PROGRAM_ID,
    //     fromWallet,
    //     0,
    //     wallet.publicKey,
    //     null,
    //   ),
    // ));

    // var mintTransaction1 = new Transaction().add(mintTransaction);

    // console.log("Creating New Token ");
    // // console.log("Token definition", Token);
    // // var mintTransaction = new Transaction().add(instructions)
    // let { blockhash } = await connection.getRecentBlockhash();
    // mintTransaction1.recentBlockhash = blockhash;
    // mintTransaction1.feePayer = wallet.publicKey;

    // // let signed = await wallet.signTransaction(transaction);
    // // let txid = await connection.sendRawTransaction(signed.serialize());
    // // await connection.confirmTransaction(txid);
    // console.log("Transaction created");
    // var signedTransaction = await wallet.signTransaction(mintTransaction1); 
    // console.log("Transaction Signed");


    // const signature = await connection.sendRawTransaction(signedTransaction.serialize());



    // console.log("signature of Minting transaction", signature);
    // console.log(await connection.confirmTransaction(signature));
  //   var transaction = new Transaction().add(
  //   Token.createTransferInstruction(
  //     TOKEN_PROGRAM_ID,
  //     fromTokenAccount.address,
  //     toTokenAccount.address,
  //     fromWallet.publicKey,
  //     [],
  //     1,
  //   ),
  // );


    // //create new token mint
    // let mint = await Token.createMint(
    //   connection,
    //   fromWallet,
    //   fromWallet.publicKey,
    //   null,
    //   0,
    //   TOKEN_PROGRAM_ID,
    // );

   
//   //get the token account of the fromWallet Solana address, if it does not exist, create it
//   let fromTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
//     fromWallet.publicKey,
//   );

// console.log("Nft factory created");
// console.log("Minting Id ", mint);
//   // Generate a new wallet to receive newly minted token


//  //get the token account of the toWallet Solana address, if it does not exist, create it
//  var toTokenAccount = await mint.getOrCreateAssociatedAccountInfo(
//    wallet.publicKey,
//  );

//     //minting 1 new token to the "fromTokenAccount" account we just returned/created
//    await mint.mintTo(
//     fromTokenAccount.address, //who it goes to
//     fromWallet.publicKey, // minting authority
//     [], // multisig
//     1000000000, // how many
//   );
//   console.log("NFT Minted to our address");
//   console.log("Minting Authority set to Our Account");

//   await mint.setAuthority(
//     mint.publicKey,
//     null,
//     "MintTokens",
//     fromWallet.publicKey,
//     []
//   )

//   console.log("Transfer transaction instructions created");
//   // Add token transfer instructions to transaction
//   var transaction = new Transaction().add(
//     Token.createTransferInstruction(
//       TOKEN_PROGRAM_ID,
//       fromTokenAccount.address,
//       toTokenAccount.address,
//       fromWallet.publicKey,
//       [],
//       1,
//     ),
//   );

//   // Sign transaction, broadcast, and confirm
//   var signature = await sendAndConfirmTransaction(
//     connection,
//     transaction,
//     [fromWallet],
//     {commitment: 'confirmed'},
//   );
//   console.log("transfer transaction done signature below");
//   console.log('SIGNATURE', signature);
  }

  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop:'100px' }}>
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <button onClick={airdrop}>Airdrop</button>
        <button onClick={createToken}>Create Token</button>
      </div>
    );
  }
}

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider;