import Image from 'next/image'
import CC_logo from "../../../public/assets/images/CC_logo.png"

export default function Trade() {
  return (
    <div className='mt-10 md:mt-10 flex flex-col items-center justify-center gap-4'>
        <Image src={CC_logo} height={50} width={50} alt='trade' />
        <p className='text-sm text-muted-foreground'>Trade License No : Bandarban-06151</p>
    </div>
  )
}
