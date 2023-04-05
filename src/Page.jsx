import axios from 'axios';
import React, { Component } from 'react';

class Page extends Component {

	constructor(props) {
		super(props);
		this.state = { 
            ad_account_id: '',
            pixel_id: '',
            access_token: '',
            campaign_name: '',
            daily_budget: '',
            existing_customer_budget_percentage: '',
        }
		this.handleSubmit = this.handleSubmit.bind(this);
	}

    handleChangeAdAccount = (event) => {
        this.setState({ ad_account_id: event.target.value });
    }

    handleChangePixel = (event) => {
        this.setState({ pixel_id: event.target.value });
    }

    handleChangeAccessToken = (event) => {
        this.setState({ access_token: event.target.value });
    }

    handleChangeCampaignName = (event) => {
        this.setState({ campaign_name: event.target.value });
    }

    handleChangeDailyBudget = (event) => {
        this.setState({ daily_budget: event.target.value });
    }

    handleChangeExistingCustPer = (event) => {
        this.setState({ existing_customer_budget_percentage: event.target.value });
    }

	handleSubmit = async (event) => {
		
        const campaign_data = {
            name: this.state.campaign_name,
            objective: 'CONVERSIONS',
            status: 'PAUSED',
            smart_promotion_type: 'AUTOMATED_SHOPPING_ADS',
            access_token: this.state.access_token,
        }

		axios.post("https://graph.73242.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/campaigns",campaign_data)
			.then(response => {
				// Handle successful
                console.log(response);
                const adset_data = {
                    name: this.state.campaign_name,
                    campaign_id: '',
                    promoted_object: {
                        pixel_id: this.state.pixel_id,
                        custom_event_type: 'LEAD'
                    },
                    billing_event: 'IMPRESSIONS',
                    bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
                    lifetime_budget: 1000000,
                    end_time: '2023-12-31 23:59:59 PDT',
                    targeting: {
                        geo_locations: { countries: ['US'] }
                    },
                    access_token: this.state.access_token,
                    daily_budget: this.state.daily_budget,
                    existing_customer_budget_percentage: this.state.existing_customer_budget_percentage,
                }
                // axios.post("https://graph.73242.od.facebook.com/v16.0/act_" + this.state.ad_account_id + "/adsets",adset_data)

			})
			.catch(error => {
                // Error
                console.log("HERE")
                console.log(error)
			});
	}

	render() {
		return (
			<>
                <form className="form">
                    <div className="entry">
                        <label>Ad Account ID:</label>
                        <input type="text" name="ad_account_id" value={this.state.ad_account_id} onChange={this.handleChangeAdAccount} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Pixel ID:</label>
                        <input type="text" name="pixel_id" value={this.state.pixel_id} onChange={this.handleChangePixel} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Access Token:</label>
                        <input type="text" name="access_token" value={this.state.access_token} onChange={this.handleChangeAccessToken} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Campaign Name:</label>
                        <input type="text" name="campaign_name" value={this.state.campaign_name} onChange={this.handleChangeCampaignName} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Daily Budget:</label>
                        <input type="text" name="daily_budget" value={this.state.daily_budget} onChange={this.handleChangeDailyBudget} />
                    </div>

                    <br/><br/><br/><br/>

                    <div className="entry">
                        <label>Existing Customer Budget Percentage:</label>
                        <input type="text" name="existing_customer_budget_percentage" value={this.state.existing_customer_budget_percentage} onChange={this.handleChangeExistingCustPer} />
                    </div>

                    <br/><br/><br/><br/>

                    <button className="button">Create Campaign</button>
                </form>
			</>
		);
	}
}
export default Page;
