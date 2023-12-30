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
      <header className="w-full h-16">
          <nav className="w-full h-full pt-4 pl-6 pr-6">
            <div className="w-full h-full">
              <input type="text" className="w-full h-full rounded-md p-2" placeholder="Search for a toilet" />
            </div>
          </nav>
        </header>
        <main className="w-full" style={{"height": "calc(100svh - 4rem)"}}>
          <Map />
        </main>
    </Fragment>
      );
};