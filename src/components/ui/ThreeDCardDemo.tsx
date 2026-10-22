'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CardContainer, CardBody, CardItem } from './3d-card';

export function ThreeDCardDemo() {
  return (
    <CardContainer
      className="inter-var"
      containerClassName="py-8"
      maxTilt={5}
      lift={6}
      glowColor="rgba(239, 68, 68, 0.3)"
    >
      <CardBody className="bg-[#121018] relative group/card border border-white/10 w-auto sm:w-[30rem] h-auto rounded-2xl p-6 border-red-500/20">
        <CardItem
          translateZ={20}
          className="text-xl font-bold text-white tracking-wide"
        >
          HACKWITHMUMBAI 2.0
        </CardItem>
        <CardItem
          as="p"
          translateZ={30}
          className="text-neutral-400 text-sm max-w-sm mt-2"
        >
          High-velocity student hackathon engineering marathon. 340+ builders in sprint.
        </CardItem>
        <CardItem translateZ={40} className="w-full mt-4">
          <div className="relative w-full h-60 rounded-xl overflow-hidden border border-white/10">
            <Image
              src="/images/events/rocketride_hackers.jpg"
              height="1000"
              width="1000"
              className="h-full w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Hackathon sprint thumbnail"
            />
          </div>
        </CardItem>
        <div className="flex justify-between items-center mt-6">
          <CardItem
            translateZ={20}
            as={Link}
            href="/events"
            className="px-4 py-2 rounded-xl text-xs font-normal text-white hover:text-red-400"
          >
            Explore Chronicle →
          </CardItem>
          <CardItem
            translateZ={25}
            as={Link}
            href="/join"
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500"
          >
            Register Now
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
