import {getIdFromSlug} from "@/lib/utils";
import {IPolicyDocument} from "@/models/policy-document";
import {fetchDetailDocument} from "@/app/(user)/thong-tin-chinh-sach/(fetch-data)/fetch-detail-document";
import Developing from "@/components/custom/developing";

export default async function ({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const id: string = getIdFromSlug(slug);
    const doc: IPolicyDocument = await fetchDetailDocument(id);
    console.log(doc)

    return (
        !doc ? <div className={'text-gray-500 italic text-center'}>Không có thông tin</div> :
            <Developing/>
    );
}
