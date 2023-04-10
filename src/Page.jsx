import axios from 'axios';
import React, { Component } from 'react';

class Page extends Component {

	constructor(props) {
		super(props);
		this.state = { 
            ad_account_id: '',
            pixel_id: '',
            event_name: '',
            access_token: '',
            campaign_name: '',
            creating_campaign: '',
        }
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

	handleSubmit = async (event) => {
		event.preventDefault();
        this.setState({ creating_campaign: 'Creating campaign...please wait.' });
        const campaign_data = {
            name: this.state.campaign_name,
            objective: 'CONVERSIONS',
            status: 'PAUSED',
            special_ad_categories: ['NONE'],
            smart_promotion_type: 'AUTOMATED_SHOPPING_ADS',
            access_token: this.state.access_token,
        }
        // console.log(campaign_data)

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

		axios.post("https://graph.71902.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/campaigns",campaign_data,{headers})
			.then(response => {
				// Handle successful
                // console.log(response);
                const adset_data = {
                    name: this.state.campaign_name,
                    campaign_id: response.data.id,
                    promoted_object: {
                        pixel_id: this.state.pixel_id,
                        custom_event_type: this.state.event_name,
                    },
                    billing_event: 'IMPRESSIONS',
                    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                    lifetime_budget: 1000000,
                    end_time: '2023-12-31 23:59:59 PDT',
                    targeting: {
                        geo_locations: { countries: ['US'] }
                    },
                    access_token: this.state.access_token,
                }
                // console.log(adset_data)

                axios.post("https://graph.71902.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/adsets", adset_data, {headers})
                    .then(response => {
                        this.setState({ creating_campaign: 'Campaign created, please go to your Ads Manager to edit and publish.' });
                    })

			})
			.catch(error => {
                // Error
                // console.log("HERE")
                console.log(error)
			});
	}

	render() {
		return (
			<>
                <form className="form">
                    <div className="entry">
                        <label>Ad Account ID:</label>
                        <input type="text" id="ad_account_id" value={this.state.ad_account_id} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Pixel ID:</label>
                        <input type="text" id="pixel_id" value={this.state.pixel_id} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Event Name:</label>
                        <input type="text" id="event_name" value={this.state.event_name} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Access Token:</label>
                        <input type="text" id="access_token" value={this.state.access_token} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Campaign Name:</label>
                        <input type="text" id="campaign_name" value={this.state.campaign_name} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    {this.state.creating_campaign && <p>{this.state.creating_campaign}</p>}

                    <button className="button" onClick={this.handleSubmit}>Create Campaign</button>
                </form>
			</>
		);
	}
}
export default Page;
