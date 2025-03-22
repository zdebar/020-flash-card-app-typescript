import './App.css'

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base-200">
      <button className="btn btn-primary">Click Me</button>
      <button className='btn btn-primary mt-4'>New Button</button>
      <div className="card w-96 bg-base-100 shadow-xl p-4 mt-4">
        <h2 className="card-title">Hello, DaisyUI!</h2>
        <p>This works perfectly in TypeScript.</p>
      </div>
    </div>
  );
}
