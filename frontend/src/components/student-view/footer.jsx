import { Linkedin, Twitter, MessageCircle, GraduationCap } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-black text-white pb-16 px-6 relative overflow-hidden">
      {/* Background Outline Text */}
      <div className=" w-full flex justify-center opacity-20 pointer-events-none select-none ">
        <h1 className="text-[15vw] font-bold text-transparent tracking-[30px] stroke-white" style={{ WebkitTextStroke: '1px white' }}>
          LMS
        </h1>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        {/* Left Section: Logo & Socials */}
        <div className="flex flex-col space-y-8">
          <div className="flex items-center space-x-2">
            <div className="rounded-full flex items-center justify-center gap-4 font-neu-machina ">
               <span className="text-white font-bold text-xl"><GraduationCap className="w-10 h-10 text-orange-500"/></span>
               <span className="text-white font-bold text-2xl">LMS</span>
            </div>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <MessageCircle className="h-6 w-6" />
            </a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
          </div>
        </div>

        {/* About Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg tracking-widest text-zinc-500 uppercase">About</h3>
          <ul className="space-y-3 text-zinc-400 font-medium">
            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
            <li className="hover:text-white cursor-pointer transition-colors">Support</li>
            <li className="hover:text-white cursor-pointer transition-colors">Terms and Condition</li>
            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
          </ul>
        </div>

        

        {/* Contact Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg tracking-widest text-zinc-500 uppercase">Contact</h3>
          <ul className="space-y-3 text-zinc-400 font-medium">
            <li>
                <span className="block text-zinc-500 text-xs">11am - 8pm</span>
                <span className="text-zinc-300 font-bold">+91 93xxxxxxxx</span>
            </li>
            <li className="hover:text-white cursor-pointer truncate">sunnymehta.here@gmail.com</li>
            <li className="text-xs leading-relaxed text-zinc-500">
                Delhi, India
            </li>
          </ul>
        </div>


        {/* Secure Payment Column */}
        <div className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg tracking-widest text-zinc-500 uppercase">Secure Payment</h3>
          <ul className="space-y-2 text-zinc-400 font-medium list-disc ml-4">
            <li className="hover:text-white transition-colors">Secured by PayPal 256-bit encryption</li>
            <li className="hover:text-white transition-colors">PayPal, Visa, Mastercard, AMEX</li>
            <li className="hover:text-white transition-colors">No hidden transaction fees</li>
            <li className="hover:text-white transition-colors">Instant payment confirmation</li>
            <li className="hover:text-white transition-colors">Global payment support</li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer;
