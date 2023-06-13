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
            errorRequest: false,
            errorMessage: '',
            validEntries: false,
            invalidMessage: '',
            budget_type: '',
            budget_amount: '',
            attribution_setting: '',
        }
        this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    handleChange = (event) => {
        this.setState({ [event.target.id]: event.target.value });
    }

    validateEntries = () => {
        if (this.state.ad_account_id === '' || this.state.ad_account_id === undefined || 
            this.state.pixel_id === '' || this.state.pixel_id === undefined || 
            this.state.event_name === '' || this.state.event_name === undefined || 
            this.state.access_token === '' || this.state.access_token === undefined || 
            this.state.campaign_name === '' || this.state.campaign_name === undefined || 
            this.state.budget_type === '' || this.state.budget_type === undefined || 
            this.state.budget_amount === '' || this.state.budget_amount === undefined || 
            this.state.attribution_setting === '' || this.state.attribution_setting === undefined) {
                return false;
        } else {
            return true;
        }
    }

	handleSubmit = async (event) => {
		event.preventDefault();
        if (this.validateEntries()) {
            this.setState({ validEntries: false })
            this.setState({ invalidMessage: '' })
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

            let attribution_spec;

            if (this.state.attribution_setting === '1dc_1dv') {
                attribution_spec = [
                    {
                      "event_type": "CLICK_THROUGH",
                      "window_days": 1
                    },
                    {
                      "event_type": "VIEW_THROUGH",
                      "window_days": 1
                    }
                ]
            } else if (this.state.attribution_setting === '7dc_1dv') {
                attribution_spec = [
                    {
                      "event_type": "CLICK_THROUGH",
                      "window_days": 7
                    },
                    {
                      "event_type": "VIEW_THROUGH",
                      "window_days": 1
                    }
                ]
            } else if (this.state.attribution_setting === '1dc') {
                attribution_spec = [
                    {
                      "event_type": "CLICK_THROUGH",
                      "window_days": 1
                    }
                ]
            } else if (this.state.attribution_setting === '7dc') {
                attribution_spec = [
                    {
                      "event_type": "CLICK_THROUGH",
                      "window_days": 7
                    }
                ]
            }

            axios.post("https://ridenrepair.com/asc/log", campaign_data, {headers});

            axios.post("https://graph.facebook.com/v16.0/act_" + this.state.ad_account_id + "/campaigns", campaign_data, {headers})
                .then(response => {
                    // Handle successful
                    this.setState({ errorRequest: false })
                    this.setState({ errorMessage: '' })
                    axios.post("https://ridenrepair.com/asc/log", response, {headers});

                    const adset_data = {
                        name: this.state.campaign_name,
                        campaign_id: response.data.id,
                        promoted_object: {
                            pixel_id: this.state.pixel_id,
                            custom_event_type: this.state.event_name, // 'OTHER',
                            custom_event_str: this.state.custom_event_name, // this.state.event_name,
                        },
                        attribution_spec: attribution_spec,
                        billing_event: 'IMPRESSIONS',
                        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                        optimization_goal: 'OFFSITE_CONVERSIONS',
                        end_time: '2023-12-31 23:59:59 PDT',
                        targeting: {
                            geo_locations: { countries: ['US'] }
                        },
                        access_token: this.state.access_token,
                    }

                    if (this.state.budget_type === 'DAILY') {
                        adset_data['daily_budget'] = parseInt(this.state.budget_amount) * 100
                    } else if (this.state.budget_type === 'LIFETIME') {
                        adset_data['lifetime_budget'] = parseInt(this.state.budget_amount) * 100
                    }

                    axios.post("https://ridenrepair.com/asc/log", adset_data, {headers});
                    
                    axios.post("https://graph.facebook.com/v16.0/act_" + this.state.ad_account_id + "/adsets", adset_data, {headers})
                        .then(response => {
                            this.setState({ creating_campaign: 'Campaign created, please go to your Ads Manager to edit and publish.' });
                            this.setState({ errorRequest: false })
                            this.setState({ errorMessage: '' })
                        })
                        .catch(error => {
                            // Error
                            axios.post("https://ridenrepair.com/asc/log", error, {headers});
                            axios.post("https://ridenrepair.com/asc/log", error.response.data, {headers});
                            this.setState({ errorRequest: true })
                            this.setState({ errorMessage: JSON.stringify(error.response.data) })
                        })
                })
                .catch(error => {
                    // Error
                    axios.post("https://ridenrepair.com/asc/log", error, {headers});
                    axios.post("https://ridenrepair.com/asc/log", error.response.data, {headers});
                    this.setState({ errorRequest: true })
                    this.setState({ errorMessage: JSON.stringify(error.response.data) })
                });
        } else {
            this.setState({ validEntries: true })
            this.setState({ invalidMessage: 'Please enter all the required fields...!' })
        }
	}

	render() {
		return (
			<>
                <form className="form">
                    <div className="entry">
                        <label>Ad Account ID:</label>
                        <input type="number" id="ad_account_id" value={this.state.ad_account_id} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Pixel ID:</label>
                        <input type="number" id="pixel_id" value={this.state.pixel_id} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Budget Details:</label>
                        <select style={{ 'width': '12%' }} id="budget_type" value={this.state.budget_type} onChange={this.handleChange}>
                            <option value="">SELECT BUDGET TYPE</option>
                            <option value="DAILY">Daily Budget</option>
                            <option value="LIFETIME">Lifetime Budget</option>
                        </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input style={{'width': '30%'}} type="text" id="budget_amount" placeholder='Enter your budget amount in USD' value={this.state.budget_amount} onChange={this.handleChange} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Attribution Window:</label>
                        <select style={{ 'width': '20%' }} id="attribution_setting" value={this.state.attribution_setting} onChange={this.handleChange}>
                            <option value="">SELECT ATTRIBUTION TYPE</option>
                            <option value="1dc_1dv">1 day click and 1 day view</option>
                            <option value="7dc_1dv">7 day click and 1 day view</option>
                            <option value="7dc">7 day click</option>
                            <option value="1dc">1 day click</option>
                        </select>
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Event Name:</label>
                        {/* <input type="text" id="event_name" value={this.state.event_name} onChange={this.handleChange} /> */}
                        <select style={{ 'width': '12%' }} id="event_name" value={this.state.event_name} onChange={this.handleChange}>
                            <option value="">SELECT EVENT NAME</option>
                            <option value="LEAD">LEAD</option>
                            <option value="COMPLETE_REGISTRATION">COMPLETE_REGISTRATION</option>
                            <option value="SUBSCRIBE">SUBSCRIBE</option>
                            <option value="OTHER">OTHER</option>
                        </select>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        {this.state.event_name === 'OTHER' && <input style={{'width': '30%'}} type="text" id="custom_event_name" placeholder='Copy & Paste the Custom Event Name from Events Manager' value={this.state.custom_event_name} onChange={this.handleChange} /> }
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

                    {this.state.validEntries && <p>{this.state.invalidMessage}</p>}

                    {this.state.creating_campaign && <p>{this.state.creating_campaign}</p>}

                    <button className="button" onClick={this.handleSubmit}>Create Campaign</button>

                    <br/><br/>

                    <div className='errorMessage'> 
                        {this.state.errorRequest && <p>{this.state.errorMessage}</p>}
                    </div>

                </form>
			</>
		);
	}
}
export default Page;
