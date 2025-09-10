import React, {memo, useState} from "react";
import {Button} from "@/components/ui/button";
import CustomCard from "@/components/custom/custom-card";
import {IHomeConfig} from "@/models/config";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Checkbox} from "@/components/ui/checkbox";
import {Dot, Loader2} from "lucide-react";
import {Label} from "@/components/ui/label";
import {IPolicyDocument} from "@/models/policy-document";
import {useFetchPolicyDocument} from "@/app/admin/config/(hooks)/use-policy-document";

interface IProps {
    policy: IPolicyDocument[];
    setCloneConfig: React.Dispatch<React.SetStateAction<IHomeConfig>>;
    openModal?: () => void;
}

const PolicySelection = memo(
    ({policy, setCloneConfig}: IProps
    ) => {
        const {refetch, loading, data} = useFetchPolicyDocument();
        const [openList, setOpenList] = useState(false);
        const handleSelectFromList = () => {
            refetch();
            setOpenList(true);
        }

        const handleSelect = (checked: any, current: IPolicyDocument) => {
            if (!policy.some(item => item._id === current._id)) {
                setCloneConfig((prev: any) => ({
                    ...prev,
                    agricultural_policy: [...prev.agricultural_policy, current]
                }))
            } else {
                setCloneConfig((prev: any) => ({
                    ...prev,
                    agricultural_policy: prev.agricultural_policy.filter((item: any) => item._id !== current._id)
                }))
            }
        }

        return <>
            <CustomCard
                title={
                    <div className={'w-full flex items-center justify-between'}>
                        <h3>Chính sách Nông nghiệp</h3>
                        <Button onClick={handleSelectFromList}>Chọn từ danh sách</Button>
                    </div>
                }
                className={'sm:col-span-1'}
            >
                {
                    policy.length > 0 ? (
                        <div className={'grid gap-3 max-h-[480px] overflow-y-auto'}>
                            {policy?.map((item, index) => (
                                <div key={index} className={'flex items-center gap-1'}>• {item.title}</div>
                            ))}
                        </div>
                    ) : <div className={'text-center w-full text-gray-400 italic'}>
                        Không có dữ liệu
                    </div>
                }
            </CustomCard>
            <Dialog open={openList} onOpenChange={setOpenList}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chọn chính sách</DialogTitle>
                    </DialogHeader>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                        <div className={'mt-2'}>
                            <div className={'space-y-3'}>
                                {data.documents.map((item: IPolicyDocument) => (
                                    <div className={'flex items-start gap-3'} key={item._id}>
                                        <Checkbox
                                            disabled={policy.length === 1 && policy.some(i => i._id === item._id)}
                                            value={item._id}
                                            checked={policy.some(i => i._id === item._id)}
                                            onCheckedChange={(checked) => handleSelect(checked, item)}
                                        />
                                        <Label htmlFor={item._id}>{item.title}</Label>
                                    </div>
                                ))}
                            </div>
                            <div className={'text-center text-gray-500 italic text-sm font-bold mt-6'}>Vui lòng nhấn nút
                                Cập nhật sau khi lựa chọn xong
                            </div>
                        </div>
                    }
                </DialogContent>
            </Dialog>
        </>
    })

export default PolicySelection;
