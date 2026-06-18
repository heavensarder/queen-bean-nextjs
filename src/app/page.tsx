import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SecondSection from "@/components/SecondSection";
import ThirdSection from "@/components/ThirdSection";
import FourthSection from "@/components/FourthSection";
import FifthSection from "@/components/FifthSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import { getFrontendContent } from "@/lib/frontend";

export default async function Home() {
  const homeHeroContent = await getFrontendContent('home_hero') || {
    backgroundImage: "https://i.postimg.cc/J0HXDkNG/hero-background.jpg",
    foodImage: "https://i.postimg.cc/gct4xyWZ/omelete-heroimage.png",
    texts: [
      "THIS IS NOT<br />JUST FOOD.",
      "THIS IS OUR<br />PHILOSOPHY.",
      "IT'S ABOUT<br />TIME.",
      "TIME FOR SLOWING<br />DOWN.",
      "TIME FOR<br />CONNECTION."
    ]
  };

  const homeSecondContent = await getFrontendContent('home_second_section') || {
    scriptTitle: "Better Choice",
    heading: "ENJOY THE TASTE<br />OF LIVING BETTER",
    paragraph: "Enjoy delicious and healthy meals with our Better Choices, created in collaboration with nutritionist Lut Van Lierde and inspired by the Planetary Health Diet. Each dish meets strict nutritional criteria, ensuring a perfect balance of flavor and well-being.",
    button1Text: "Learn more",
    button1Link: "#",
    button2Text: "View menu",
    button2Link: "/menu",
    image: "https://i.postimg.cc/pLTXCncL/customer-image-2nd-section.jpg"
  };

  const homeThirdContent = await getFrontendContent('home_third_section') || {
    scriptTitle: "Welcome home",
    heading: "PLEASE TAKE<br />YOUR TIME",
    paragraph: "Our restaurants, much like the vibrant community around them, embody a blend of new and contemporary design with traditional bakery roots.",
    button1Text: "Find bakery",
    button1Link: "#locations",
    image: "https://i.postimg.cc/7Yqbfnd0/restaurant-view-3rd-section.jpg"
  };

  const homeFourthContent = await getFrontendContent('home_fourth_section') || {
    scriptTitle: "Our dishes",
    heading: "SIMPLE. FRESH. HONEST.",
    paragraph: "Our menu celebrates natural, honest ingredients, prepared fresh every day. And at the heart of it all is the bread that brings everything together.",
    button1Text: "Get Inspired by our Menu",
    button1Link: "/menu",
    image1: "https://i.postimg.cc/4dTHwk2X/item-1.jpg",
    image2: "https://i.postimg.cc/j5rnv03s/item-2.jpg",
    image3: "https://i.postimg.cc/TwqL47B8/item-3.jpg",
    image4: "https://i.postimg.cc/qRXh5bWV/item-4.jpg"
  };

  const homeFifthContent = await getFrontendContent('home_fifth_section') || {
    text1: "FOUR INGREDIENTS.",
    text2: "MILLIONS OF LOAVES.",
    text3: "ONE TRADITION.",
    button1Text: "Tour the Atelier",
    button1Link: "#",
    videoUrl: "https://videos.pexels.com/video-files/7405929/7405929-uhd_2560_1440_24fps.mp4"
  };

  const homeLocationContent = await getFrontendContent('home_location_section') || {
    scriptTitle: "Visit us",
    heading: "OUR LOCATION",
    locationName: "Queen Bean",
    locationCity: "Philadelphia, PA",
    directionsLink: "https://maps.google.com/?q=246+S+11th+St,+Philadelphia,+PA+19107",
    addressLine1: "246 South 11th Street",
    addressLine2: "Philadelphia, PA 19107",
    phone: "(267) 761-4910",
    email: "queenbeanphilly@gmail.com",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116098.79814347535!2d-75.29684884299014!3d39.95066618242495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6c6266c542f15%3A0x817b911039e59fba!2s246%20S%2011th%20St%2C%20Philadelphia%2C%20PA%2019107%2C%20USA!5e1!3m2!1sen!2sbd!4v1781623646838!5m2!1sen!2sbd",
    generalHours: "6:00 AM - 6:00 PM",
    orderButtonText: "ORDER ONLINE",
    orderButtonLink: "/menu"
  };

  return (
    <main className="min-h-screen bg-[#F2EFEB]">
      <Navbar />
      <Hero content={homeHeroContent} />
      <SecondSection content={homeSecondContent} />
      <ThirdSection content={homeThirdContent} />
      <FourthSection content={homeFourthContent} />
      <FifthSection content={homeFifthContent} />
      <LocationSection content={homeLocationContent} />
      <Footer />
    </main>
  );
}
