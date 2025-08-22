import Image from "next/image";

export default function Developing() {
    return <div
        className={'flex flex-col items-center min-h-screen mb-5 justify-center -mt-20 max-sm:px-4 max-sm:box-border'}>
        <Image src={'/images/developing.png'} width={400} height={400} alt={'Tính năng đang phát triển'}/>
        <div className={'flex flex-col gap-3 items-center justify-center'}>
            <div className={'text-2xl font-semibold text-center'}>Tính năng đang được phát triển</div>
        </div>
    </div>
}
