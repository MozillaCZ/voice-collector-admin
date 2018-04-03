import React, {Component} from 'react';

export default class Sentence extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentence: props.sentence,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            sentence: nextProps.sentence,
        });
    }

    render() {
        return(
            <input type="text" value={this.state.sentence} onChange={(event) => {
                this.setState({sentence: event.target.value});
                this.props.modify(event.target.value);
            }}/>
        );
    }
}