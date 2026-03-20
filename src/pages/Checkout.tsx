import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PLANS } from '../data/plans';

const BASE_DEVICES = 3;
const PRICE_PER_DEVICE = 50;
const MAX_DEVICES = 7;
 
const PAYMENT_METHODS = [
    { id: 'sbp',       label: 'СБП',       icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M19 20H20M16 20H14V17M17 17H20V14H19M14 14H16M4 17C4 16.068 4 15.602 4.152 15.234C4.35498 14.7442 4.74417 14.355 5.234 14.152C5.602 14 6.068 14 7 14C7.932 14 8.398 14 8.766 14.152C9.256 14.355 9.645 14.744 9.848 15.234C10 15.602 10 16.068 10 17C10 17.932 10 18.398 9.848 18.765C9.7476 19.0077 9.60037 19.2283 9.41472 19.4141C9.22907 19.5999 9.00863 19.7474 8.766 19.848C8.398 20 7.932 20 7 20C6.068 20 5.602 20 5.234 19.848C4.99143 19.7475 4.77102 19.6003 4.58537 19.4146C4.39972 19.229 4.25246 19.0086 4.152 18.766C4 18.398 4 17.932 4 17ZM14 7C14 6.068 14 5.602 14.152 5.234C14.355 4.74417 14.7442 4.35498 15.234 4.152C15.602 4 16.068 4 17 4C17.932 4 18.398 4 18.766 4.152C19.256 4.355 19.645 4.744 19.848 5.234C20 5.602 20 6.068 20 7C20 7.932 20 8.398 19.848 8.765C19.7476 9.00773 19.6004 9.2283 19.4147 9.41412C19.2291 9.59995 19.0086 9.74738 18.766 9.848C18.398 10 17.932 10 17 10C16.068 10 15.602 10 15.234 9.848C14.9914 9.74754 14.771 9.60028 14.5854 9.41463C14.3997 9.22898 14.2525 9.00857 14.152 8.766C14 8.398 14 7.932 14 7ZM4 7C4 6.068 4 5.602 4.152 5.234C4.35498 4.74417 4.74417 4.35498 5.234 4.152C5.602 4 6.068 4 7 4C7.932 4 8.398 4 8.766 4.152C9.256 4.355 9.645 4.744 9.848 5.234C10 5.602 10 6.068 10 7C10 7.932 10 8.398 9.848 8.765C9.7476 9.00773 9.60037 9.2283 9.41472 9.41412C9.22907 9.59995 9.00863 9.74738 8.766 9.848C8.398 10 7.932 10 7 10C6.068 10 5.602 10 5.234 9.848C4.99143 9.74754 4.77102 9.60028 4.58537 9.41463C4.39972 9.22898 4.25246 9.00857 4.152 8.766C4 8.398 4 7.932 4 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg> },
    { id: 'card',      label: 'Карта',     icon: <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 1.5C21.3978 1.5 21.7794 1.65804 22.0607 1.93934C22.342 2.22064 22.5 2.60218 22.5 3V15C22.5 15.3978 22.342 15.7794 22.0607 16.0607C21.7794 16.342 21.3978 16.5 21 16.5H3C2.60218 16.5 2.22064 16.342 1.93934 16.0607C1.65804 15.7794 1.5 15.3978 1.5 15V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H21ZM3 0C2.20435 0 1.44129 0.31607 0.87868 0.87868C0.316071 1.44129 0 2.20435 0 3L0 15C0 15.7956 0.316071 16.5587 0.87868 17.1213C1.44129 17.6839 2.20435 18 3 18H21C21.7956 18 22.5587 17.6839 23.1213 17.1213C23.6839 16.5587 24 15.7956 24 15V3C24 2.20435 23.6839 1.44129 23.1213 0.87868C22.5587 0.31607 21.7956 0 21 0H3Z" fill="white" /> <path d="M3 5.25C3 5.05109 3.07902 4.86032 3.21967 4.71967C3.36032 4.57902 3.55109 4.5 3.75 4.5H6.75C6.94891 4.5 7.13968 4.57902 7.28033 4.71967C7.42098 4.86032 7.5 5.05109 7.5 5.25V6.75C7.5 6.94891 7.42098 7.13968 7.28033 7.28033C7.13968 7.42098 6.94891 7.5 6.75 7.5H3.75C3.55109 7.5 3.36032 7.42098 3.21967 7.28033C3.07902 7.13968 3 6.94891 3 6.75V5.25ZM3 9.75C3 9.55109 3.07902 9.36032 3.21967 9.21967C3.36032 9.07902 3.55109 9 3.75 9H11.25C11.4489 9 11.6397 9.07902 11.7803 9.21967C11.921 9.36032 12 9.55109 12 9.75C12 9.94891 11.921 10.1397 11.7803 10.2803C11.6397 10.421 11.4489 10.5 11.25 10.5H3.75C3.55109 10.5 3.36032 10.421 3.21967 10.2803C3.07902 10.1397 3 9.94891 3 9.75ZM3 12.75C3 12.5511 3.07902 12.3603 3.21967 12.2197C3.36032 12.079 3.55109 12 3.75 12H5.25C5.44891 12 5.63968 12.079 5.78033 12.2197C5.92098 12.3603 6 12.5511 6 12.75C6 12.9489 5.92098 13.1397 5.78033 13.2803C5.63968 13.421 5.44891 13.5 5.25 13.5H3.75C3.55109 13.5 3.36032 13.421 3.21967 13.2803C3.07902 13.1397 3 12.9489 3 12.75ZM7.5 12.75C7.5 12.5511 7.57902 12.3603 7.71967 12.2197C7.86032 12.079 8.05109 12 8.25 12H9.75C9.94891 12 10.1397 12.079 10.2803 12.2197C10.421 12.3603 10.5 12.5511 10.5 12.75C10.5 12.9489 10.421 13.1397 10.2803 13.2803C10.1397 13.421 9.94891 13.5 9.75 13.5H8.25C8.05109 13.5 7.86032 13.421 7.71967 13.2803C7.57902 13.1397 7.5 12.9489 7.5 12.75ZM12 12.75C12 12.5511 12.079 12.3603 12.2197 12.2197C12.3603 12.079 12.5511 12 12.75 12H14.25C14.4489 12 14.6397 12.079 14.7803 12.2197C14.921 12.3603 15 12.5511 15 12.75C15 12.9489 14.921 13.1397 14.7803 13.2803C14.6397 13.421 14.4489 13.5 14.25 13.5H12.75C12.5511 13.5 12.3603 13.421 12.2197 13.2803C12.079 13.1397 12 12.9489 12 12.75ZM16.5 12.75C16.5 12.5511 16.579 12.3603 16.7197 12.2197C16.8603 12.079 17.0511 12 17.25 12H18.75C18.9489 12 19.1397 12.079 19.2803 12.2197C19.421 12.3603 19.5 12.5511 19.5 12.75C19.5 12.9489 19.421 13.1397 19.2803 13.2803C19.1397 13.421 18.9489 13.5 18.75 13.5H17.25C17.0511 13.5 16.8603 13.421 16.7197 13.2803C16.579 13.1397 16.5 12.9489 16.5 12.75Z" fill="white" /> </svg>, autofocus: true },
    { id: 'stars',     label: 'Stars',     icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M11.335 3.55016C11.545 2.90516 12.457 2.90516 12.667 3.55016L14.201 8.27316C14.2468 8.41366 14.3359 8.53606 14.4555 8.62282C14.5752 8.70959 14.7192 8.75626 14.867 8.75616H19.833C20.511 8.75616 20.793 9.62416 20.244 10.0232L16.227 12.9412C16.1074 13.0281 16.0183 13.1507 15.9727 13.2914C15.9271 13.432 15.9272 13.5835 15.973 13.7242L17.507 18.4472C17.717 19.0922 16.978 19.6272 16.43 19.2292L12.413 16.3112C12.2934 16.2242 12.1493 16.1774 12.0015 16.1774C11.8536 16.1774 11.7096 16.2242 11.59 16.3112L7.57098 19.2292C7.02298 19.6282 6.28397 19.0922 6.49397 18.4472L8.02798 13.7242C8.07377 13.5835 8.07386 13.432 8.02823 13.2914C7.9826 13.1507 7.89359 13.0281 7.77397 12.9412L3.75697 10.0232C3.20797 9.62416 3.48997 8.75616 4.16797 8.75616H9.13398C9.28176 8.75626 9.42579 8.70959 9.54542 8.62282C9.66506 8.53606 9.75416 8.41366 9.79997 8.27316L11.335 3.55016Z" fill="white" /> </svg>  },
    { id: 'cryptobot', label: 'CryptoBot', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_874_2593)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C5.37225 24 0 18.6278 0 12C0 5.37225 5.37225 0 12 0C18.6278 0 24 5.37225 24 12C24 18.6278 18.6278 24 12 24ZM13.4415 10.3448V8.57025H17.502V5.86425H6.44625V8.57025H10.5068V10.344C7.20675 10.4955 4.725 11.1495 4.725 11.9325C4.725 12.7155 7.20675 13.3687 10.5068 13.521V19.2075H13.4415V13.5195C16.7362 13.368 19.212 12.7148 19.212 11.9325C19.212 11.1502 16.7362 10.497 13.4415 10.3448ZM13.4415 13.0372V13.0358C13.359 13.0417 12.9337 13.0673 11.985 13.0673C11.2275 13.0673 10.6943 13.0448 10.5068 13.0358V13.038C7.59075 12.9098 5.41425 12.402 5.41425 11.7945C5.41425 11.1877 7.59075 10.68 10.5068 10.5495V12.5325C10.6972 12.546 11.2432 12.5782 11.9977 12.5782C12.903 12.5782 13.3568 12.5408 13.4415 12.5333V10.551C16.3515 10.6807 18.5228 11.1885 18.5228 11.7945C18.5228 12.402 16.3515 12.9082 13.4415 13.0372Z" fill="white" /> </g> <defs> <clipPath id="clip0_874_2593"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>  },
] as const;
 
type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

function parsePlanPrice(price: string): number {
    return parseInt(price.replace(/\D/g, ''), 10) || 0;
}

export default function CheckoutPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
 
    const planId = searchParams.get('plan') ?? PLANS[0].id;
    const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
    const basePrice = parsePlanPrice(plan.price);
 
    const [devices, setDevices] = useState(BASE_DEVICES);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
 
    const extraDevices = devices - BASE_DEVICES;
    const totalPrice = basePrice + extraDevices * PRICE_PER_DEVICE;
 
    const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!;
 
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDevices(Number(e.target.value));
    };
 
    const handleSubmit = () => {
        // Здесь логика оплаты
        console.log({ planId, devices, paymentMethod, totalPrice });
    };

    return (
        <div className="checkout">
            <div className="checkout__inner container">
                <h1 className="checkout__title h1">Оформление заказа</h1>
                <div className="checkout__section">
                    <div className="checkout__plan-selected">
                        <span className="checkout__plan-name">{plan.title}&nbsp;|&nbsp;∞ трафик</span>
                        <span className="checkout__plan-price">{plan.price}<span>₽</span></span>
                    </div>
                    <div className="checkout__devices">
                        <h2 className="checkout__devices-title h2">Количество устройств</h2>
                        <span className="checkout__devices-extra">
                            {extraDevices > 0
                                ? `+${extraDevices * PRICE_PER_DEVICE}₽ / ${extraDevices} шт.`
                                : `+${PRICE_PER_DEVICE}₽ / 1 шт.`
                            }
                        </span>
                        <input className="checkout__devices-slider" type="range" min={BASE_DEVICES} max={MAX_DEVICES} step={1} value={devices} onChange={handleSliderChange} />
                        <div className="checkout__devices-labels">
                            {Array.from({ length: MAX_DEVICES - BASE_DEVICES + 1 }, (_, i) => {
                                const val = BASE_DEVICES + i;
                                return (
                                    <span key={val} className={`checkout__devices-label${val === devices ? ' checkout__devices-label--active' : ''}`} onClick={() => setDevices(val)} >
                                        {val}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                    <div className="checkout__payment">
                        <h2 className="checkout__payment-title h2">Способ оплаты</h2>
                        <ul className="checkout__payment-list">
                            {PAYMENT_METHODS.map((method) => (
                                <button key={method.id} className={`checkout__payment-item ${paymentMethod === method.id ? ' checkout__payment-item--active' : ''}`} onClick={() => setPaymentMethod(method.id)} >
                                    <span className="checkout__payment-icon">{method.icon}</span>
                                    {method.label}
                                </button>
                            ))}
                        </ul>
                    </div>
                    <div className="checkout__footer">
                        <div className="checkout__total">
                            <span>Итого:</span><br />
                            <span className="checkout__total-price">{totalPrice}<span>₽</span></span>
                        </div>
                        <button className="checkout__submit button" onClick={handleSubmit}>
                            Оплатить {selectedMethod.label === 'Карта' ? 'картой' : selectedMethod.label}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}