export default function CabinetPage() {

  return (
    
    <div className='my-[15px]'>
        <div className=''>
            
            <h2 className="text-cm font-bold text-white acony-font text-center">
                PSYCHOWARE VPN
            </h2>


            {/* info */}
            <div className='mt-[20px] flex items-center gap-[20px] h-[85px] border border-white/20 rounded-2xl bg-[rgba(210,0,255,0.05)] bg-black/30'>
                <div className='border-2 rounded-full w-[50px] h-[50px] border-[#d200ff] ml-[20px]'>

                </div>
                <div className='flex flex-col gap-[5px] bounded-font'>
                    <span className='text-white text-[14px] font-bold'>sweater</span>
                    <div className='text-white/30 text-[12px]'>
                        <span>ID: </span>
                        <span>660741573</span>
                    </div>
                </div>
            </div>
            
            <h2 className="font-light text-[18px] text-left my-[10px] text-white bounded-font">Ваши покупки</h2>

            <div className='grid grid-cols-1 gap-[15px]'>
                <div className='border border-white/20 rounded-2xl bg-[rgba(210,0,255,0.05)] p-[20px] flex flex-col gap-[10px]'>
                    <div className='flex justify-between items-center bounded-font text-white text-[14px]'>
                        <span className='uppercase font-bold'>анти-афк</span>
                        <span className='flex items-center'>100<span>₽</span></span>
                    </div>
                    <div className='bounded-font text-white/40 text-[12px]'>
                        <span className='flex items-center gap-[3px]'>21.01.2026 <span className='text-[16px]'>•</span> <span>7 дн.</span></span>
                        <div className='bounded-font font-light text-white/40 text-[11px]'>
                            <span>Заказ:</span>
                            <span>3123432143</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    
  );
}