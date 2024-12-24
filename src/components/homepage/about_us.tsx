import { BellIcon, RocketIcon, MapPin } from "lucide-react";
import { OrbitingCirclesComponent } from "./orbiting-circles";

const features = [
  {
    name: "Discover Seamlessly.",
    description:
      "Get up to speed with everything Seoul has to offer - from tourism and education to job opportunities - all in one place. Focus on exploring the city, not searching for information.",
    icon: MapPin,
  },
  {
    name: "Stay Informed.",
    description:
      "Access real-time updates on key services, including transportation, healthcare, and local businesses, making your visit or stay smoother and more convenient.",
    icon: BellIcon,
  },
  {
    name: "Built for the Future.",
    description:
      "With Seoul’s advanced infrastructure, this platform is designed to grow with the city, providing you with the latest information and services as the city evolves.",
    icon: RocketIcon,
  },
];

const AboutUs = () => {
  return (
    <div className="overflow-hidden">
      <div className="mx-auto px-6 lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl mt-2 font-semibold tracking-tight">
                Discover <span className="text-primary">Seoul</span> Like Never Before
              </p>
              <p className="mt-6 leading-8 text-muted-foreground">
                Uncover the best of Seoul where tradition meets modernity. From
                iconic landmarks to efficient transport, we make exploring the
                city seamless for everyone.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 leading-7 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-primary">
                      <feature.icon
                        className="absolute left-1 top-1 h-5 w-5 "
                        aria-hidden="true"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline text-muted-foreground">
                      {feature.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="flex items-center justify-center lg:justify-end">
            <OrbitingCirclesComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
