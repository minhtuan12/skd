import {Loader2} from "lucide-react";

export default function Loading() {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className={'w-7 h-7 animate-spin'}/>
        </div>
    );
}
