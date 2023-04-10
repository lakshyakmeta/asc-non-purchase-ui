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
            custom_event: false,
            custom_event_name: '',
        }
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    handleChangeName = (event) => {
        this.setState({ event_name: event.target.value })
        this.setState({ custom_event: event.target.value === 'OTHER'})
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

        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };

		axios.post("https://graph.71902.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/campaigns",campaign_data,{headers})
			.then(response => {
				// Handle successful
                const adset_data = {
                    name: this.state.campaign_name,
                    campaign_id: response.data.id,
                    promoted_object: {
                        pixel_id: this.state.pixel_id,
                        custom_event_type: this.state.event_name,
                        custom_event_str: this.state.custom_event_name,
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

                axios.post("https://graph.71902.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/adsets", adset_data, {headers})
                    .then(response => {
                        this.setState({ creating_campaign: 'Campaign created, please go to your Ads Manager to edit and publish.' });
                    })

			})
			.catch(error => {
                // Error
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
                        {/* <input type="text" id="event_name" value={this.state.event_name} onChange={this.handleChange} /> */}
                        <select id="event_name" value={this.state.event_name} onChange={this.handleChange}>
                            <option value="">SELECT EVENT NAME</option>
                            <option value="LEAD">LEAD</option>
                            <option value="COMPLETE_REGISTRATION">COMPLETE_REGISTRATION</option>
                            <option value="SUBSCRIBE">SUBSCRIBE</option>
                            <option value="OTHER">OTHER</option>
                        </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {this.state.event_name === 'OTHER' && <input style={{'width': '45%'}} type="text" id="custom_event_name" placeholder='Please enter the exact custom event name' value={this.state.custom_event_name} onChange={this.handleChange} /> }
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
