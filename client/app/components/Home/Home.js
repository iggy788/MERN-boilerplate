import React, { Component } from 'react';
import { getFromStorage, setFromStorage } from '../utils/storage';
import 'whatwg-fetch';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
		isLoading: true,
		token: '',
		signUpError: '',
		signUpError: '',
    };
  }
	componentDidMount() {
		const token = getFromStorage('the_main_app');
		if (token) {
			// Verify Token
			fetch('/api/account/verify?token'+token)
				.then(res => res.json())
				.then(json => {
					if (json.success) {
						this.setState({
							token,
							isLoading: false
						});
					} else {
						this.setState({
							isLoading: false
						});
					}
				});
		} else {
			this.setState({
				isLoading: false,
			});
	  }
  }

	render() {
		const {
			isLoading,
			token,
		} = this.state;

		if (isLoading) {
			return (<div><p>Loading...</p></div>);
		}

		if (!token) {
			return (
				<div>
					<p>Sign Up!</p>
				</div>
			);
    }
	return (
		<div>
			<p>Account!</p>
		</div>
    );
  }
}

export default Home;


  // GET Request Example
  /*fetch('/api/counters')
    .then(res => res.json())
    .then(json => {
  	  this.setState({
  		  counters: json
  		});
  	});*/

  // POST Request Example
  /*fetch('/api/counters', { method: 'POST' })
    .then(res => res.json())
    .then(json => {
  	let data = this.state.counters;
  	data.push(json);
  	this.setState({
  	  counters: data
  	});
    });*/

  // PUT Request Example
  /*fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
  	.then(res => res.json())
  	.then(json => {
  	this._modifyCounter(index, json);
  	});*/

  // DELETE Request Example
  /*fetch(`/api/counters/${id}`, {
	method: 'DELETE'
	})
	.then(_ => {
	this._modifyCounter(index, null);
	});*/