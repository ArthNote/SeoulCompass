import OrbitingCircles from "@/components/ui/orbiting-circles";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import Image from "next/image";

export function OrbitingCirclesComponent() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-primary to-gray-600/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:to-slate-900/10">
        Explore
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[45px] w-[45px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={70}
      >

      </OrbitingCircles>
      <OrbitingCircles
        className="h-[40px] w-[40px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={70}
      >

      </OrbitingCircles>

      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[45px] w-[45px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={140}
      >
        <Icons.tourism />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[40px] w-[40px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={140}
      >
        <Icons.job />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[40px] w-[40px] border-none bg-transparent"
        reverse
        radius={210}
        duration={20}
      >
        <Icons.business />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[40px] w-[40px] border-none bg-transparent"
        reverse
        radius={210}
        duration={20}
        delay={20}
      >
        <Icons.education />
      </OrbitingCircles>
    </div>
  );
}

const Icons = {
  tourism: (props: IconProps) => (
    <Image src="/seoul-tower.png" alt="Tourism" width={100} height={100} />
  ),
  education: (props: IconProps) => (
    <Image src="/education.png" alt="Education" width={100} height={100} />
  ),
  business: (props: IconProps) => (
    <Image src="/briefcase.png" alt="Business" width={100} height={100} />
  ),
  job: (props: IconProps) => (
    <Image src="/job.png" alt="Job" width={100} height={100} />
  ),
};