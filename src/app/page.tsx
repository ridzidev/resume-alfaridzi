import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Sidebar />
      <Hero />
      <About />
      <Projects />
      <Publications />
      <Contact />
      <Footer />
    </main>
  );
}
