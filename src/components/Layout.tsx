import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

type AppTheme = 'space' | 'pink';
const SWIPE_ONBOARDING_KEY = 'swipe-onboarding-complete';

function hasCompletedSwipeOnboarding() {
    try {
        return localStorage.getItem(SWIPE_ONBOARDING_KEY) === '1';
    } catch {
        return false;
    }
}

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showSwipeOnboarding, setShowSwipeOnboarding] = useState(() => !hasCompletedSwipeOnboarding());

    const dismissSwipeOnboarding = () => {
        setShowSwipeOnboarding((isVisible) => {
            if (!isVisible) {
                return false;
            }
            try {
                localStorage.setItem(SWIPE_ONBOARDING_KEY, '1');
            } catch {
                // Ignore storage errors and still hide onboarding in current session.
            }
            return false;
        });
    };

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            if (location.pathname === '/cabinet') navigate('/');
            else if (location.pathname === '/') navigate('/tariffs');
        },
        onSwipedRight: () => {
            dismissSwipeOnboarding();
            if (location.pathname === '/tariffs') navigate('/');
            else if (location.pathname === '/') navigate('/cabinet');
        },
        trackMouse: true,
        preventScrollOnSwipe: true,
        delta: 10,
    });


    const cabinetRef = useRef(null);
    const homeRef = useRef(null);
    const tariffsRef = useRef(null);

    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [theme, setTheme] = useState<AppTheme>(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme === 'pink' ? 'pink' : 'space';
    });

    useEffect(() => {
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    useEffect(() => {
        let activeRef = null;
        if (location.pathname === '/cabinet') activeRef = cabinetRef;
        else if (location.pathname === '/') activeRef = homeRef;
        else if (location.pathname === '/tariffs') activeRef = tariffsRef;

        if (activeRef?.current) {
            const { offsetLeft, offsetWidth } = activeRef.current;
            setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [location.pathname]);
                                 
    useEffect(() => {
        const handleResize = () => {

        let activeRef = null;
        if (location.pathname === '/cabinet') activeRef = cabinetRef;
        else if (location.pathname === '/') activeRef = homeRef;
        else if (location.pathname === '/tariffs') activeRef = tariffsRef;

        if (activeRef?.current) {
            const { offsetLeft, offsetWidth } = activeRef.current;
            setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
        }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

  return (
    <div {...handlers} className={`layout-root main-background theme-${theme} flex flex-col items-center`}>

        <div className='w-full max-w-[380px] flex justify-end px-[12px] pt-[10px]'>
            <div className='relative theme-soft border border-white/20 rounded-full p-[3px] inline-grid grid-cols-2 w-[148px]'>
                <div
                  className='theme-primary-btn absolute top-[3px] bottom-[3px] left-[3px] w-[calc(50%_-_5px)] rounded-full transition-transform duration-300 pointer-events-none'
                  style={{ transform: theme === 'space' ? 'translateX(0)' : 'translateX(calc(100% + 4px))' }}
                />
                <button
                  type='button'
                  onClick={() => setTheme('space')}
                  className='relative z-10 h-[28px] px-[12px] rounded-full text-[11px] bounded-font cursor-pointer transition-colors'
                  style={{ color: theme === 'space' ? 'var(--primary-text)' : 'rgba(255,255,255,0.7)' }}
                >
                  Space
                </button>
                <button
                  type='button'
                  onClick={() => setTheme('pink')}
                  className='relative z-10 h-[28px] px-[12px] rounded-full text-[11px] bounded-font cursor-pointer transition-colors'
                  style={{ color: theme === 'pink' ? 'var(--primary-text)' : 'rgba(255,255,255,0.7)' }}
                >
                  Pink
                </button>
            </div>
        </div>

        {/* подгрузка основного контента */}
        {showSwipeOnboarding ? (
            <div className='swipe-onboarding-overlay fixed inset-0 z-40 flex items-center justify-center px-[20px]'>
                <div className='swipe-onboarding-content max-w-[320px]'>
                    <div className='swipe-onboarding-track' aria-hidden='true'>
                        <div className='swipe-onboarding-animation'>
                            <svg className='swipe-onboarding-hand-icon' xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'>
                                <title>Hand-index SVG Icon</title>
                                <path fill='currentColor' d='M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027c.134.027.294.096.448.182c.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04c.118.046.3.207.486.43c.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716c-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642a2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025' />
                            </svg>
                            <div className='swipe-onboarding-trails'>
                                <span className='swipe-onboarding-trail swipe-onboarding-trail-top' />
                                <span className='swipe-onboarding-trail swipe-onboarding-trail-mid' />
                                <span className='swipe-onboarding-trail swipe-onboarding-trail-bottom' />
                            </div>
                        </div>
                    </div>
                    <p className='mt-[18px] text-center text-white bounded-font text-[15px] leading-[1.4]'>
                        Свайпните вправо, чтобы перейти на другую вкладку
                    </p>
                </div>
            </div>
        ) : null}

        <div className="layout-content flex-1 w-full flex items-center justify-center">
            <Outlet />
        </div>

        {/* футер */}
        <div className='footer w-[100%] mt-[auto] flex items-center justify-between '>

            <div
              className="footer-indicator absolute bottom-[14px] left-0 h-[calc(100%-28px)] border rounded-full transition-all duration-300 pointer-events-none"
              style={{ left: indicatorStyle.left + 12, width: Math.max(0, indicatorStyle.width - 24) }}
            />

            <button ref={cabinetRef} onClick={() => navigate('/cabinet')} className='cursor-pointer w-1/3 flex justify-center relative z-10'>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024"><title>User-outlined SVG Icon</title><path fill="#fff" d="M858.5 763.6a374 374 0 0 0-80.6-119.5a375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1c-.4.2-.8.3-1.2.5c-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8c2-77.2 33-149.5 87.8-204.3c56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2M512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534"/></svg>
            </button>
            <button ref={homeRef} onClick={() => navigate('/')} className='cursor-pointer w-1/3 flex justify-center relative z-10'>
                <svg width="50" height="50" viewBox="0 0 376 294" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M155.407 2.39681C154.758 4.59389 154.459 4.84356 152.411 5.54263L150.115 6.34157L152.062 7.1405C153.56 7.78964 154.209 8.53864 155.108 10.4361L156.256 12.9328L157.405 10.4361C158.304 8.48871 158.953 7.73971 160.551 7.04064L162.548 6.19176L160.8 5.84223C158.803 5.44276 158.004 4.69376 156.905 1.94741L156.156 0L155.407 2.39681Z" fill="white"/>
                    <path d="M192.908 9.63719C184.768 16.1286 175.78 25.2165 170.188 32.6566L168.79 34.554L171.736 33.2058C176.18 31.2085 182.821 29.1612 187.715 28.2624C190.161 27.813 192.508 27.2637 192.908 27.064C193.906 26.5147 196.603 20.1732 197.851 15.3296C199.049 10.7857 199.749 5.0433 199.099 5.0433C198.85 5.0433 196.053 7.14051 192.908 9.63719Z" fill="white"/>
                    <path d="M243.09 6.64116C226.812 13.6319 211.932 21.771 200.197 30.0101C197.551 31.9076 196.202 32.4568 194.055 32.7564C187.314 33.6053 174.381 37.4502 169.388 40.0967C163.196 43.3423 158.353 49.0348 154.907 57.0241C152.66 62.3171 151.462 64.1147 148.815 66.0122C146.169 67.9097 139.678 69.9569 136.182 69.9569C133.686 69.9569 133.436 70.0568 132.937 71.3052C132.188 73.2026 133.036 78.0961 134.734 81.8911C137.281 87.4836 143.722 92.1774 150.713 93.4757C154.608 94.2247 159.551 93.7253 165.194 92.1774C173.533 89.8305 178.526 88.8818 180.673 89.2313C181.772 89.3811 184.568 90.6295 186.915 91.9277C193.306 95.5729 195.803 96.1721 204.491 96.1721C208.486 96.1721 211.981 96.0223 212.181 95.8225C212.381 95.5729 212.181 95.0236 211.732 94.5243C210.134 92.7766 205.44 85.2366 205.69 84.8871C205.989 84.3878 209.585 84.7872 213.629 85.7859C216.825 86.5349 220.97 88.6321 223.966 91.0289C225.713 92.3771 225.913 92.4271 226.163 91.5782C226.312 91.0789 226.662 90.1301 226.912 89.431C228.46 84.937 228.959 73.5022 227.86 67.4603C227.561 65.7625 227.361 64.2645 227.461 64.1646C227.561 64.1147 229.209 65.0135 231.106 66.2119L234.601 68.409L234.901 67.0608C235.45 64.8637 235.4 53.5787 234.851 48.7352C234.551 46.2884 233.852 42.094 233.303 39.4475L232.354 34.6539L235.65 28.9615C240.044 21.4215 247.334 6.64116 247.334 5.29296C247.334 4.89349 246.635 5.09322 243.09 6.64116ZM184.418 58.3224C184.917 58.7718 182.121 63.116 180.623 64.3145C179.724 64.9636 177.927 65.8624 176.628 66.2619C173.932 67.0608 169.638 67.2106 169.188 66.4616C168.789 65.8125 170.237 63.0661 171.885 61.3184C173.533 59.5208 175.43 58.5222 178.077 58.0228C180.024 57.6733 183.869 57.873 184.418 58.3224Z" fill="white"/>
                    <path d="M139.079 24.8169C137.531 30.0599 135.933 31.6078 131.29 32.5066L127.844 33.1558L130.541 34.1545C135.484 35.9521 136.882 37.5499 139.828 44.9401C140.228 46.0386 140.377 45.9388 141.376 43.1425C143.373 37.6997 145.371 35.5526 149.915 34.0047L152.511 33.1558L149.366 32.5066C143.723 31.4081 142.924 30.6092 141.027 23.8681L140.178 20.972L139.079 24.8169Z" fill="white"/>
                    <path d="M124.598 94.0249C111.815 106.908 109.369 126.582 118.406 143.859C125.697 157.84 137.082 167.178 151.712 171.172C156.456 172.471 157.305 172.521 167.941 172.521C179.875 172.57 183.52 172.121 192.158 169.574C197.152 168.126 200.298 166.878 205.441 164.331C209.635 162.184 210.334 161.485 207.388 162.334C203.693 163.383 193.806 164.331 186.316 164.331C167.242 164.331 151.712 159.638 142.624 151.149C138.03 146.855 132.288 138.915 133.137 138.016C133.287 137.917 134.635 138.815 136.183 140.064C146.569 148.502 158.453 152.847 171.186 152.847C176.579 152.847 179.575 152.447 196.153 149.501C203.294 148.253 212.981 148.453 219.023 150C228.111 152.397 237.997 157.94 245.438 164.781C249.133 168.226 253.876 174.019 255.474 177.064L256.223 178.562L257.322 176.066C261.117 167.278 263.014 157.491 262.715 148.353C262.515 143.559 262.215 141.362 261.316 138.865C257.971 129.278 251.48 122.537 240.993 117.494L237.099 115.646L246.087 115.147L243.34 112.95C235.401 106.608 227.062 103.213 216.127 101.865C206.889 100.716 196.702 102.663 180.923 108.556C166.143 114.048 157.954 116.146 152.761 115.746C140.827 114.797 130.69 105.859 127.794 93.7753L127.195 91.3785L124.598 94.0249Z" fill="white"/>
                    <path d="M137.2 204L91.84 260H63.36L18 204H46.48L77.6 242.4L108.72 204H137.2Z" fill="white"/>
                    <path d="M250.812 260V204H276.093L331.933 236V204H357.214V260H331.933L276.093 228V260H250.812Z" fill="white"/>
                    <path d="M218.022 223.2H165.702V229.6H218.022C220.262 229.6 221.542 228.4 221.542 226.4C221.542 224.4 220.262 223.2 218.022 223.2ZM165.702 260H140.422V204H224.422C238.422 204 246.822 215.2 246.822 226.4C246.822 237.6 238.422 248.8 224.422 248.8H165.702V260Z" fill="white"/>
                </svg>
            </button>
            <button ref={tariffsRef} onClick={() => navigate('/tariffs')} className='cursor-pointer w-1/3 flex justify-center relative z-10'>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024"><path fill="#fff" d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0 0 14.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0 0 15.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9M214 184h596v88H214zm362 656.1H448V736h128zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4c22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1c.2-.1.4-.1.6 0a180.4 180.4 0 0 0 38.7 22.1c22.3 9.4 46 14.1 70.4 14.1c24.4 0 48-4.7 70.4-14.1c3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3c-40.8 0-76.4-22.1-95.2-54.9c-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 0 1 512 544c-40.7 0-76.2-22-95-54.7c-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 0 1-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5z"/></svg>
            </button>

        </div>

    </div>
  );
}
