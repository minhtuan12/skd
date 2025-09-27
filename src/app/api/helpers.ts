import {NextRequest, NextResponse} from "next/server";
import connectDb from "@/lib/db";
import Config from "@/models/config";
import NewsEvents from "@/models/news-events";
import {Types} from "mongoose";
import PolicyDocument from "@/models/policy-document";

const {ObjectId} = Types;

const imageExtensions = ['jpeg', 'png', 'jpg', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'ico', 'webp'];
const videoExtensions = ['mp4', 'm4v', 'm4p', 'mov', 'qt', 'avi', 'wmv', 'mkv', 'webm', 'mts', 'm2ts', 'ts', 'ogv', 'ogg', '3gp', 'flv'];
const pageLimit = 4;

export async function getConfig(request: NextRequest) {
    try {
        await connectDb();

        const {searchParams} = new URL(request.url);
        const page = searchParams.get('page');
        let config: any;
        if (page) {
            config = await Config.findOne().select(page).lean();
            if (page === 'home' && config?.home?.news_and_events) {
                const newsAndEvents = await NewsEvents.find({
                    _id: {$in: config.home.news_and_events.map((id: string) => new ObjectId(id))}
                })
                const policyDocuments = await PolicyDocument.find({
                    _id: {$in: config.home.agricultural_policy.map((id: string) => new ObjectId(id))}
                })
                config = {
                    ...config,
                    home: {
                        ...config.home,
                        news_and_events: newsAndEvents,
                        agricultural_policy: policyDocuments
                    }
                }
            } else if (page === 'news-events') {
                const type = searchParams.get('type') || 'news';
                const pageNumber = parseInt(searchParams.get('pageNumber') || '1');
                if (pageNumber === 0) {
                    config = await NewsEvents.find({
                        is_deleted: false,
                        type
                    }).sort('-date');
                    return NextResponse.json({config: {[type]: config}});
                }
                if (type === 'researches') {
                    const result = await NewsEvents.aggregate([
                        {
                            $match: {type: 'research', is_deleted: false}
                        },
                        {$sort: {date: -1}},
                        {
                            $facet: {
                                data: [
                                    {$skip: 9 * (pageNumber - 1)},
                                    {$limit: 9}
                                ],
                                totalCount: [
                                    {$count: "count"}
                                ]
                            }
                        },
                        {
                            $project: {
                                data: 1,
                                total: {$arrayElemAt: ["$totalCount.count", 0]},
                                totalPages: {
                                    $ceil: {$divide: [{$arrayElemAt: ["$totalCount.count", 0]}, 9]}
                                }
                            }
                        }
                    ]);
                    config = {researches: result[0]};
                } else {
                    const skip = (pageNumber - 1) * pageLimit;

                    const result = await NewsEvents.aggregate([
                        {
                            $facet: {
                                topNews: [
                                    {$match: {type: "news", is_deleted: false}},
                                    {$sort: {is_highlight: -1, updatedAt: -1}},
                                    {$limit: 3}
                                ],
                                newsData: [
                                    {$match: {type: "news", is_deleted: false}},
                                    {$sort: {date: -1}},
                                    {$skip: 3},
                                    {$skip: skip},
                                    {$limit: pageLimit}
                                ],
                                newsCount: [
                                    {$match: {type: "news", is_deleted: false}},
                                    {$count: "total"}
                                ],
                                eventsData: [
                                    {$match: {type: "event", is_deleted: false}},
                                    {$sort: {createdAt: -1}},
                                ],
                                eventsCount: [
                                    {$match: {type: "event", is_deleted: false}},
                                    {$count: "total"}
                                ]
                            }
                        } as any
                    ])
                    const data = result[0];
                    const totalNews = Math.max((data.newsCount[0]?.total || 0) - 3, 0);

                    const news = {
                        topNews: data.topNews,
                        data: data.newsData,
                        total: totalNews,
                        page: pageNumber,
                        totalPages: Math.ceil(totalNews / pageLimit),
                    }
                    const events = {
                        data: data.eventsData,
                        total: data.eventsCount[0]?.total || 0,
                        page: pageNumber,
                        totalPages: Math.ceil((data.eventsCount[0]?.total || 0) / pageLimit),
                    }
                    config = {news, events};
                }
            }
        } else {
            config = await Config.findOne().lean();
        }

        if (!config) {
            return NextResponse.json(
                {error: 'Không tồn tại thông tin cấu hình'},
                {status: 404}
            );
        }

        return NextResponse.json({config});
    } catch (error) {
        console.error('Config API error:', error);
        return NextResponse.json(
            {error: 'Internal server error', message: 'Đã có lỗi xảy ra'},
            {status: 500}
        );
    }
}

export function getResourceType(extension: string) {
    if (imageExtensions.includes(extension.toLowerCase())) {
        return 'image';
    }
    if (videoExtensions.includes(extension.toLowerCase())) {
        return 'video';
    }
    return 'raw';
}

export function capitalizeFirstWord(str: string) {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export async function changePostOrder(model: any, id: string, newOrder: number, oldOrder: number) {
    try {
        let bulkOps = [];

        if (newOrder < oldOrder) {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gte: newOrder, $lt: oldOrder}},
                    update: {$inc: {order: 1}},
                }
            });
        } else {
            bulkOps.push({
                updateMany: {
                    filter: {order: {$gt: oldOrder, $lte: newOrder}},
                    update: {$inc: {order: -1}},
                }
            });
        }
        bulkOps.push({
            updateOne: {
                filter: {_id: id},
                update: {$set: {order: newOrder}},
            }
        });

        await model.bulkWrite(bulkOps);
    } catch (e) {
        throw e;
    }
}

function secureLink(link: string) {
    if (link.includes('https')) return link;
    return link.replace('http', 'https');
}
