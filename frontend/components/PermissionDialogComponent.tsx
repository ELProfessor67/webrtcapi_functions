import React from 'react'
import { LuSettings2 } from "react-icons/lu";


interface IProps {
    open: Boolean;
    onClose: () => void;
}

const PermissionDialog: React.FC<IProps> = ({ onClose, open }) => {
    return (
        <div className={`absolute top-0 left-0 right-0 bottom-0 ${open ? 'block' : 'hidden'}`}>

            <div className='max-w-[40rem] bg-white h-[90vh] md:h-[75vh] p-4 mx-auto md:mt-20'>
                <div className='mb-5'>
                <img src='/permission-phone.svg' className='w-full mx-auto select-none' />
                    
                </div>

                <div className='flex items-center justify-center max-w-[30rem] mx-auto flex-col'>
                    <h2 className='text-[36px] font-bold text-black/90 text-center select-none'>Zugriff auf Mikrofon und Kamera erlauben</h2>
                    <p className='text-[#707070] text-[18px] font-medium mt-4 text-center select-none'>Bitte klicken Sie in der Adressleiste Ihres Browsers auf das angezeigte Symbol und aktivieren Sie Ihr Mikrofon und Ihre Kamera.</p>
                </div>
            </div>
        </div>
    )
}

export default PermissionDialog