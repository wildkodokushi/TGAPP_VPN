import { useState } from 'react';

const MIN_DEVICES = 3;
const MAX_DEVICES = 7;
const PRICE_PER_DEVICE = 50;

type Device = {
    id: string;
    name: string;
    url: string;
};

// Заглушка — замени на данные с бэка
const INITIAL_DEVICES: Device[] = [
    { id: '1', name: 'Android', url: 'https://sasat-24/7.ru/13371488228' },
    { id: '2', name: 'Windows', url: 'https://sasat-24/7.ru/13371488228' },
    { id: '3', name: 'MacOC', url: 'https://sasat-24/7.ru/13371488228' },
];

const PAYMENT_METHODS = [
    {
        id: 'sbp', label: 'СБП',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M19 20H20M16 20H14V17M17 17H20V14H19M14 14H16M4 17C4 16.068 4 15.602 4.152 15.234C4.35498 14.7442 4.74417 14.355 5.234 14.152C5.602 14 6.068 14 7 14C7.932 14 8.398 14 8.766 14.152C9.256 14.355 9.645 14.744 9.848 15.234C10 15.602 10 16.068 10 17C10 17.932 10 18.398 9.848 18.765C9.7476 19.0077 9.60037 19.2283 9.41472 19.4141C9.22907 19.5999 9.00863 19.7474 8.766 19.848C8.398 20 7.932 20 7 20C6.068 20 5.602 20 5.234 19.848C4.99143 19.7475 4.77102 19.6003 4.58537 19.4146C4.39972 19.229 4.25246 19.0086 4.152 18.766C4 18.398 4 17.932 4 17ZM14 7C14 6.068 14 5.602 14.152 5.234C14.355 4.74417 14.7442 4.35498 15.234 4.152C15.602 4 16.068 4 17 4C17.932 4 18.398 4 18.766 4.152C19.256 4.355 19.645 4.744 19.848 5.234C20 5.602 20 6.068 20 7C20 7.932 20 8.398 19.848 8.765C19.7476 9.00773 19.6004 9.2283 19.4147 9.41412C19.2291 9.59995 19.0086 9.74738 18.766 9.848C18.398 10 17.932 10 17 10C16.068 10 15.602 10 15.234 9.848C14.9914 9.74754 14.771 9.60028 14.5854 9.41463C14.3997 9.22898 14.2525 9.00857 14.152 8.766C14 8.398 14 7.932 14 7ZM4 7C4 6.068 4 5.602 4.152 5.234C4.35498 4.74417 4.74417 4.35498 5.234 4.152C5.602 4 6.068 4 7 4C7.932 4 8.398 4 8.766 4.152C9.256 4.355 9.645 4.744 9.848 5.234C10 5.602 10 6.068 10 7C10 7.932 10 8.398 9.848 8.765C9.7476 9.00773 9.60037 9.2283 9.41472 9.41412C9.22907 9.59995 9.00863 9.74738 8.766 9.848C8.398 10 7.932 10 7 10C6.068 10 5.602 10 5.234 9.848C4.99143 9.74754 4.77102 9.60028 4.58537 9.41463C4.39972 9.22898 4.25246 9.00857 4.152 8.766C4 8.398 4 7.932 4 7Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /> </svg>,
    },
    {
        id: 'card', label: 'Карта',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M21 4.5C21.3978 4.5 21.7794 4.65804 22.0607 4.93934C22.342 5.22064 22.5 5.60218 22.5 6V18C22.5 18.3978 22.342 18.7794 22.0607 19.0607C21.7794 19.342 21.3978 19.5 21 19.5H3C2.60218 19.5 2.22064 19.342 1.93934 19.0607C1.65804 18.7794 1.5 18.3978 1.5 18V6C1.5 5.60218 1.65804 5.22064 1.93934 4.93934C2.22064 4.65804 2.60218 4.5 3 4.5H21ZM3 3C2.20435 3 1.44129 3.31607 0.87868 3.87868C0.316071 4.44129 0 5.20435 0 6L0 18C0 18.7956 0.316071 19.5587 0.87868 20.1213C1.44129 20.6839 2.20435 21 3 21H21C21.7956 21 22.5587 20.6839 23.1213 20.1213C23.6839 19.5587 24 18.7956 24 18V6C24 5.20435 23.6839 4.44129 23.1213 3.87868C22.5587 3.31607 21.7956 3 21 3H3Z" fill="white" /> <path d="M3 8.25C3 8.05109 3.07902 7.86032 3.21967 7.71967C3.36032 7.57902 3.55109 7.5 3.75 7.5H6.75C6.94891 7.5 7.13968 7.57902 7.28033 7.71967C7.42098 7.86032 7.5 8.05109 7.5 8.25V9.75C7.5 9.94891 7.42098 10.1397 7.28033 10.2803C7.13968 10.421 6.94891 10.5 6.75 10.5H3.75C3.55109 10.5 3.36032 10.421 3.21967 10.2803C3.07902 10.1397 3 9.94891 3 9.75V8.25ZM3 12.75C3 12.5511 3.07902 12.3603 3.21967 12.2197C3.36032 12.079 3.55109 12 3.75 12H11.25C11.4489 12 11.6397 12.079 11.7803 12.2197C11.921 12.3603 12 12.5511 12 12.75C12 12.9489 11.921 13.1397 11.7803 13.2803C11.6397 13.421 11.4489 13.5 11.25 13.5H3.75C3.55109 13.5 3.36032 13.421 3.21967 13.2803C3.07902 13.1397 3 12.9489 3 12.75ZM3 15.75C3 15.5511 3.07902 15.3603 3.21967 15.2197C3.36032 15.079 3.55109 15 3.75 15H5.25C5.44891 15 5.63968 15.079 5.78033 15.2197C5.92098 15.3603 6 15.5511 6 15.75C6 15.9489 5.92098 16.1397 5.78033 16.2803C5.63968 16.421 5.44891 16.5 5.25 16.5H3.75C3.55109 16.5 3.36032 16.421 3.21967 16.2803C3.07902 16.1397 3 15.9489 3 15.75ZM7.5 15.75C7.5 15.5511 7.57902 15.3603 7.71967 15.2197C7.86032 15.079 8.05109 15 8.25 15H9.75C9.94891 15 10.1397 15.079 10.2803 15.2197C10.421 15.3603 10.5 15.5511 10.5 15.75C10.5 15.9489 10.421 16.1397 10.2803 16.2803C10.1397 16.421 9.94891 16.5 9.75 16.5H8.25C8.05109 16.5 7.86032 16.421 7.71967 16.2803C7.57902 16.1397 7.5 15.9489 7.5 15.75ZM12 15.75C12 15.5511 12.079 15.3603 12.2197 15.2197C12.3603 15.079 12.5511 15 12.75 15H14.25C14.4489 15 14.6397 15.079 14.7803 15.2197C14.921 15.3603 15 15.5511 15 15.75C15 15.9489 14.921 16.1397 14.7803 16.2803C14.6397 16.421 14.4489 16.5 14.25 16.5H12.75C12.5511 16.5 12.3603 16.421 12.2197 16.2803C12.079 16.1397 12 15.9489 12 15.75ZM16.5 15.75C16.5 15.5511 16.579 15.3603 16.7197 15.2197C16.8603 15.079 17.0511 15 17.25 15H18.75C18.9489 15 19.1397 15.079 19.2803 15.2197C19.421 15.3603 19.5 15.5511 19.5 15.75C19.5 15.9489 19.421 16.1397 19.2803 16.2803C19.1397 16.421 18.9489 16.5 18.75 16.5H17.25C17.0511 16.5 16.8603 16.421 16.7197 16.2803C16.579 16.1397 16.5 15.9489 16.5 15.75Z" fill="white" /> </svg>,
    },
    {
        id: 'stars', label: 'Stars',
        icon: <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M7.86818 0.48375C8.07818 -0.16125 8.99018 -0.16125 9.20018 0.48375L10.7342 5.20675C10.78 5.34725 10.8691 5.46965 10.9887 5.55642C11.1084 5.64318 11.2524 5.68985 11.4002 5.68975H16.3662C17.0442 5.68975 17.3262 6.55775 16.7772 6.95675L12.7602 9.87475C12.6406 9.9617 12.5516 10.0843 12.5059 10.225C12.4603 10.3656 12.4604 10.5171 12.5062 10.6577L14.0402 15.3807C14.2502 16.0257 13.5112 16.5608 12.9632 16.1628L8.94618 13.2447C8.82657 13.1578 8.68252 13.111 8.53468 13.111C8.38683 13.111 8.24278 13.1578 8.12318 13.2447L4.10418 16.1628C3.55618 16.5618 2.81718 16.0257 3.02718 15.3807L4.56118 10.6577C4.60698 10.5171 4.60707 10.3656 4.56144 10.225C4.5158 10.0843 4.4268 9.9617 4.30718 9.87475L0.290178 6.95675C-0.258822 6.55775 0.0231779 5.68975 0.701178 5.68975H5.66718C5.81496 5.68985 5.95899 5.64318 6.07862 5.55642C6.19826 5.46965 6.28736 5.34725 6.33318 5.20675L7.86818 0.48375Z" fill="white" /> </svg>,
    },
    {
        id: 'cryptobot', label: 'CryptoBot',
        icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_1253_2163)"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 24C5.37225 24 0 18.6278 0 12C0 5.37225 5.37225 0 12 0C18.6278 0 24 5.37225 24 12C24 18.6278 18.6278 24 12 24ZM13.4415 10.3448V8.57025H17.502V5.86425H6.44625V8.57025H10.5068V10.344C7.20675 10.4955 4.725 11.1495 4.725 11.9325C4.725 12.7155 7.20675 13.3687 10.5068 13.521V19.2075H13.4415V13.5195C16.7362 13.368 19.212 12.7148 19.212 11.9325C19.212 11.1502 16.7362 10.497 13.4415 10.3448ZM13.4415 13.0372V13.0358C13.359 13.0417 12.9337 13.0673 11.985 13.0673C11.2275 13.0673 10.6943 13.0448 10.5068 13.0358V13.038C7.59075 12.9098 5.41425 12.402 5.41425 11.7945C5.41425 11.1877 7.59075 10.68 10.5068 10.5495V12.5325C10.6972 12.546 11.2432 12.5782 11.9977 12.5782C12.903 12.5782 13.3568 12.5408 13.4415 12.5333V10.551C16.3515 10.6807 18.5228 11.1885 18.5228 11.7945C18.5228 12.402 16.3515 12.9082 13.4415 13.0372Z" fill="white" /> </g> <defs> <clipPath id="clip0_1253_2163"> <rect width="24" height="24" fill="white" /> </clipPath> </defs> </svg>,
    },
] as const;
 
type PaymentMethodId = typeof PAYMENT_METHODS[number]['id'];

const CopyIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1 20.1C18.0455 20.6133 17.7995 21.0892 17.4097 21.4323C17.0198 21.7754 16.5136 21.9608 15.998 21.95H8.002C7.48643 21.9608 6.98016 21.7754 6.59032 21.4323C6.20048 21.0892 5.9545 20.6133 5.9 20.1L5 6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const PlusIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function DeviceCard({ device, onDelete }: { device: Device; onDelete: (id: string) => void }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(device.url);
        } catch {
            const el = document.createElement('textarea');
            el.value = device.url;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <li className="devices__item">
            <div className="devices__item-info">
                <span className="devices__item-name">{device.name}</span>
                <span className="devices__item-url">{device.url}</span>
            </div>
            <div className="devices__item-actions">
                <button className={`devices__action-btn${copied ? ' devices__action-btn--copied' : ''}`} onClick={handleCopy} title={copied ? 'Скопировано!' : 'Скопировать ссылку'} >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
                <button className="devices__action-btn devices__action-btn--delete" onClick={() => onDelete(device.id)} title="Удалить устройство" >
                    <TrashIcon />
                </button>
            </div>
        </li>
    );
}

function AddDevicesModal({
    currentMax,
    onClose,
    onConfirm,
}: {
    currentMax: number;
    onClose: () => void;
    onConfirm: (newMax: number, method: PaymentMethodId) => void;
}) {
    const [selected, setSelected] = useState(currentMax);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
 
    const extraDevices = selected - currentMax;
    const totalPrice = extraDevices * PRICE_PER_DEVICE;
    const selectedLabel = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!.label;
 
    return (
        <>
            <div className="devices-modal__backdrop" onClick={onClose} />
            <div className="devices-modal">
                <h1 className="devices-modal__title h1">Покупка доп. устройств</h1>
 
                <div className="checkout__devices">
                    <h2 className="checkout__devices-title h2">Количество устройств</h2>
                    <span className="checkout__devices-extra">
                        {extraDevices > 0
                            ? `+${extraDevices * PRICE_PER_DEVICE}₽ / ${extraDevices} шт.`
                            : `+${PRICE_PER_DEVICE}₽ / 1 шт.`
                        }
                    </span>
                    <input className="checkout__devices-slider" type="range" min={currentMax} max={MAX_DEVICES} step={1} value={selected} onChange={(e) => setSelected(Number(e.target.value))} />
                    <div className="checkout__devices-labels">
                        {Array.from({ length: MAX_DEVICES - currentMax + 1 }, (_, i) => {
                            const val = currentMax + i;
                            return (
                                <span key={val} className={`checkout__devices-label ${val === selected ? ' checkout__devices-label--active' : ''}`} onClick={() => setSelected(val)} >
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
                <div className="checkout__footer devices-modal__footer">
                    <div className="checkout__total">
                        <span>Итого:</span><br />
                        <span className="checkout__total-price">{totalPrice}<span>₽</span></span>
                    </div>
                    <button className="checkout__submit button" disabled={extraDevices === 0} onClick={() => onConfirm(selected, paymentMethod)} >
                        Оплатить {selectedLabel === 'Карта' ? 'картой' : selectedLabel}
                    </button>
                </div>
            </div>
        </>
    );
}

export default function DevicesPage() {
    const [devices, setDevices]       = useState<Device[]>(INITIAL_DEVICES);
    const [maxDevices, setMaxDevices] = useState(MIN_DEVICES);
    const [modalOpen, setModalOpen]   = useState(false);
 
    const handleDelete = (id: string) => {
        setDevices((prev) => prev.filter((d) => d.id !== id));
    };
 
    const handleConfirmPurchase = (newMax: number, _method: PaymentMethodId) => {
        // TODO: отправить запрос на бэк с newMax и _method
        setMaxDevices(newMax);
        setModalOpen(false);
    };
 
    const isMaxReached = maxDevices >= MAX_DEVICES;

    return (
        <div className="devices">
            <div className="devices__inner container">

                {modalOpen && (
                    <AddDevicesModal currentMax={maxDevices} onClose={() => setModalOpen(false)} onConfirm={handleConfirmPurchase} />
                )}
                <h1 className="devices__title h1">Подключённые устройства</h1>

                <p className="devices__counter">
                    {devices.length} из {maxDevices} устройств использовано
                </p>

                <ul className="devices__list">
                    {devices.map((device) => (
                        <DeviceCard key={device.id} device={device} onDelete={handleDelete} />
                    ))}
                </ul>

                <button className={`devices__add-btn button${isMaxReached ? ' devices__add-btn--disabled' : ''}`} onClick={() => !isMaxReached && setModalOpen(true)} disabled={isMaxReached} title={isMaxReached ? `Максимум ${MAX_DEVICES} устройств` : undefined} >
                    <PlusIcon />
                    Добавить устройство
                    <span className="devices__add-price">+{PRICE_PER_DEVICE}₽</span>
                </button>
 
                {isMaxReached && (
                    <p className="devices__max-note">Достигнут максимум устройств ({MAX_DEVICES})</p>
                )}

            </div>

        </div>
    );
}