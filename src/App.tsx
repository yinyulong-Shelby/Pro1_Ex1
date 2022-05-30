import React from 'react';
import {Themes} from "./Position/position"
import Index1 from './cpmponent/exportment1/Index1';
import Index2 from './cpmponent/exportment2/Index2';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {
  let themeIndex1 = Themes.Index1Theme
  let themeIndex2 = Themes.Index2Theme
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/index1' element={<Index1 theme={themeIndex1} themes={Themes}></Index1>}></Route>
          <Route path='/' element={<Index2 theme={themeIndex2} Themes={Themes}></Index2>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
