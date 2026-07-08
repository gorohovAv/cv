import './App.css'
import Space from './components/space'
import Sidebar from './components/sidebar'
import System from './components/system'
import Overlay from './components/overlay'

function App() {
  return (
    <div className="app">
      <Space />
      <Sidebar />
      <System />
      <Overlay />
    </div>
  )
}

export default App