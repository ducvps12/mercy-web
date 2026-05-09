import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import SEOHead from "@/components/SEOHead";
import { makeSiteUrl } from "@/lib/config";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Yêu cầu của bạn đã được gửi thành công!");
        
        // Reset form
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: ""
        });
      } else {
        toast.error(data.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <SEOHead
        title="Liên hệ hợp tác"
        description="Liên hệ và hợp tác cùng Mercy để phát triển kinh doanh."
        canonical={makeSiteUrl("/lien-he")}
      />
      <Header />

      <main>

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gọi ngay cho chúng tôi</h3>
                  <a href="tel:0898273899" className="text-primary hover:underline font-semibold">0898 273 899</a>
               </div>

               <div className="flex flex-col items-center p-6 bg-card border border-border rounded-xl text-center hover:shadow-lg transition-all">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold mb-2">Gửi email</h3>
                  <a href="mailto:mercyglobalstore@gmail.com" className="text-primary hover:underline font-semibold">mercyglobalstore@gmail.com</a>
               </div>
            </div>

            <div className="mt-16 bg-muted/50 p-8 rounded-xl border border-border">
                <h2 className="text-2xl font-bold text-center mb-6">Gửi tin nhắn cho chúng tôi</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                          type="text" 
                          placeholder="Họ và tên" 
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          required
                        />
                        <input 
                          type="tel" 
                          placeholder="Số điện thoại" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                          required
                        />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                      required
                    />
                    <textarea 
                      placeholder="Nội dung tin nhắn" 
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      required
                    ></textarea>
                    <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors">
                        Gửi Yêu Cầu
                    </button>
                </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
      <ScrollToTop />
    </div>
  );
};

export default Contact;
