import Image from 'next/image'
import image from '@/images/logos/logo.png'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <div className="text-bold">
      <Image src={image.src} alt="Logo" width={32} height={32} />
    </div>
  )
}
