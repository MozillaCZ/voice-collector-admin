import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import fontawesome from '@fortawesome/fontawesome';
import { faArrowRight, faTimes } from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(faArrowRight, faTimes);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
