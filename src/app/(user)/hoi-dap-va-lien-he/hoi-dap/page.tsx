import React from "react";

export default function HoiDap() {
    return <div className={'box-border pb-18 pt-8 flex flex-col gap-6 xl:px-40 px-10 max-sm:px-6'}>
        <div className={'flex flex-col gap-6 px-6 xl:px-0'}>
            <h1 className={'font-semibold text-center text-xl'}>HỎI ĐÁP</h1>
            <div className={'flex-1 flex justify-center'}>
                <iframe
                    className={'shadow-lg rounded-lg box-border pt-4 bg-gray-100'}
                    src="https://docs.google.com/forms/d/e/1FAIpQLSfKFjc3RWZE4paCvDsrhpmZrtlkBrzrOQ57wY7UI3gHupI1pg/viewform?embedded=true"
                    width="640" height="700" marginHeight={0} marginWidth={0}>Đang tải…
                </iframe>
            </div>
        </div>
    </div>
}
