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
        <main className="w-full" style={{"height": "calc(100svh - 4rem)"}}>
          <Map />
        </main>
    </Fragment>
      );
};