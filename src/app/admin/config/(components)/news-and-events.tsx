import React, {memo, useState} from "react";
import NewsEventsItem from "@/app/admin/config/(components)/news-events-item";
import {Button} from "@/components/ui/button";
import CustomCard from "@/components/custom/custom-card";
import {IHomeConfig, INewsAndEvents} from "@/models/config";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {useNewsEvents} from "@/app/admin/config/(hooks)/use-news-events";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {RootState} from "@/redux/store";
import {useSelector} from "react-redux";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Checkbox} from "@/components/ui/checkbox";
import {Loader2} from "lucide-react";
import {Label} from "@/components/ui/label";

interface IProps {
    newsAndEvents: INewsAndEvents[];
    setCloneConfig: React.Dispatch<React.SetStateAction<IHomeConfig>>;
    handleChangeImage?: any;
    imageUrls: string[];
    readonly?: boolean;
    openModal?: () => void;
}

const NewsAndEvents = memo(
    ({newsAndEvents, setCloneConfig, handleChangeImage, imageUrls, readonly, openModal}: IProps
    ) => {
        const {refetch, loading} = useNewsEvents('all', false);
        const [openList, setOpenList] = useState(false);
        const newsEventsResearches = useSelector((state: RootState) => state.config.newsEventsResearches);
        const handleSelectFromList = () => {
            refetch();
            setOpenList(true);
        }

        const handleSelectNews = (checked: any, current: INewsAndEvents) => {
            if (!newsAndEvents.some(item => item._id === current._id)) {
                setCloneConfig((prev: any) => ({
                    ...prev,
                    news_and_events: [...prev.news_and_events, current]
                }))
            } else {
                setCloneConfig((prev: any) => ({
                    ...prev,
                    news_and_events: prev.news_and_events.filter((item: any) => item._id !== current._id)
                }))
            }
        }

        return <>
            <CustomCard
                title={
                    <div className={'w-full flex items-center justify-between'}>
                        <h3>Tin tức và sự kiện</h3>
                        <Button onClick={handleSelectFromList}>Chọn từ danh sách</Button>
                    </div>
                }
                className={'sm:col-span-1'}
            >
                {
                    newsAndEvents.length > 0 ? (
                        <div className={'grid gap-3 max-h-[480px] overflow-y-auto'}>
                            {newsAndEvents?.map((item, index) => (
                                <div className={'flex justify-between items-center gap-4 min-w-0 mr-2'} key={index}>
                                    <Accordion type="single" collapsible
                                               className="w-full border rounded-md shadow-sm">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger
                                                className="h-[50px] cursor-pointer px-4 flex items-center justify-between text-base font-medium w-full hover:no-underline">
                                                <div
                                                    className={'text-ellipsis w-full overflow-hidden whitespace-nowrap'}>{item.title}</div>
                                            </AccordionTrigger>
                                            <AccordionContent className="p-4 border-t">
                                                <NewsEventsItem
                                                    fileName={''}
                                                    readonly={readonly}
                                                    data={item} handleImageChange={handleChangeImage}
                                                    index={index}
                                                    imageUrl={imageUrls[index]}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
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
                        <DialogTitle>Chọn tin tức, sự kiện và nghiên cứu</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="news">
                        <TabsList className={'w-full'}>
                            <TabsTrigger value="news">Tin tức</TabsTrigger>
                            <TabsTrigger value="events">Sự kiện</TabsTrigger>
                            <TabsTrigger value="researches">Nghiên cứu</TabsTrigger>
                        </TabsList>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> :
                            <>
                                <TabsContent value="news" className={'mt-2'}>
                                    <div className={'space-y-3'}>
                                        {newsEventsResearches.filter((item: INewsAndEvents) => item.type === 'news').map((item: INewsAndEvents) => (
                                            <div className={'flex items-start gap-3'} key={item._id}>
                                                <Checkbox
                                                    disabled={newsAndEvents.length === 3 && !newsAndEvents.some(i => i._id === item._id)}
                                                    value={item._id}
                                                    checked={newsAndEvents.some(i => i._id === item._id)}
                                                    onCheckedChange={(checked) => handleSelectNews(checked, item)}
                                                />
                                                <Label htmlFor={item._id}>{item.title}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="events" className={'mt-2'}>
                                    <div className={'space-y-3'}>
                                        {newsEventsResearches.filter((item: INewsAndEvents) => item.type === 'event').map((item: INewsAndEvents) => (
                                            <div className={'flex items-start gap-3'} key={item._id}>
                                                <Checkbox
                                                    disabled={newsAndEvents.length === 3 && !newsAndEvents.some(i => i._id === item._id)}
                                                    value={item._id}
                                                    checked={newsAndEvents.some(i => i._id === item._id)}
                                                    onCheckedChange={(checked) => handleSelectNews(checked, item)}
                                                />
                                                <Label htmlFor={item._id}>{item.title}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="researches" className={'mt-2'}>
                                    <div className={'space-y-3'}>
                                        {newsEventsResearches.filter((item: INewsAndEvents) => item.type === 'research').map((item: INewsAndEvents) => (
                                            <div className={'flex items-start gap-3'} key={item._id}>
                                                <Checkbox
                                                    disabled={newsAndEvents.length === 3 && !newsAndEvents.some(i => i._id === item._id)}
                                                    value={item._id}
                                                    checked={newsAndEvents.some(i => i._id === item._id)}
                                                    onCheckedChange={(checked) => handleSelectNews(checked, item)}
                                                />
                                                <Label htmlFor={item._id}>{item.title}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <div className={'text-sm text-gray-500 text-center mt-6 -mb-1 font-medium'}>
                                    Tổng số đã chọn: <span
                                    className={newsAndEvents.length < 3 ? 'text-red-500' : ''}>{newsAndEvents.length}
                                    </span>/3
                                </div>
                                <div className={'text-center text-gray-500 italic text-sm font-bold'}>Vui lòng nhấn nút
                                    Cập nhật sau khi lựa chọn xong
                                </div>
                            </>
                        }
                    </Tabs>
                </DialogContent>
            </Dialog>
        </>
    })

export default NewsAndEvents;
