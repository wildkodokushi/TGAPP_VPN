//пофиксить кнопку
import { useState } from 'react';

const MAX_DEVICES = 3; //по тарифу

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

const PRICE_PER_DEVICE = 50;


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

export default function DevicesPage() {
    const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
    const [maxDevices, setMaxDevices] = useState(MAX_DEVICES);

    const isFull = devices.length >= maxDevices;

    const handleDelete = (id: string) => {
        setDevices((prev) => prev.filter((d) => d.id !== id));
    };

    const handleAddSlot = () => {
        // Логика покупки доп. устройства — здесь переход на оплату или API-запрос
        setMaxDevices((prev) => prev + 1);
    };

    return (
        <div className="devices">
            <div className="devices__inner container">
                <h1 className="devices__title h1">Подключённые устройства</h1>

                <p className="devices__counter">
                    {devices.length} из {maxDevices} устройств использовано
                </p>

                <ul className="devices__list">
                    {devices.map((device) => (
                        <DeviceCard key={device.id} device={device} onDelete={handleDelete} />
                    ))}
                </ul>

                {/* ес чё нопка появляется только когда все слоты заняты */}
                {isFull && (
                    <button className="devices__add-btn button" onClick={handleAddSlot}>
                        <PlusIcon />
                        Добавить устройство&nbsp;
                        <span className="devices__add-price">+{PRICE_PER_DEVICE}₽</span>
                    </button>
                )}
            </div>
        </div>
    );
}