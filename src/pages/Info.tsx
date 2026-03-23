import { useState } from 'react';

type TabId = 'terms' | 'privacy' | 'contact' | 'faq';

const EMAIL = 'suppsychoware@gmail.com';

const TABS: { id: TabId; label: string }[] = [
    { id: 'terms', label: 'Польз. соглашение' },
    { id: 'privacy', label: 'Политика конф.' },
    { id: 'contact', label: 'Связаться с нами' },
    { id: 'faq', label: 'FAQ' },
];

const STATIC_CONTENT = {
    terms: (
        <>
            <div className="info__content-main">
                <div className="info__content-scroll">
                    <section className="info__section">
                        <h2 className="info__section-title">1. Общие положения</h2>
                        <p>1.1. Настоящая Политика конфиденциальности регулирует порядок сбора, обработки и защиты персональных данных пользователей сервиса Psychoware VPN (далее — «Сервис»).</p>
                        <p>1.2. Используя Сервис, вы подтверждаете своё согласие с условиями данной Политики.</p>
                        <p>1.3. В случае несогласия с условиями Политики вы обязаны прекратить использование Сервиса.</p>
                    </section>
                    <section className="info__section">
                        <h2 className="info__section-title">2. Конфиденциальность данных</h2>
                        <p>2.1. Psychoware VPN стремится обеспечивать высокий уровень защиты информации пользователей.</p>
                        <p>2.2. Персональные данные, предоставленные при регистрации или оплате (например, адрес электронной почты или платёжные данные), используются исключительно для:</p>
                        <ul className='info__list'>
                            <li>предоставления доступа к Сервису;</li>
                            <li>обработки платежей;</li>
                            <li>технической поддержки;</li>
                        </ul>
                        <p>2.3. Мы не продаём и не передаём персональные данные третьим лицам в коммерческих целях.</p>
                    </section>
                    <section className="info__section">
                        <h2 className="info__section-title">3. Логирование данных</h2>
                        <p>3.1. Psychoware VPN придерживается политики минимального логирования.</p>
                        <p>3.2. Мы не храним историю посещённых сайтов, IP-адреса подключений, DNS-запросы и содержимое трафика пользователей.</p>
                        <p>3.3. Может временно обрабатываться минимальная техническая информация, необходимая для стабильной работы сервиса, включая:</p>
                        <ul className='info__list'>
                            <li>срок действия подписки;</li>
                            <li>объём использованного трафика (при наличии ограничений тарифа);</li>
                            <li>технические ошибки и диагностические данные сервера.</li>
                        </ul>
                        <p>3.4. Указанные технические данные используются исключительно для обеспечения работоспособности и безопасности Сервиса.</p>
                    </section>
                    <section className='info__section'>
                        <h2 className='info__section-title'>4. Доступ к данным</h2>
                        <p>4.1. Данные пользователей не передаются третьим лицам, за исключением случаев, прямо предусмотренных действующим законодательством.</p>
                        <p>4.2. Пользователь обязуется не передавать доступ к своей учётной записи третьим лицам.</p>
                        <p>4.3. В случае выявления подозрительной активности или нарушения условий использования, администрация вправе ограничить или приостановить доступ к Сервису.</p>
                    </section>
                    <section className='info__section'>
                        <h2 className='info__section-title'>5. Защита информации</h2>
                        <p>5.1. Для защиты данных используются современные методы шифрования и технические меры безопасности.</p>
                        <p>5.2. Несмотря на предпринимаемые меры, абсолютная безопасность передачи данных в сети Интернет не может быть гарантирована.</p>
                    </section>
                    <section className='info__section'>
                        <h2 className='info__section-title'>6. Обновления политики</h2>
                        <p>6.1. Psychoware VPN оставляет за собой право изменять настоящую Политику конфиденциальности без предварительного уведомления.</p>
                        <p>6.2. Актуальная версия документа публикуется на официальном ресурсе Сервиса.</p>
                        <p>6.3. Продолжение использования Сервиса после внесения изменений означает согласие пользователя с обновлённой редакцией Политики.</p>
                    </section>
                </div>
            </div>
        </>
    ),
    privacy: (
        <>
            <div className="info__content-main">
                <div className="info__content-scroll">
                    <section className="info__section">
                        <h2 className="info__section-title">1. Общие положения</h2>
                        <p>1.1. Настоящая Политика конфиденциальности регулирует порядок обработки и защиты персональных данных пользователей сервиса Psychoware VPN.</p>
                        <p>1.2. Используя Сервис, вы подтверждаете своё согласие с условиями данной Политики.</p>
                        <p>1.3. Если вы не согласны с условиями Политики, необходимо прекратить использование Сервиса.</p>
                    </section>
                    <section className="info__section">
                        <h2 className="info__section-title">2. Конфиденциальность данных</h2>
                        <p>2.1. Мы стремимся обеспечивать высокий уровень защиты данных пользователей.</p>
                        <p>2.2. Все сведения, предоставленные пользователем при регистрации или в процессе использования Сервиса, используются исключительно для:</p>
                        <ul className="info__list">
                            <li>предоставления доступа к услугам VPN;</li>
                            <li>обработки платежей и управления подписками;</li>
                            <li>технической поддержки и уведомлений о работе Сервиса.</li>
                        </ul>
                        <p>2.3. Персональные данные не передаются третьим лицам для коммерческих целей.</p>
                    </section>
                    <section className="info__section">
                        <h2 className="info__section-title">3. Логирование данных</h2>
                        <p>3.1. Мы не ведём хранение логов интернет-активности пользователей.</p>
                        <p>3.2. Исключение составляет минимальная техническая информация, необходимая для корректной работы Сервиса, включая:</p>
                        <ul className="info__list">
                            <li>срок действия подписки;</li>
                            <li>технические ошибки и диагностические данные;</li>
                            <li>объём использованного трафика (при наличии ограничений тарифного плана).</li>
                        </ul>
                        <p>3.3. Такая информация используется исключительно для обеспечения стабильной работы и безопасности Сервиса.</p>
                    </section>
                    <section className='info__section'>
                        <h2 className='info__section-title'>4. Доступ к данным</h2>
                        <p>4.1. Данные пользователей не передаются третьим лицам, за исключением случаев, прямо предусмотренных законодательством.</p>
                        <p>4.2. Пользователю запрещено передавать доступ к своей учётной записи третьим лицам.</p>
                        <p>4.3. Нарушение правил доступа может привести к блокировке или приостановке учётной записи.</p>
                    </section>
                    <section className='info__section'>
                        <h2 className='info__section-title'>5. Обновления политики</h2>
                        <p>5.1. Psychoware VPN оставляет за собой право изменять настоящую Политику конфиденциальности без предварительного уведомления.</p>
                        <p>5.2. Пользователи обязаны периодически проверять актуальность документа.</p>
                        <p>5.3. Продолжение использования Сервиса после внесения изменений означает согласие с обновлённой версией Политики.</p>
                    </section>
                </div>
            </div>
        </>
    ),
    faq: (
        <>
            <section className="info__details">
                <h2 className="info__details-title">Часто задаваемые вопросы</h2>
                {[
                    {
                        q: 'Что это за сервис?',
                        a: 'Это VPN-сервис для быстрого и стабильного доступа к нужным ресурсам без ограничений.',
                    },
                    {
                        q: 'Как начать пользоваться?',
                        a: 'Скачайте v2rayTun или Happ, получите 3 дня бесплатной подписки, чтобы опробовать сервис и принять решение о дальнейшем пользовании и импортируйте подписку в скачанное приложение.',
                    },
                    {
                        q: 'На каких устройствах работает?',
                        a: 'Поддерживаются смартфоны, ПК и планшеты (iOS, Android, Windows, macOS).',
                    },
                    {
                        q: 'Это безопасно?',
                        a: 'Да, соединение защищено. Мы не передаём ваши данные третьим лицам.',
                    },
                    {
                        q: 'Почему может падать скорость?',
                        a: 'Скорость зависит от вашей сети, выбранного сервера и нагрузки. Попробуйте сменить локацию.',
                    },
                    {
                        q: 'Как выбрать сервер?',
                        a: 'Вы можете выбрать доступную локацию в вашем VPN-клиенте — рекомендуем проверять пинг серверов, чтобы выбрать самый быстрый.',
                    },
                    {
                        q: 'Не подключается — что делать?',
                        a: 'Проверьте интернет-соединение или попробуйте другой сервер, обновите подписку или импортируйте заново. Если не помогло — напишите в поддержку.',
                    },
                    {
                        q: 'Как работает подписка?',
                        a: 'Вы выбираете тариф и оплачиваете доступ. После этого получаете данные для подключения.',
                    },
                    {
                        q: 'Можно ли отменить подписку?',
                        a: 'Да, вы можете отключить её в любой момент.',
                    },
                    {
                        q: 'Как связаться с поддержкой?',
                        a: 'Через форму в приложении или указанные контакты.',
                    }
                ].map(({ q, a }, i) => (
                    <FaqItem key={i} question={q} answer={a} />
                ))}
            </section>
        </>
    ),
};

function FaqItem({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="info__details-list" name="info__details">
            <summary className="info__details-summary">{question}</summary>
            <div className='info__details-answer'>{answer}</div>
        </details>
    );
}

// Блок с почтой и кнопкой копирования
const CopyIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const CheckIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

function EmailCopy() {
    const [copied, setCopied] = useState(false);
 
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // fallback для старых браузеров
            const el = document.createElement('textarea');
            el.value = EMAIL;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };
 
    return (
        <div className="info__email-block">
            <span className="info__email-label">
                Почта для связи
                {copied && <span className="info__email-toast notification">Скопировано!</span>}
            </span>
            <div className="info__email-row">
                <a href={`mailto:${EMAIL}`} className="info__email-address">
                    {EMAIL}
                </a>
                <button className={`info__email-copy button ${copied ? ' info__email-copy--done' : ''}`} onClick={handleCopy} title={copied ? 'Скопировано!' : 'Скопировать'} >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>
        </div>
    );
}

function ContactTab() {
    return (
        <>
            <div className="info__contacts">
                <h2 className="info__contacts-title h2">Если у тебя возникли проблемы — напиши нам!</h2>
                <div className="info__contacts-form">
                    <EmailCopy />
                </div>
                <div className="info__contacts-buttons">
                    <a href="https://t.me/psychowaresupportxbot" target="_blank" rel="noreferrer" className="info__contacts-button button">
                        Поддержка
                    </a>
                    <a href="https://t.me/psychowarevpn" target="_blank" rel="noreferrer" className="info__contacts-button button">
                        Канал
                    </a>
                </div>
            </div>
        </>
    );
}

export default function InfoPage() {
    const [activeTab, setActiveTab] = useState<TabId>('terms');

    return (
        <div className="info">
            <div className="info__inner container">
                <h1 className="info__title h1">Информация</h1>
                <div className="info__tabs">
                    {TABS.map((tab) => (
                        <button key={tab.id} className={`info__tabs-tab button ${activeTab === tab.id ? ' info__tabs-tab--active' : ''}`} onClick={() => setActiveTab(tab.id)} >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="info__content">
                    {activeTab === 'contact' ? <ContactTab /> : STATIC_CONTENT[activeTab]}
                </div>
            </div>
        </div>
    );
}