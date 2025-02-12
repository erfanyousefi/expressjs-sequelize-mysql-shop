const {default: axios} = require("axios");
const {config} = require("dotenv");
const createHttpError = require("http-errors");
config();
async function zarinpalRequest (amount, user, description = 'خرید محصول') {
    const result = await axios.post(process.env.ZARINPAL_REQUEST_URL, {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        callback_url: process.env.ZARINPAL_CALLBACK_URL,
        amount,
        description,
        metadata: {
            email: 'example@gmail.com',
            mobile: user?.mobile
        }
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(res => res.data)
        .catch(err => {
            return err;
        });
    if (result?.data?.authority) {
        return {
            payment_url: `${process.env.ZARINPAL_GATEWAY_URL}/${result?.data?.authority}`
        };
    }
    throw createHttpError(400, "zarinpal service not available");
}

module.exports = {
    zarinpalRequest
};