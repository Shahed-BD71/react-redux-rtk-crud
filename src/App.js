import './App.css';
import PostList from './components/Job';


function App() {
  return (
    <div className="container mx-auto my-5">
      <h3 className='h3 text-center my-5'>Jobs Board</h3>
      <PostList/>
    </div>
  );
}

export default App;
