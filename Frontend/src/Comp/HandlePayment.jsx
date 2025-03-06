async function displayRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
        alert('Razorpay SDK failed to load. Are you online?')
        return
    }

    const data = await fetch('http://localhost:1337/razorpay', { method: 'POST' }).then((t) =>
        t.json()
    )

    console.log(data)

    const options = {
        key: __DEV__ ? 'rzp_test_uGoq5ABJztRAhk' : 'PRODUCTION_KEY',
        currency: data.currency,
        amount: data.amount.toString(),
        order_id: data.id,
        name: 'Donation',
        description: 'Thank you for nothing. Please give us some money',
        image: 'http://localhost:1337/logo.svg',
        handler: function (response) {
            alert(response.razorpay_payment_id)
            alert(response.razorpay_order_id)
            alert(response.razorpay_signature)
        },
        prefill: {
            name,
            email: 'sdfdsjfh2@ndsfdf.com',
            phone_number: '9899999999'
        }
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
}
