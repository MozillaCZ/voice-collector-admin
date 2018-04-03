import {Component} from 'react';

export default class Communicator extends Component {

    sendData(url, data, callback) {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then(response => response.json()).then((response) => {
            if (response.status === 'success') {
                callback('success', response);
            } else {
                callback('error', response);
            }
        }).catch(() => {
            callback('error', {});
        });
    }
}