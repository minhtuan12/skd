import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import UploadFile from "@/app/admin/config/(components)/upload-file";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import {generateJSON} from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import {IKnowledge, KnowledgeTypes} from "@/models/knowledge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useFetchTreeType} from "@/app/admin/config/(hooks)/use-tree-type";
import {Loader2} from "lucide-react";
import {ITreeType} from "@/models/tree-type";
import {Dropzone, DropzoneContent, DropzoneEmptyState} from "@/components/ui/shadcn-io/dropzone";
import Image from "next/image";
import {VideoPlayer} from "@/components/ui/video";

export default function KnowledgeForm({data, handleChangeData, imageUrl, handleImageChange, handleDrop}: {
    data: IKnowledge,
    handleChangeData: any,
    imageUrl: string,
    handleImageChange?: any,
    handleDrop?: any
}) {
    const {
        name,
        description,
        media,
        tree_type,
        category
    } = data;
    const {loading, data: treeTypes} = useFetchTreeType('', 1, true);
    const isTechnique = category === KnowledgeTypes.renovation || category === KnowledgeTypes.farming;

    return <div className={'flex gap-4 h-full pb-10'}>
        <div className="space-y-5 w-1/3">
            <div className={'space-y-4'}>
                {isTechnique ?
                    <div className="grid gap-2">
                        <Label required htmlFor="name">Tên kỹ thuật</Label>
                        <Textarea
                            id="name" placeholder="Nhập tên kỹ thuật" value={name}
                            onChange={e => handleChangeData(e.target.value, 'name')}
                        />
                    </div> : ''
                }
                {/* Tree type selection */}
                {isTechnique ? <div className="grid gap-2">
                    <Label required htmlFor="tree_type">Nhóm cây</Label>
                    <Select
                        onValueChange={group => handleChangeData(group, 'tree_type')}
                        value={!tree_type ? undefined :
                            (typeof tree_type === 'string' ? tree_type : (tree_type as ITreeType)._id)
                        }
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> :
                            <>
                                <SelectTrigger className="bg-white w-full">
                                    <SelectValue placeholder="Chọn nhóm cây"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        treeTypes?.tree_types ? treeTypes?.tree_types?.map((group: ITreeType) => (
                                            <SelectItem value={group._id as string} key={group._id as string}>
                                                {group.name}
                                            </SelectItem>
                                        )) : ''
                                    }
                                </SelectContent>
                            </>
                        }
                    </Select>
                </div> : ''
                }
                {!isTechnique ?
                    <div className="grid gap-2 mt-1">
                        <Label>Hình ảnh/Video</Label>
                        <Dropzone
                            accept={{
                                "image/*": [],
                                "video/*": []
                            }}
                            maxFiles={1}
                            maxSize={1024 * 1024 * 50}
                            minSize={1024}
                            onDrop={handleDrop}
                            onError={console.error}
                            src={typeof media?.url !== 'string' ? [media?.url] as File[] : []}
                            className={'h-[calc(100vh-500px)]'}
                        >
                            <DropzoneEmptyState/>
                            <DropzoneContent/>
                        </Dropzone>
                        {
                            (media?.url && typeof media.url === 'string') ? (
                                media.media_type === 'image' ?
                                    <Image src={media.url} alt={''}
                                           sizes={'100vw'}
                                           width={0}
                                           height={0}
                                           style={{width: '100%', height: 'auto'}}
                                           className={'rounded-lg'}
                                    /> : <VideoPlayer src={media.url}/>
                            ) : ""
                        }
                    </div> :
                    <UploadFile
                        inputValue={''}
                        url={(imageUrl && imageUrl !== '/') ? imageUrl : media?.url as string}
                        handleChangeFile={e => handleImageChange(e, 'media')}
                    />
                }
            </div>

        </div>
        <div className="space-y-2 h-full flex-1 mt-0.5">
            <Label required htmlFor="description" className={'mb-4'}>{isTechnique ? 'Chi tiết' : 'Giới thiệu'}</Label>
            <SimpleEditor
                content={generateJSON(description as string, [StarterKit])}
                handleChange={({editor}: any) => handleChangeData(editor.getHTML(), 'description')}
            />
        </div>
    </div>
}