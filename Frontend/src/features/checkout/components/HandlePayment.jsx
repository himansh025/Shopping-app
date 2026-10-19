export function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function displayRazorpay({ amount = 100, name = "Customer", email = "customer@example.com" } = {}) {
  const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

  if (!res) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const isDev = import.meta.env.DEV;
  const options = {
    key: isDev ? 'rzp_test_uGoq5ABJztRAhk' : (import.meta.env.VITE_RAZORPAY_KEY || 'PRODUCTION_KEY'),
    currency: 'INR',
    amount: (amount * 100).toString(),
    name: 'ShopNow',
    description: 'Order Payment',
    handler: function (response) {
      alert(`Payment ID: ${response.razorpay_payment_id}`);
    },
    prefill: {
      name,
      email,
      contact: '9899999999',
    },
  };
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
}

export default displayRazorpay;
