import { Navbar } from './components/Navbar';
import  {Hero} from './components/landing/Hero';

export default function LandingPage() {
  return (
    <main className=" bg-[#f9f0eb] min-h-screen text-neutral-900">
      <div className=' mx-auto'>
      <Hero />
      </div>
    </main>
  );
}