import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const Questions = () => {
  return (
    <div className="w-full ">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem
          value="item-1"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            What is Payesv?
          </AccordionTrigger>
          <AccordionContent>
            Payesv is a secure, fast and scalable payment gateway designed to
            simplify online transactions for businesses of all sizes. With easy
            integration, low fees and full compliance, Payesv helps you accept
            payments seamlessly — whether you're running an e-commerce store,
            subscription service or digital platform.Lets Empower your business
            with Payesv.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-2"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            Where Can I integrate Payesv?
          </AccordionTrigger>
          <AccordionContent>
            Payesv can be seamlessly integrated into various programming
            languages such as PHP, JavaScript, Java, Python, and frameworks like
            Laravel, Nodejs and Woocommerce among others.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-3"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            How does it work?
          </AccordionTrigger>
          <AccordionContent>
            It works by providing a secure API that allows businesses to send
            and processed through Payesv's secure servers. The funds are then
            transferred to your account after verification, ensuring a smooth
            and reliable transaction process.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem
          value="item-4"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            How can I use Payesv?
          </AccordionTrigger>
          <AccordionContent>
            To use Payesv, you can follow these steps: 1. Sign up for a Payesv
            account on our website. 2. Choose a suitable pricing plan. 3.
            Connect your payment gateway and other necessary APIs. 4. Customize
            your payment settings and other features according to your business
            needs. 5. Integrate the Payesv system into your website or mobile
            application. 6. Start accepting payments from your customers through
            various payment methods supported by Payesv.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-5"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            What featurs are available in Payesv?
          </AccordionTrigger>
          <AccordionContent>
            Payesv offers a range of features including: 1. Multiple payment
            methods (credit/debit cards, mobile wallets, etc.). 2. Secure
            transactions with encryption and fraud detection. 3. Easy API
            integration for developers. 4. Customizable payment pages.
            5.Detailed analytics and reporting tools. 6. Support for recurring
            payments and subscriptions.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-6"
          className=" bg-green-50 dark:bg-slate-700 border-2 border-green-100 px-4 rounded-md mb-4"
        >
          <AccordionTrigger className="text-lg">
            Is is secure to use Payesv?
          </AccordionTrigger>
          <AccordionContent>
            Absolutely, Payesv prioritizes security and employs advanced
            encryption and fraud detection measures to ensure that all
            transactions are safe.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Questions;
