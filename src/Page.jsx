import axios from 'axios';
import React, { Component } from 'react';

class Page extends Component {

	constructor(props) {
		super(props);
		this.state = { 
            ad_account_id: '',
            pixel_id: '',
            access_token: '',
            camapign_name: '',
        }
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit = async (event) => {
		
        const data = {
            name: this.state.camapign_name,
            objective: 'CONVERSIONS',
            status: 'PAUSED',
            smart_promotion_type: 'AUTOMATED_SHOPPING_ADS',
            access_token: this.state.access_token,
        }

		axios.post("https://graph.facebook.com",data)
			.then(response => {
				// Handle successful
                
			})
			.catch(error => {
                // Error
			});
	}

	render() {
		return (
			<>
                <form class="form">
                    <div class="entry">
                        <label for="ad_account_id">Ad Account ID:</label>
                        <input type="text" name="ad_account_id" value={this.state.ad_account_id} />
                    </div>

                    <br/><br/><br/><br/>

                    <div class="entry">
                        <label for="pixel_id">Pixel ID:</label>
                        <input type="text" name="pixel_id" value={this.state.pixel_id} />
                    </div>

                    <br/><br/><br/><br/>

                    <div class="entry">
                        <label for="access_token">Access Token:</label>
                        <input type="text" name="access_token" value={this.state.access_token} />
                    </div>

                    <br/><br/><br/><br/>

                    <div class="entry">
                        <label for="campaign_name">Campaign Name:</label>
                        <input type="text" name="campaign_name" value={this.state.campaign_name} />
                    </div>

                    <br/><br/><br/><br/>

                    <button class="button">Create Campaign</button>
                </form>
			</>
		);
	}
}
export default Page;
