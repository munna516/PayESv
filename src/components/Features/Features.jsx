import {
  FaLock,
  FaCode,
  FaHeadset,
} from "react-icons/fa";
import { FiTool } from "react-icons/fi";
import { MdPayment, MdUndo } from "react-icons/md";
import { AiOutlineLink, AiOutlineThunderbolt, AiOutlineWarning } from "react-icons/ai"
import { Card, CardContent } from "../ui/card";

const services = [
  {
    icon: <FiTool size={40} className="text-primary text-purple-400" />,
    title: "Simple Integration System",
    description:
      "Integrate with ease using our system that Connect applications and data sources,",
  },
  {
    icon: <FaLock size={40} className="text-primary text-purple-400" />,
    title: "Secure Payment Processing",
    description:
      "End-to-end encryption and tokenization to protect sensitive card and user data.",
  },
  {
    icon: <MdPayment size={40} className="text-primary text-purple-400" />,
    title: "Multiple Payment Methods Support",
    description:
      "Accepts Bkash, Rocket, Nogod, credit/debit cards, bank transfers etc.",
  },
  {
    icon: (
      <AiOutlineWarning size={40} className="text-primary text-purple-400" />
    ),
    title: "Fraud Detection & Prevention",
    description:
      "Uses AI or rule-based checks to identify and block suspicious transactions",
  },
  {
    icon: <AiOutlineThunderbolt size={40} className="text-primary text-purple-400" />,
    title: "Real-time Transaction Processing",
    description:
      "Instant processing with confirmation of payment success or failure",
  },
  {
    icon: <FaCode size={40} className="text-primary text-purple-400" />,
    title: "API & SDK Integration",
    description:
      "Professional strategies to boost your business growth and reach",
  },
  {
    icon: <MdUndo size={40} className="text-primary text-purple-400" />,
    title: "Refunds and Chargeback Management",
    description:
      "Streamlined processes for issuing refunds and handling chargebacks/disputes",
  },

  {
    icon: <AiOutlineLink size={40} className="text-primary text-purple-400" />,
    title: "Payment Links or QR Codes",
    description:
      "Generate and share payment links or dynamic QR codes for easy customer payments",
  },
  {
    icon: <FaHeadset size={40} className="text-primary text-purple-400" />,
    title: "24/7 Customer & Technical Support",
    description:
      "Responsive support to resolve issues quickly for both merchants and customers",
  },
];
export default function Features() {
  return (
    <>
      <h1 className="text-2xl md:text-3xl lg:text-4xl dark:text-white font-bold mb-3 text-center mt-12 lg:mt-14">
        Core Features of PayESv
      </h1>
      <p className=" text-muted-foreground  mb-5 lg:mb-8 text-center lg:w-1/2 mx-auto">
        Equip your business with powerful tools to easily accept online payments
        and offer your customers a smooth & satisfying experience.
      </p>

      <div className="mt-10">
        <div className="flex flex-wrap justify-center gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow w-full sm:w-[45%] lg:w-[32%] bg-green-50 dark:bg-slate-700 flex flex-col items-center text-center p-6 gap-4"
            >
              <div className="border-2 px-3 py-2 rounded-lg bg-white hover:bg-green-500 dark:bg-slate-700 dark:border-0">{service.icon}</div>
              <CardContent className="flex flex-col items-center">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
