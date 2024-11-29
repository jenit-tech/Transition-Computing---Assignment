import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'

const Home = () => {
    const [checklistResults, setChecklistResults] = useState([]);
    const apiUrl = 'http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639';

   
    const fetchData = async () => {
        try {
            const response = await axios.get(apiUrl);
            const applicationData = response.data;
            checkConditions(applicationData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    
    const checkConditions = (applicationData) => {
        const results = [];

        
        const valuationFeePaid = applicationData.isValuationFeePaid === true;
        results.push({ condition: 'Valuation Fee Paid', passed: valuationFeePaid });

        
        const ukResident = applicationData.isUkResident === true;
        results.push({ condition: 'UK Resident', passed: ukResident });

        
        const riskRatingMedium = applicationData.riskRating === 'Medium';
        results.push({ condition: 'Risk Rating Medium', passed: riskRatingMedium });

        
        const loanRequired = parseFloat(applicationData.mortgage.loanRequired.replace('£', '').replace(',', ''));
        const purchasePrice = parseFloat(applicationData.mortgage.purchasePrice.replace('£', '').replace(',', ''));
        const ltv = (loanRequired / purchasePrice) * 100;
        const ltvBelow60 = ltv < 60;
        results.push({ condition: 'LTV Below 60%', passed: ltvBelow60 });

        
        setChecklistResults(results);
    };

    
    useEffect(() => {
        fetchData();
    }, []); 

    return (
        <div className='app-container'>
            <h1 className='heading'>Simple Checklist System</h1>
            <ul className='list'>
                {checklistResults.length === 0 ? (
                    <li>Loading...</li>
                ) : (
                    checklistResults.map((result, index) => (
                        <li key={index} className='list-item'>
                            {result.condition}: {result.passed ? 'Passed' : 'Failed'}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Home;
