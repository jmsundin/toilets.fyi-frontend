import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';

import logo from '../../public/logo.svg';
import generic_img_filler from '../../public/generic_img_filler.svg';

import { Toilet } from '@/types/index';
import ListView from '@/components/ListView';
import Map from '@/components/Map';


export default function Home(props: { items: Toilet[] }) {
  const items = props.items;
  const [showMap, setShowMap] = useState<boolean>(false);

  const handleShowMapClick = (e) => {
    e.preventDefault();
    setShowMap(true);
  }

  return (
    <Fragment>
      <header className="z-10 fixed top-0 w-full h-32">
          <nav className="flex flex-col gap-4 w-full h-full pt-4 pl-6 pr-6" style={{"background": "hsl(var(--background)"}}>
            <Link href="/" className="flex flex-row gap-4 items-center" aria-label="logo">
              <Image src={logo} width={40} height={40} alt="logo" />
              <span className="text-2xl font-sans">toilets.fyi</span>
            </Link>
            <div className="w-full h-16">
              <input type="text" className="w-full h-full rounded-2xl border-2 p-4 placeholder:text-lg placeholder:text-sans" placeholder="Search or filter toilets" />
            </div>
          </nav>
      </header>
      <main className="absolute top-32 w-full" style={{"height": "calc(100svh - 4rem)"}}>
      { !showMap ? 
        <section className="w-full h-full">
          <ListView items={items} />
        </section>
        : <Map />
      }
      </main>
      <footer className="fixed bottom-0 w-full h-16">
        <div className="flex justify-center w-full h-full">
          <button onClick={handleShowMapClick} className="w-24 h-12 border-2 rounded-2xl"  style={{"background": "hsl(var(--background)"}}>Map View</button>
        </div> 
      </footer>
    </Fragment>
    );
};

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/api/toilets');
  const data = await response.json();
  console.log(data);

  if (data.length > 0) {
    return {
      props: { items: data }
    };
    
  } else {
    return {
      props: {
          items: [
            {
              id: 1,
              site: "Toilet in Park 1",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
            {
              id: 2,
              site: "Toilet in Park 2",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
            {
              id: 3,
              site: "Toilet in Park 3",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
            {
              id: 4,
              site: "Toilet in Park 4",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
            {
              id: 5,
              site: "Toilet in Park 5",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
            {
              id: 6,
              site: "Toilet in Park 6",
              address: "123 Park Ave",
              latitude: 40.748817,
              longitude: -73.985428,
              public: true,
              hours: new Date(),
              content: "Nice bathroom",
              images: [generic_img_filler],
              updatedAt: new Date(),
              createdAt: new Date(),
            },
          ]
      }
  }
}
  
};