import { Component } from 'solid-js';
import { PiAdapterProvider } from './py/pi.context';
import PyVersionsView from './py/py-versions';
import PiDigitsView from './py/pi-digits';

const App: Component = () => {
  return (
    <div class='text-center'>
      <h1 class='py-2 text-center text-4xl text-green-700'>
        Welcome to Pi Day 2024 with Python!
      </h1>
      <PiAdapterProvider>
        <PiDigitsView />
        <PyVersionsView />
      </PiAdapterProvider>
    </div>
  );
};

export default App;
