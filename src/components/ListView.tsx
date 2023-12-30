import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import InfiniteScroll from 'react-infinite-scroll-component';

import Image from 'next/image';
import generic_img_filler from '../../public/generic_img_filler.svg';
import { ListViewProps } from '@/types/index';
import { Toilet } from '@/types/index';


const ListView: React.FC<ListViewProps> = ( props: { items: Toilet[] }) => {
    const items = props.items;
    return (
        <InfiniteScroll
            dataLength={items.length} //This is important field to render the next data
            next={fetchData}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
                </p>
            }
            // below props only if you need pull down functionality
            refreshFunction={fetchData}
            pullDownToRefresh
            pullDownToRefreshThreshold={50}
            pullDownToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
            }
            releaseToRefreshContent={
                <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
            }
            >
           { items.map((item, index) => {
                return (
                    <Card key={index} className="border-none">
                        <CardHeader>
                            <CardTitle className="text-center">{item.site}</CardTitle>
                            <CardDescription>{item.content}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col justify-items-center justify-center">
                                <div className="flex justify-center">
                                    <Image src={generic_img_filler}
                                        alt="image of bathroom and location" width={350} height={350} className="border-2 border-gray-200 rounded-md" />
                                </div>
                                <ul>
                                    <li className="text-center"><span className="font-bold">Address: </span>{item.address}</li>
                                    {/* <li>Hours: {item.hours.}</li> */}
                                    {/* <li>Public: {item.public ? "Yes" : "No"}</li> */}
                                    {/* <li>Last Updated: {item.updatedAt.toDateString()}</li> */}
                                    {/* <li>Created: {item.createdAt.toDateString()}</li> */}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                        </CardFooter>
                    </Card>
                    );
                })
            }
        
        </InfiniteScroll>
        );
}

async function fetchData() {
    const response = await fetch('http://localhost:3000/api/toilets');
    const data = await response.json();

    return {
        props: { 
            items: data,
        }
    };
}

export default ListView;