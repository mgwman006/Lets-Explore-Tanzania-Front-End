
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { captureOrderPayPal, createOrderPayPal } from "../../services/payPalService";
import { useNavigate } from "react-router";
import PayPalOrderRequest from "../../models/payPal";

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
    const navigate = useNavigate();
    const [payload,setPayload] = useState<PayPalOrderRequest>({currency:"USD",amount:"0",referenceNumber:""});

    useEffect(() => {
        const payMentPayloadString = localStorage.getItem("payMentPayload");
        if(!payMentPayloadString) return;
        const payMentPayload = JSON.parse(payMentPayloadString);
        setPayload(payMentPayload);

    },[])


    const initialOptions = {
        "clientId": `${payPalClientId}`,
        currency: `${payload.currency}`,
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
                        const order = await createOrderPayPal(payload);
                        return order.id;

                    } catch (error:any) {
                        // if(error.response) 
                        // {
                        //     console.log(JSON.stringify(error.response));
                        //     setMessage("Could not create order 1");
                        // }
                        // else
                        // {

                        // }
                        setMessage("Could not create order ");
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
                                navigate('/pay/success');
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