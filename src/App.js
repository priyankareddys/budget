import './App.css';
import Tree from './pages/Tree';
import createRowData from './helpers/createRowData'


function App() {
  return (
    <div className="App">
      <Tree rows={createRowData(50)} />  
    </div>
  );
}
export default App;
