import { Card, CardContent } from "@/components/ui/card";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

export default function ContactInfo() {
  const contacts = [
    {
      icon: <FaPhoneAlt size={32} className="text-red-600" />,
      title: "+8801977693977",
      description:
        "We answer by phone from Saturday to Thursday from 10:00 am until 6:00 pm.",
    },
    {
      icon: <FaEnvelope size={32} className="text-teal-500" />,
      title: "hello@esvpay.com",
      description:
        "We will respond to your email within 5 hours on business days.",
    },
    {
      icon: <FaMapMarkerAlt size={32} className="text-indigo-500" />,
      title: "Bandarban Sadar, Bandarban",
      description: "Come visit us from Saturday to Thursday in our office time",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {contacts.map((item, index) => (
          <div key={index}>
            <Card className="bg-green-50 dark:bg-slate-700 text-center rounded-xl p-6 transform transition duration-300 hover:scale-105 origin-top">
              <CardContent className="flex flex-col items-center gap-4">
                {item.icon}
                <h3 className="text-xl font-bold whitespace-pre-wrap">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
