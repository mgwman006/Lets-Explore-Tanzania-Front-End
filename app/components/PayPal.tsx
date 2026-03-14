
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";
import { captureOrderPayPal, createOrderPayPal } from "../services/payPalService";

// Renders errors or successfull transactions on the screen.
type MessageProps = {
  content: string;
};

function Message({ content }: MessageProps) {
  return <p>{content}</p>;
}


const payPalClientId = import.meta.env.VITE_PAY_PAL_CLIENT_ID;
export default function PayPal()
{
    const [currency,setCurrency] = useState('USD');
    const [amount,setAmount] = useState('10');


     const initialOptions = {
        "clientId": `${payPalClientId}`,
        currency: `${currency}`,
        components: "buttons",
    };

    const [message, setMessage] = useState("");
      return (
        <div className="App">
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                   style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                   createOrder={async () => {
                    try {
                        const order = await createOrderPayPal({
                            amount: amount,
                            currency: currency,
                        });

                        return order.id;

                    } catch (error) {
                        console.error(error);
                        setMessage("Could not create order");
                        throw error;
                    }
                    }}
                   onApprove={async (data, actions) => {
                        try {
                            const orderData = await captureOrderPayPal(data.orderID);
                            // Three cases to handle:
                            //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                            //   (2) Other non-recoverable errors -> Show a failure message
                            //   (3) Successful transaction -> Show confirmation or thank you message

                            const errorDetail = orderData?.details?.[0];

                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                                return actions.restart();
                            } else if (errorDetail) {
                                // (2) Other non-recoverable errors -> Show a failure message
                                throw new Error(
                                    `${errorDetail.description} (${orderData.debug_id})`
                                );
                            } else {
                                // (3) Successful transaction -> Show confirmation or thank you message
                                // Or go to another URL:  actions.redirect('thank_you.html');
                                const transaction =
                                    orderData.purchase_units[0].payments
                                        .captures[0];
                                setMessage(
                                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                                );
                                console.log(
                                    "Capture result",
                                    orderData,
                                    JSON.stringify(orderData)
                                );
                            }
                        } catch (error) {
                            console.error(error);
                            setMessage(
                                `Sorry, your transaction could not be processed...${error}`
                            );
                        }
                    }}
                />
            </PayPalScriptProvider>
            <Message content={message} />
        </div>
    );
};