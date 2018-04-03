import React, {Component} from 'react';
import Sentence from './components/sentence';
import Communicator from './components/communicator';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentences: [],
            currentSentence: {
                id: 0,
                sentence: '',
            },
            value: 'Načítám...',
            animate: true,
            loading: true,
            key: null,
        };

        this.communicator = new Communicator();

        /*this.communicator.sendData('https://voice.mozilla.cz:4878/api/get', {"key":"michalJeNejlepsiNaSvete"}, (status, data) => {
            if (status === 'success') {
                console.log(data.sentences);
                this.setState({
                    sentences: data.sentences,
                    loading: false,
                });
                this.nextSentence();
            }
        });*/

        this.modifySentence = this.modifySentence.bind(this);
        this.nextSentence = this.nextSentence.bind(this);
        this.rejectSentence = this.rejectSentence.bind(this);
        this.approveSentence = this.approveSentence.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    modifySentence(newSentence) {
        this.setState({
            currentSentence: {
                id: this.state.currentSentence.id,
                sentence: newSentence,
            },
            value: newSentence,
        });
    }

    rejectSentence() {
        this.communicator.sendData('https://voice.mozilla.cz:4878/api/update', {
            "key": this.state.key,
            "sentence": this.state.currentSentence.sentence,
            "status": 2,
            "id": this.state.currentSentence.id,
        }, (status, data) => {
            if (status === 'success') {
                this.nextSentence();
            }
        });
    }

    approveSentence() {
        if (this.state.key == null) {
            this.setState({
                key: this.state.currentSentence.sentence,
            });
            setTimeout(() => {
                this.nextSentence();
            }, 300);
        } else {
            this.communicator.sendData('https://voice.mozilla.cz:4878/api/update', {
                "key": this.state.key,
                "sentence": this.state.currentSentence.sentence,
                "status": 1,
                "id": this.state.currentSentence.id,
            }, (status, data) => {
                if (status === 'success') {
                    this.nextSentence();
                }
            });
            this.setState({
                animate: false,
            });
        }
    }

    nextSentence() {
        // send to server;
        if (this.state.sentences.length === 0) {
            this.setState({
                loading: true,
                animate: true,
            });
            this.communicator.sendData('https://voice.mozilla.cz:4878/api/get', {"key": this.state.key}, (status, data) => {
                switch (status) {
                    case 'success':
                        console.log(data.sentences);
                        this.setState({
                            sentences: data.sentences,
                            loading: false,
                        });
                        this.nextSentence();
                        break;
                }
            });
        } else {
            this.setState({
                animate: false,
            });
            setTimeout(() => {
                this.setState({
                    animate: true,
                });
            }, 100);
            const oldSentences = this.state.sentences;
            console.log(oldSentences[0]);
            let sentences = this.state.sentences;
            this.setState({
                currentSentence: oldSentences[0],
            });
            sentences.shift();
            this.setState({
                sentences: sentences,
            });
        }
    }

    handleKeyPress(event) {
        if (event.key === 'Escape') {
            this.rejectSentence();
        } else if (event.key === 'Enter') {
            this.approveSentence();
        }
    }

    render() {
        return (
            <div className="App">
                <h1>mozilla</h1>
                <input placeholder={(this.state.key == null ? 'Klíč' : '')} onKeyDown={this.handleKeyPress}
                       className={this.state.animate ? 'animateIn' : 'animateOut'}
                       type={(this.state.key == null ? 'password' : 'text')}
                       value={this.state.loading ? (this.state.key == null ? this.state.currentSentence.sentence : 'Načítám...') : this.state.currentSentence.sentence}
                       onChange={(event) => {
                           this.modifySentence(event.target.value);
                       }}/>
                <div className="buttons">
                    <div className="button-reject" onClick={this.rejectSentence}><FontAwesomeIcon icon="times"/></div>
                    <div className="button-next" onClick={this.approveSentence}><FontAwesomeIcon icon="arrow-right"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
