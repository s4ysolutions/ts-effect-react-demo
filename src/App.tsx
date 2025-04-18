import reactLogo from './assets/react.svg'
import githubLogo from './assets/github.svg'
import viteLogo from '/vite.svg'
import './App.css'
import useCounter from './hooks/useCounter'
import CounterError from './app/CounterError'

function App() {
  const [count, increment] = useCounter()

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://github.com/s4ysolutions/ts-effect-react-demo" target="_blank">
          <img src={githubLogo} className="logo react" alt="GitHub logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={increment}>
          {count instanceof CounterError ? count.message : `count=${count.count}`}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
