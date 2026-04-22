import { Phone } from "lucide-react";
import { useState, useEffect } from "react";

const FloatingContact = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-[136px] md:bottom-24 right-4 md:right-6 z-40 flex flex-col items-end gap-3 transition-all duration-500 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
      }`}
    >
      {/* Messenger */}
      <a
        href="https://m.me/113063891899662"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 group relative"
      >
        <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute right-[60px]">
          Chat Messenger
        </span>
        <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform float-pulse-blue border border-gray-100 overflow-hidden">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg" alt="Messenger" className="w-[50px] h-[50px] object-cover scale-[1.05]" />
        </div>
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0898273899"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 group relative"
      >
        <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute right-[60px]">
          Chat Zalo
        </span>
        <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:scale-110 transition-transform float-pulse-blue overflow-hidden border border-gray-100">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-[36px] h-[36px] object-contain" />
        </div>
      </a>

      {/* Hotline */}
      <a
        href="tel:0898273899"
        className="flex items-center gap-2 group relative"
      >
        <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap absolute right-[60px]">
          Hotline: 0898 273 899
        </span>
        <div className="w-[50px] h-[50px] rounded-full bg-[#d70018] flex items-center justify-center shadow-lg hover:scale-110 transition-transform float-pulse-red">
          <Phone className="w-5 h-5 text-white" fill="currentColor" />
        </div>
      </a>
    </div>
  );
};

export default FloatingContact;
