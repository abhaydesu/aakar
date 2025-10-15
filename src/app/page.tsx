import { Navbar } from './components/Navbar';
import  Hero from './components/landing/Hero';

export default function LandingPage() {
  return (
    <main className=" bg-neutral-200 min-h-screen text-neutral-900">
      <Navbar />
      <div className=' mx-auto'>
      <Hero />
      </div>
    </main>
  );
}