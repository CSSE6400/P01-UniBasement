import Image from 'next/image';
import logo from '@/images/logos/logo.svg';
import logoWhite from '@/images/logos/logo-white.svg';

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
    return (
        <div className="text-bold">
            <Image
                src={logoWhite.src}
                alt="Logo"
                width={32}
                height={32}
                className="mx-auto dark:hidden"
            />
            <Image
                src={logo.src}
                alt="Logo"
                width={32}
                height={32}
                className="mx-auto hidden dark:block"
            />
        </div>
    );
}
