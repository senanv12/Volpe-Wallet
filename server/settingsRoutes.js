// server/settingsRoutes.js
const express = require('express');
const axios = require('axios');
const { translate } = require('google-translate-api-x');
const NodeCache = require('node-cache');
const router = express.Router();

const myCache = new NodeCache();

router.get('/rates', async (req, res) => {
    try {
  
        const cachedRates = myCache.get("rates");
        if (cachedRates) {
            return res.json(cachedRates);
        }

 
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/AZN');
        const data = response.data;


        const requiredCurrencies = ['AZN', 'TRY', 'USD', 'GBP', 'EUR', 'RUB'];
        
        let filteredRates = {};
        requiredCurrencies.forEach(curr => {
            filteredRates[curr] = data.rates[curr];
        });


        myCache.set("rates", filteredRates, 3600);

        res.json(filteredRates);
    } catch (error) {
        console.error("Valyuta xətası:", error.message);
    
        res.json({ AZN: 1, USD: 0.59, EUR: 0.54, TRY: 18.5, GBP: 0.46, RUB: 53.0 });
    }
});


const baseDictionary = {

    
    // Header
    nav_cards: "Cards",
    nav_transactions: "Transactions",
    nav_calculator: "Calculator",
    btn_login: "Login",
    btn_start: "Get Started",
    // MainPage
    hero_badge: "Future Digital Wallet",
    hero_title_1: "Manage your finances smartly.",
    hero_title_2: "E-Wallet",
    hero_subtitle: "All your cards in one place. Automatic management and security.",
    btn_more: "Learn More",
    stat_balance: "Total Balance",
    stat_expenses: "Monthly Expenses",
    stat_savings: "Savings Goal",
    card_holder: "CARD HOLDER",
    card_expires: "EXPIRES",
    // Calculator
    calc_title: "Credit Calculator",
    calc_desc: "Plan your finances easily.",
    input_loan: "Loan Amount",
    input_rate: "Annual Interest Rate",
    input_term: "Loan Term (months)",
    btn_calculate: "Calculate",
    res_monthly: "Monthly Payment",
    res_total: "Total Payment",
    // Common
    welcome: "Welcome",
    loading: "Loading..."
};

router.get('/translations', async (req, res) => {
    const lang = req.query.lang || 'EN'; 


    if (lang === 'EN') {
        return res.json(baseDictionary);
    }


    const cacheKey = `trans_${lang}`;
    const cachedTrans = myCache.get(cacheKey);
    if (cachedTrans) {
        return res.json(cachedTrans);
    }

    try {
        console.log(`Tərcümə edilir: EN -> ${lang}...`);
        
        const translatedDict = {};
        const keys = Object.keys(baseDictionary);
        const values = Object.values(baseDictionary);


        const result = await translate(values, { from: 'en', to: lang.toLowerCase() });


        keys.forEach((key, index) => {
            translatedDict[key] = Array.isArray(result) ? result[index].text : result.text;
        });

     
        myCache.set(cacheKey, translatedDict, 86400);

        res.json(translatedDict);

    } catch (error) {
        console.error("Tərcümə xətası:", error);
       
        res.json(baseDictionary);
    }
});

module.exports = router;