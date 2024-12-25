import React from 'react'
import { TourismTable } from './table/data-table'
import { columns, Location } from "./table/columns";
import { delay } from '@/lib/utils';

const page =  () => {

  const data: Location[] = [
    {
      id: "1",
      name: "Gwangjang Market",
      description:
        "A traditional market known for its street food and textiles.",
      category: "restaurant",
      location: "88 Changgyeonggung-ro, Jongno-gu, Seoul",
      contact: "02-2267-0291",
      rating: 4.7,
      lat: 37.570365,
      lng: 126.999236,
    },
    {
      id: "2",
      name: "Lotte Hotel Seoul",
      description: "A luxury hotel located in the heart of Seoul.",
      category: "hotel",
      location: "30 Eulji-ro, Jung-gu, Seoul",
      contact: "02-771-1000",
      rating: 4.5,
      lat: 37.5663,
      lng: 126.9824,
    },
    {
      id: "3",
      name: "Namsan Seoul Tower",
      description: "A landmark attraction offering panoramic views of Seoul.",
      category: "attraction",
      location: "105 Namsangongwon-gil, Yongsan-gu, Seoul",
      contact: "02-3455-9277",
      rating: 4.6,
      lat: 37.5512,
      lng: 126.9882,
    },
    {
      id: "4",
      name: "Woori Bank Myeongdong Branch",
      description: "A major bank branch in the Myeongdong area.",
      category: "bank",
      location: "51 Myeongdong-gil, Jung-gu, Seoul",
      contact: "02-2002-1234",
      rating: 4.0,
      lat: 37.5636,
      lng: 126.982,
    },
    {
      id: "5",
      name: "Seoul Arts Center",
      description: "A theater hosting performances and cultural events.",
      category: "theater",
      location: "2406 Nambusunhwan-ro, Seocho-gu, Seoul",
      contact: "02-580-1300",
      rating: 4.8,
      lat: 37.4781,
      lng: 127.0102,
    },
    {
      id: "6",
      name: "Gangnam Station Bus Stop",
      description: "A central bus station in the Gangnam district.",
      category: "bus_station",
      location: "Gangnam-daero, Seocho-gu, Seoul",
      contact: "N/A",
      rating: 3.9,
      lat: 37.4981,
      lng: 127.0276,
    },
    {
      id: "7",
      name: "Myeongdong Kyoja",
      description: "A famous noodle restaurant in Myeongdong.",
      category: "restaurant",
      location: "29 Myeongdong 10-gil, Jung-gu, Seoul",
      contact: "02-776-5348",
      rating: 4.3,
      lat: 37.5633,
      lng: 126.9862,
    },
    {
      id: "8",
      name: "The Shilla Seoul",
      description: "A high-end hotel offering premium services and amenities.",
      category: "hotel",
      location: "249 Dongho-ro, Jung-gu, Seoul",
      contact: "02-2233-3131",
      rating: 4.7,
      lat: 37.5572,
      lng: 126.9941,
    },
    {
      id: "9",
      name: "Bukchon Hanok Village",
      description:
        "A preserved historic village featuring traditional Korean houses.",
      category: "attraction",
      location: "37 Gyedong-gil, Jongno-gu, Seoul",
      contact: "02-2148-4161",
      rating: 4.5,
      lat: 37.5826,
      lng: 126.9833,
    },
    {
      id: "10",
      name: "KB Bank Jongno Branch",
      description: "A convenient banking location in Jongno.",
      category: "bank",
      location: "19-1 Jongno 2-ga, Jongno-gu, Seoul",
      contact: "02-2002-5678",
      rating: 4.2,
      lat: 37.5703,
      lng: 126.9828,
    },
  ];
  return (
    <TourismTable columns={columns} data={data} />
  )
}

export default page
