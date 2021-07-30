import React, { useEffect, useState } from "react";
import "./App.css";

function calculatePosition(
  tokenAAmount: number,
  tokenBAmount: number,
  reservedTokenAAmount: number,
  reservedTokenBAmount: number,
  priceTokenAPerTokenB: number,
  requiredLPTokenAPerTokenB: number
): number[] {
  const totalAmount = tokenAAmount + priceTokenAPerTokenB * tokenBAmount;
  /**
   *
   * tokenAToPool / tokenBToPool = requiredLPTokenAPerTokenB
   * => tokenAToPool = requiredLPTokenAPerTokenB * tokenBToPool
   *
   * (reservedTokenAAmount + tokenAToPool) + (reservedTokenBAmount + tokenBToPool) * priceTokenAPerTokenB = totalAmount
   * => (reservedTokenAAmount + requiredLPTokenAPerTokenB * tokenBToPool) + (reservedTokenBAmount + tokenBToPool) * priceTokenAPerTokenB = totalAmount
   * => reservedTokenAAmount + requiredLPTokenAPerTokenB * tokenBToPool + reservedTokenBAmount * priceTokenAPerTokenB + tokenBToPool * priceTokenAPerTokenB = totalAmount
   * => tokenBToPool * (requiredLPTokenAPerTokenB + priceTokenAPerTokenB) = totalAmount - reservedTokenAAmount - reservedTokenBAmount * priceTokenAPerTokenB
   * => tokenBToPool = (totalAmount - reservedTokenAAmount - reservedTokenBAmount * priceTokenAPerTokenB) / (requiredLPTokenAPerTokenB + priceTokenAPerTokenB)
   */
  const tokenBToPool =
    (totalAmount -
      reservedTokenAAmount -
      reservedTokenBAmount * priceTokenAPerTokenB) /
    (requiredLPTokenAPerTokenB + priceTokenAPerTokenB);
  const tokenAToPool = requiredLPTokenAPerTokenB * tokenBToPool;
  return [tokenAToPool, tokenBToPool];
}

function App() {
  const [tokenAName, setTokenAName] = useState<string>("USDC");
  const [tokenBName, setTokenBName] = useState<string>("ETH");
  const [tokenAAmount, setTokenAAmount] = useState<string>("0");
  const [tokenBAmount, setTokenBAmount] = useState<string>("1");
  const [reservedTokenAAmount, setReservedTokenAAmount] = useState<string>("0");
  const [reservedTokenBAmount, setReservedTokenBAmount] =
    useState<string>("0.1");
  const [priceTokenAPerTokenB, setPriceTokenAPerTokenB] =
    useState<string>("2000");
  const [requiredLPTokenAPerTokenB, setRequiredTokenAPerTokenB] =
    useState<string>("400");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const tokenAAmount_ = parseFloat(tokenAAmount);
    const tokenBAmount_ = parseFloat(tokenBAmount);
    const reservedTokenAAmount_ = parseFloat(reservedTokenAAmount);
    const reservedTokenBAmount_ = parseFloat(reservedTokenBAmount);
    const priceTokenAPerTokenB_ = parseFloat(priceTokenAPerTokenB);
    const requiredLPTokenAPerTokenB_ = parseFloat(requiredLPTokenAPerTokenB);
    if (
      isNaN(tokenAAmount_) ||
      isNaN(tokenBAmount_) ||
      isNaN(reservedTokenAAmount_) ||
      isNaN(reservedTokenBAmount_) ||
      isNaN(priceTokenAPerTokenB_) ||
      isNaN(requiredLPTokenAPerTokenB_)
    ) {
      setMessage("");
    } else {
      const [tokenAToPool, tokenBToPool] = calculatePosition(
        tokenAAmount_,
        tokenBAmount_,
        reservedTokenAAmount_,
        reservedTokenBAmount_,
        priceTokenAPerTokenB_,
        requiredLPTokenAPerTokenB_
      );
      const putPoolMsg = `Put <span class="token-a">${tokenAToPool} <b>${tokenAName}</b></span> and <span class="token-b">${tokenBToPool} <b>${tokenBName}</b></span> to the pool.`;
      if (tokenAToPool > tokenAAmount_ - reservedTokenAAmount_) {
        setMessage(
          `Swap <span class="token-b">${
            tokenBAmount_ - reservedTokenBAmount_ - tokenBToPool
          } <b>${tokenBName}</b></span> for <span class="token-a">${
            tokenAToPool - (tokenAAmount_ - reservedTokenAAmount_)
          } <b>${tokenAName}</b></span>.<br><br>` + putPoolMsg
        );
      } else {
        setMessage(
          `Swap <span class="token-a">${
            tokenAAmount_ - reservedTokenAAmount_ - tokenAToPool
          } <b>${tokenAName}</b></span> for <span class="token-b">${
            tokenBToPool - (tokenBAmount_ - reservedTokenBAmount_)
          } <b>${tokenBName}</b></span>.<br><br>` + putPoolMsg
        );
      }
    }
  }, [
    tokenAName,
    tokenBName,
    tokenAAmount,
    tokenBAmount,
    reservedTokenAAmount,
    reservedTokenBAmount,
    priceTokenAPerTokenB,
    requiredLPTokenAPerTokenB,
  ]);

  return (
    <div className="App">
      <main>
        <h1>Uniswap V3 Position Calculator</h1>
        <div className={"row"}>
          <input
            value={tokenAName}
            onChange={(event) => setTokenAName(event.target.value)}
          ></input>{" "}
          in wallet:{" "}
          <input
            value={tokenAAmount}
            onChange={(event) => setTokenAAmount(event.target.value)}
          ></input>
        </div>
        <div className={"row"}>
          <input
            value={tokenBName}
            onChange={(event) => setTokenBName(event.target.value)}
          ></input>{" "}
          in wallet:{" "}
          <input
            value={tokenBAmount}
            onChange={(event) => setTokenBAmount(event.target.value)}
          ></input>
        </div>
        <div className={"row"}>
          Reserved <span className={"token-a"}>{tokenAName}</span>:{" "}
          <input
            value={reservedTokenAAmount}
            onChange={(event) => setReservedTokenAAmount(reservedTokenAAmount)}
          ></input>
        </div>
        <div className={"row"}>
          Reserved <span className={"token-b"}>{tokenBName}</span>:{" "}
          <input
            value={reservedTokenBAmount}
            onChange={(event) => setReservedTokenBAmount(reservedTokenBAmount)}
          ></input>
        </div>
        <div className={"row"}>
          Price of <span className={"token-a"}>{tokenAName}</span> per{" "}
          <span className={"token-b"}>{tokenBName}</span>:{" "}
          <input
            value={priceTokenAPerTokenB}
            onChange={(event) => setPriceTokenAPerTokenB(event.target.value)}
          ></input>
        </div>
        <div className={"row"}>
          Required LP of <span className={"token-a"}>{tokenAName}</span> per{" "}
          <span className={"token-b"}>{tokenBName}</span>:
          <input
            value={requiredLPTokenAPerTokenB}
            onChange={(event) => setRequiredTokenAPerTokenB(event.target.value)}
          ></input>
        </div>
        <hr style={{ marginTop: "16px", marginBottom: "32px" }}></hr>
        <div dangerouslySetInnerHTML={{ __html: message }}></div>
        <hr style={{ marginTop: "16px", marginBottom: "32px" }}></hr>
        <div>
          <h2>Useful links</h2>
          <p>
            <a
              href="https://uniswapv3.flipsidecrypto.com/"
              rel="noreferrer"
              target="_blank"
            >
              https://uniswapv3.flipsidecrypto.com/
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
