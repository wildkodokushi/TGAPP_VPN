import { useRef, useState, useEffect } from 'react';

function CustomSelect({ options, value, onChange, placeholder }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt: any) => opt.value === value);

    return (
        <div className="custom-select-container" ref={containerRef}>
            <div className={`custom-select-header ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <span className="custom-select-value">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className="custom-select-arrow">
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 5.7706L9.212 7.55859L5.24 3.4666L1.268 7.55859L-0.519981 5.7706L5.24 -0.00140238L11 5.7706Z" fill="white" />
                        </svg>
                    </span>
            </div>
            {isOpen && (
                <ul className="custom-select-dropdown">
                    {options.map((option: any) => (
                        <li key={option.value} className={`custom-select-option ${option.value === value ? 'selected' : ''}`}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}>
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function SupportPage() {
    const detailsRef = useRef<HTMLDetailsElement>(null);
    const [hasActiveTicket] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState('no-work');

    const themeOptions = [
        { value: 'no-work', label: 'Не работает VPN' },
        { value: 'slow', label: 'Медленная скорость' },
        { value: 'connection', label: 'Проблемы с подключением' },
        { value: 'other', label: 'Другое' },
    ];

    const tickets = [
        { id: 1, title: 'Не работает VPN', preview: 'Здравствуйте, не могу подключи...', status: 'Решено', date: '12.06.2026 13:00', },
        { id: 2, title: 'Не работает VPN', preview: 'Здравствуйте, не могу подключи...', status: 'На рассмотрении', date: '12.06.2026 13:00', },
        { id: 3, title: 'Не работает VPN', preview: 'Здравствуйте, не могу подключи...', status: 'Ответ от поддержки', class: 'Replied', date: '12.06.2026 13:00', },
        { id: 4, title: 'Не работает VPN', preview: 'Здравствуйте, не могу подключи...', status: 'Отклонено', date: '12.06.2026 13:00', },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Форма отправлена', { theme: selectedTheme, problem: (e.target as any).problem.value });
        if (detailsRef.current) {
            detailsRef.current.open = false;
        }
    };

    return(
        <div className="support">
            <div className="support__inner container">
                <h1 className="support__title h1">Поддержка</h1>
                <div className="support__ticket">
                    <details ref={detailsRef} className="support__details" name="support__details">
                        <summary className="support__details-summary">Новый тикет</summary>
                        <form className="support__details-form" onSubmit={handleSubmit}>
                            <div className="support__details-form__theme">
                                <label className='h2' htmlFor="theme">Выберите тему</label>
                                <CustomSelect options={themeOptions} value={selectedTheme} onChange={setSelectedTheme} placeholder="Выберите тему" />
                            </div>
                            <div className="support__details-form__problem">
                                <label className="h2" htmlFor="problem">Опишите проблему</label>
                                <textarea name="problem" id="problem" placeholder="Ваш текст здесь..." rows={4}>

                                </textarea>
                            </div>
                            <div className="support__details-form__buttons">
                                <button type="submit" className='support__details-form__button button'>Отправить</button>
                                <button type="reset" className='support__details-form__button button'>Сбросить</button>
                            </div>
                        </form>
                    </details>
                    <div className="support__ticket-check">
                        <h2 className="support__ticket-title h2">Ваши обращения</h2>
                        {hasActiveTicket ? (
                            <ul className="support__ticket-list">
                                    {tickets.map((ticket) => (
                                        <li key={ticket.id} className="support__ticket-item">
                                            <div className="support__ticket-top">
                                                <span className="support__ticket-title h3">{ticket.title}</span>
                                                <span className={`support__ticket-status status-button ${ticket.class} ${[`status${ticket.status.replace(/\s+/g, '')}`]}`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <div className="support__ticket-bottom">
                                                <span className="support__ticket-preview">
                                                    {ticket.preview}
                                                </span>
                                                <span>{ticket.date}</span>
                                            </div>
                                        </li>
                                    ))}
                            </ul>
                            ) : (
                                <div className="support__none">
                                    <div className="support__none-inner">
                                        <span className="support__none-icon">
                                            <svg width="34" height="30" viewBox="0 0 34 30" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0 0H33.3333V6.66667H0V0ZM28.3333 8.33333H1.66667V26.6667C1.66667 27.5507 2.01786 28.3986 2.64298 29.0237C3.2681 29.6488 4.11594 30 5 30H28.3333C29.2174 30 30.0652 29.6488 30.6904 29.0237C31.3155 28.3986 31.6667 27.5507 31.6667 26.6667V8.33333H28.3333ZM23.3333 18.3333H10V15H23.3333V18.3333Z"/>
                                            </svg>
                                        </span>
                                        Нет обращений
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}