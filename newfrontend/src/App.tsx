import './App.css'

function handleClick() {
  console.log("Hello")
}

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <button className="btn btn-primary" onClick={handleClick}>Click Me</button>
      <button className='btn btn-secondary mt-4'>New Button</button>
      <div className="card w-96 bg-base-100 shadow-xl p-4 mt-4">
        <h2 className="card-title">Hello, DaisyUI!</h2>
        <p>This works perfectly in TypeScript.</p>
      </div>
    </div>
  );
}
