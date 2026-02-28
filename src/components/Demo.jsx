import { useState } from "react"
import "./Demo.css"

export default function Demo() {

  const initialSalary = 20000

  const [balance, setBalance] = useState(initialSalary)
  const [rent, setRent] = useState(0)
  const [food, setFood] = useState(0)
  const [entertainment, setEntertainment] = useState(0)
  const [savings, setSavings] = useState(0)

  const updateValue = (category, amount) => {
    if (balance - amount < 0) return

    setBalance(balance - amount)

    if (category === "rent") setRent(rent + amount)
    if (category === "food") setFood(food + amount)
    if (category === "entertainment") setEntertainment(entertainment + amount)
    if (category === "savings") setSavings(savings + amount)
  }

  const resetGame = () => {
    setBalance(initialSalary)
    setRent(0)
    setFood(0)
    setEntertainment(0)
    setSavings(0)
  }

  const savingsRate = ((savings / initialSalary) * 100).toFixed(0)

  return (
    <div className="demo-container">

      <h1>Interactive Budget Simulation</h1>

      <div className="summary">
        <div>Remaining Balance: ₹{balance}</div>
        <div>Savings Rate: {savingsRate}%</div>
      </div>

      <div className="cards">

        <div className="card">
          <h3>Rent & Utilities</h3>
          <p>₹{rent}</p>
          <button onClick={() => updateValue("rent", 2000)}>+2000</button>
        </div>

        <div className="card">
          <h3>Food & Groceries</h3>
          <p>₹{food}</p>
          <button onClick={() => updateValue("food", 1000)}>+1000</button>
        </div>

        <div className="card">
          <h3>Entertainment</h3>
          <p>₹{entertainment}</p>
          <button onClick={() => updateValue("entertainment", 500)}>+500</button>
        </div>

        <div className="card">
          <h3>Savings</h3>
          <p>₹{savings}</p>
          <button onClick={() => updateValue("savings", 1000)}>+1000</button>
        </div>

      </div>

      <button className="reset" onClick={resetGame}>
        Reset Game
      </button>

    </div>
  )
}